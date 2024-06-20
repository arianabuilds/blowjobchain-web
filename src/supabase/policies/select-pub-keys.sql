alter policy "Partners can read each other's pub keys"
on "public"."pub_keys"
to public
using (
    (user_id = auth.uid()) -- own user id
      OR 
    (user_id IN ( -- partners' user ids
        SELECT partnerships.inviter
            FROM partnerships
            WHERE (partnerships.invitee = auth.uid())
        UNION
        SELECT partnerships.invitee
            FROM partnerships
            WHERE (partnerships.inviter = auth.uid())
    ))
);