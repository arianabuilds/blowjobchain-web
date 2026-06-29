-- Per-partnership weekly expire rate (event-sourced) + weekly expiration RPC

create table if not exists public.updated_expire_rate (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  user_a uuid not null references auth.users (id) on delete cascade,
  user_b uuid not null references auth.users (id) on delete cascade,
  set_by uuid not null references auth.users (id) on delete cascade,
  previous_r numeric(4, 2) not null default 0,
  next_r numeric(4, 2) not null,
  constraint updated_expire_rate_user_order check (user_a < user_b),
  constraint updated_expire_rate_next_r check (next_r >= 0 and next_r <= 1),
  constraint updated_expire_rate_previous_r check (previous_r >= 0 and previous_r <= 1)
);

comment on table public.updated_expire_rate is 'Weekly expire rate changes';

create index if not exists updated_expire_rate_pair_created_idx
  on public.updated_expire_rate (user_a, user_b, created_at desc);

alter table public.updated_expire_rate enable row level security;

create policy "Partners can read updated_expire_rate for their pair"
  on public.updated_expire_rate
  for select
  to authenticated
  using (auth.uid() = user_a or auth.uid() = user_b);

grant select on table public.updated_expire_rate to authenticated;
grant all on table public.updated_expire_rate to service_role;

-- ---------------------------------------------------------------------------
-- set_partnership_expire_rate: insert rate event (caller must be inviter or invitee)
-- ---------------------------------------------------------------------------
create or replace function public.set_partnership_expire_rate (
  p_inviter uuid,
  p_invitee uuid,
  p_next_r numeric
)
returns boolean
language plpgsql
security definer
set search_path = public
as $fn$
declare
  v_uid uuid := auth.uid();
  v_ua uuid;
  v_ub uuid;
  v_prev numeric;
  v_next numeric := p_next_r;
begin
  if v_uid is null then
    raise exception 'Not authenticated';
  end if;
  if v_uid <> p_inviter and v_uid <> p_invitee then
    raise exception 'Not a member of this partnership';
  end if;
  if v_next < 0 or v_next > 1 then
    raise exception 'next_r must be between 0 and 1';
  end if;

  v_ua := least(p_inviter, p_invitee);
  v_ub := greatest(p_inviter, p_invitee);

  select coalesce(
    (
      select u.next_r
      from public.updated_expire_rate u
      where u.user_a = v_ua and u.user_b = v_ub
      order by u.created_at desc, u.id desc
      limit 1
    ),
    0::numeric
  )
  into v_prev;

  if v_prev = v_next then
    return false;
  end if;

  insert into public.updated_expire_rate (user_a, user_b, set_by, previous_r, next_r)
  values (v_ua, v_ub, v_uid, v_prev, v_next);
  return true;
end;
$fn$;

alter function public.set_partnership_expire_rate (uuid, uuid, numeric) owner to postgres;

revoke all on function public.set_partnership_expire_rate (uuid, uuid, numeric) from public;
grant execute on function public.set_partnership_expire_rate (uuid, uuid, numeric) to authenticated;
grant execute on function public.set_partnership_expire_rate (uuid, uuid, numeric) to service_role;

-- ---------------------------------------------------------------------------
-- expire_weekly_points: service_role / definer; inserts $$WEEKLY_EXPIRE$$ rows
-- ---------------------------------------------------------------------------
create or replace function public.expire_weekly_points (p_sunday date)
returns void
language plpgsql
security definer
set search_path = public
as $fn$
declare
  partnership record;
  rate numeric;
  balance_pts_inviter numeric;
  balance_pts_invitee numeric;
  expire_pts_inviter numeric;
  expire_pts_invitee numeric;
  ua uuid;
  ub uuid;
  tag text;
  w text := to_char(p_sunday, 'YYYY-MM-DD');
  expire_comment_inviter text;
  expire_comment_invitee text;
