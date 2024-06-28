alter policy "Partners can read each other's pub keys"
on "public"."pub_keys"
to public
using (
  user_id IN (
      SELECT p.inviter
      FROM get_partnerships_with_names() p;
    UNION
      SELECT p.invitee
      FROM get_partnerships_with_names() p;
  )
);