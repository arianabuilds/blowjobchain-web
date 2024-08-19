alter policy "Enable read if allowed to see linked 'points' row"
on "public"."partial_resolutions"
to public
using (
  ( EXISTS
    ( SELECT 1
      FROM points
      WHERE (points.id = partial_resolutions.points_id)
    )
  )
);