begin
  -- Tag for this week's WEEKLY_EXPIRE points entries
  tag := '$$WEEKLY_EXPIRE$$|' || w;

  -- Loop through all partnerships
  for partnership in
    select inviter, invitee from public.partnerships
  loop
    ua := least(partnership.inviter, partnership.invitee);
    ub := greatest(partnership.inviter, partnership.invitee);

    -- Get current expire rate
    select coalesce(
      (
        select u.next_r
        from public.updated_expire_rate u
        where u.user_a = ua and u.user_b = ub
        order by u.created_at desc, u.id desc
        limit 1
      ),
      0::numeric
    )
    into rate;

    -- Stop if rate = 0 (off)
    if rate <= 0 then
      continue;
    end if;

    -- Stop if already expired this week
    if exists (
      select 1
      from public.points p
      where p.comment like tag || '|%'
        and p."from" in (partnership.inviter, partnership.invitee)
        and p."to" in (partnership.inviter, partnership.invitee)
    ) then
      continue;
    end if;

    -- Calc current balances in points
    -- Inviter
    select coalesce(sum(
      case
        when p.amount > 0 and p."to" = partnership.inviter then p.amount
        when p.comment = '$$IS_CLAIM$$' and p."from" = partnership.inviter then p.amount
        when p.comment like '$$WEEKLY_EXPIRE$$%' and p."from" = partnership.inviter then p.amount
        else 0
      end
    ), 0)
    into balance_pts_inviter
    from public.points p
    where p."from" in (partnership.inviter, partnership.invitee)
      and p."to" in (partnership.inviter, partnership.invitee);

    -- Invitee
    select coalesce(sum(
      case
        when p.amount > 0 and p."to" = partnership.invitee then p.amount
        when p.comment = '$$IS_CLAIM$$' and p."from" = partnership.invitee then p.amount
        when p.comment like '$$WEEKLY_EXPIRE$$%' and p."from" = partnership.invitee then p.amount
        else 0
      end
    ), 0)
    into balance_pts_invitee
    from public.points p
    where p."from" in (partnership.inviter, partnership.invitee)
      and p."to" in (partnership.inviter, partnership.invitee);

    -- Calc expiring amounts
    expire_pts_inviter := balance_pts_inviter * rate;
    expire_pts_invitee := balance_pts_invitee * rate;

    -- Insert expiring points for inviter
    if expire_pts_inviter > 0 then
      expire_comment_inviter := tag || '|' || json_build_object(
        'was', balance_pts_inviter
      )::text;
      insert into public.points ("from", "to", amount, comment)
      values (
        partnership.inviter,
        partnership.invitee,
        -expire_pts_inviter,
        expire_comment_inviter
      );
    end if;

    -- Insert expiring points for invitee
    if expire_pts_invitee > 0 then
      expire_comment_invitee := tag || '|' || json_build_object(
        'was', balance_pts_invitee
      )::text;
      insert into public.points ("from", "to", amount, comment)
      values (
        partnership.invitee,
        partnership.inviter,
        -expire_pts_invitee,
        expire_comment_invitee
      );
    end if;
  end loop;
end;
$fn$;

alter function public.expire_weekly_points (date) owner to postgres;

revoke all on function public.expire_weekly_points (date) from public;
grant execute on function public.expire_weekly_points (date) to service_role;

-- Get current weekly expire rate for a partnership
create or replace function public.get_partnership_expiration_rate (
  p_inviter uuid,
  p_invitee uuid
)
returns numeric
language plpgsql
stable
security definer
set search_path = public
as $fn$
declare
  v_uid uuid := auth.uid();
  v numeric;
begin
  -- Auth must be inviter or invitee
  if v_uid is null then
    raise exception 'Not authenticated';
  end if;
  if v_uid <> p_inviter and v_uid <> p_invitee then
    raise exception 'Not a member of this partnership';
  end if;

  select coalesce(
    (
      select u.next_r
      from public.updated_expire_rate u
      where u.user_a = least(p_inviter, p_invitee)
        and u.user_b = greatest(p_inviter, p_invitee)
      order by u.created_at desc, u.id desc
      limit 1
    ),
    0::numeric
  )
  into v;

  return v;
end;
$fn$;

alter function public.get_partnership_expiration_rate (uuid, uuid) owner to postgres;

revoke all on function public.get_partnership_expiration_rate (uuid, uuid) from public;
grant execute on function public.get_partnership_expiration_rate (uuid, uuid) to authenticated;
grant execute on function public.get_partnership_expiration_rate (uuid, uuid) to service_role;
