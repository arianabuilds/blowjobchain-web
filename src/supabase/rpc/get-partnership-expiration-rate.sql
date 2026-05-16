create or replace function public.get_partnership_expiration_rate (
  p_inviter uuid,
  p_invitee uuid
)
returns numeric
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v numeric;
begin
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

  return round(coalesce(v, 0), 2);
end;
$$ language plpgsql;

alter function public.get_partnership_expiration_rate (uuid, uuid) owner to postgres;

revoke all on function public.get_partnership_expiration_rate (uuid, uuid) from public;
grant execute on function public.get_partnership_expiration_rate (uuid, uuid) to authenticated;
grant execute on function public.get_partnership_expiration_rate (uuid, uuid) to service_role;
