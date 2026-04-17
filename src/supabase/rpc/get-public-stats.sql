-- Single call for public stats endpoint;

drop function if exists public.get_public_stats();
create or replace function public.get_public_stats ()
  returns table (partnerships_count bigint, total_points_granted numeric)
  language sql
  stable
  security definer
  set search_path = public
as $$
  select
    (select count(*)::bigint from public.partnerships),
    (select sum(amount)::numeric from public.points where amount > 0);
$$;

revoke execute on function public.get_public_stats() from public, anon, authenticated;
grant execute on function public.get_public_stats () to service_role;

-- select * from get_public_stats();
