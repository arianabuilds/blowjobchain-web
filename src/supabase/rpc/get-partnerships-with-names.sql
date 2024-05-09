drop function get_partnerships_with_names;
create function get_partnerships_with_names () 
  returns table (created_at timestamptz, inviter uuid, invitee uuid, inviter_name text, invitee_name text) 
  security definer 
as $$
begin
  return query 
    SELECT
      p.*,
      inviter.name AS inviter_name,
      invitee.name AS invitee_name
    FROM
      partnerships AS p
      LEFT JOIN profiles AS inviter ON p.inviter = inviter.user_id
      LEFT JOIN profiles AS invitee ON p.invitee = invitee.user_id
    WHERE (p.inviter = auth.uid() OR p.invitee = auth.uid());
end;
$$ language plpgsql;

-- select * from get_partnerships_with_names();
