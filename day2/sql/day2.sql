CREATE TABLE strategy_guide(opp_choice TEXT, my_choice TEXT);

-- That long INSERT-statement here...

WITH points_per_round AS (
  SELECT
  CASE
    WHEN my_choice = 'X' THEN 1
    WHEN my_choice = 'Y' THEN 2
    WHEN my_choice = 'Z' THEN 3
    ELSE -1000000
  END AS selected_shape_points,
  CASE
    WHEN opp_choice = 'A' AND my_choice = 'X' THEN 3
    WHEN opp_choice = 'A' AND my_choice = 'Y' THEN 6
    WHEN opp_choice = 'A' AND my_choice = 'Z' THEN 0
    WHEN opp_choice = 'B' AND my_choice = 'X' THEN 0
    WHEN opp_choice = 'B' AND my_choice = 'Y' THEN 3
    WHEN opp_choice = 'B' AND my_choice = 'Z' THEN 6
    WHEN opp_choice = 'C' AND my_choice = 'X' THEN 6
    WHEN opp_choice = 'C' AND my_choice = 'Y' THEN 0
    WHEN opp_choice = 'C' AND my_choice = 'Z' THEN 3
    ELSE -1000000
  END AS outcome_points FROM strategy_guide
)
SELECT SUM(selected_shape_points + outcome_points) AS points FROM points_per_round;
