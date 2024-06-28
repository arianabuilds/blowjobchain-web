update points
  set
    comment = '$$IS_CLAIM$$'
  where
    amount = -10 AND
    comment is null;

-- Before running, maybe want to:
-- - [ ] backup entries
-- - [ ] select * from points where amount < 0, to examine current data
