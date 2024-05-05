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