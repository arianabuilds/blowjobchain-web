alter policy "Partners can read each other's pub keys"
on "public"."pub_keys"
to public
using (
  user_id IN (
    SELECT inviter FROM partnerships
  UNION
    SELECT invitee FROM partnerships
  )
);