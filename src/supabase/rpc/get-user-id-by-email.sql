create or replace function get_user_id_by_email (email text) 
  returns table (id uuid) 
  security definer 
as $$
begin
  return query 
    select au.id 
      from auth.users au 
      where lower(au.email) = lower($1);
end;
$$ language plpgsql;

revoke execute on function get_user_id_by_email(text) from PUBLIC;
revoke execute on function get_user_id_by_email(text) from anon;
revoke execute on function get_user_id_by_email(text) from authenticated;
