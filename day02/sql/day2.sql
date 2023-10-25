CREATE TABLE strategy_guide(opp_choice TEXT, my_choice TEXT);

-- That long INSERT-statement here...

WITH points_per_round AS (
  SELECT
  CASE
    WHEN my_choice = 'X' THEN 1 -- Rock
    WHEN my_choice = 'Y' THEN 2 -- Paper
    WHEN my_choice = 'Z' THEN 3 -- Scissors
    ELSE -1000000
  END AS part1_selected_shape_points,
  CASE
    WHEN opp_choice = 'A' AND my_choice = 'X' THEN 3 -- Opp. Rock vs. me Rock: Draw
    WHEN opp_choice = 'A' AND my_choice = 'Y' THEN 6 -- Opp. Rock vs. me Paper: Win
    WHEN opp_choice = 'A' AND my_choice = 'Z' THEN 0 -- Opp. Rock vs. me Scissors: Lose
    WHEN opp_choice = 'B' AND my_choice = 'X' THEN 0 -- Opp. Paper vs. me Rock: Lose
    WHEN opp_choice = 'B' AND my_choice = 'Y' THEN 3 -- Opp. Paper vs. me Paper: Draw
    WHEN opp_choice = 'B' AND my_choice = 'Z' THEN 6 -- Opp. Paper vs. me Scissors: Win
    WHEN opp_choice = 'C' AND my_choice = 'X' THEN 6 -- Opp. Scissors vs. me Rock: Win
    WHEN opp_choice = 'C' AND my_choice = 'Y' THEN 0 -- Opp. Scissors vs. me Paper: Lose
    WHEN opp_choice = 'C' AND my_choice = 'Z' THEN 3 -- Opp. Scissors vs. me Scissors: Draw
    ELSE -1000000
  END AS part1_outcome_points,
  CASE
    WHEN opp_choice = 'A' AND my_choice = 'X' THEN 3 -- Lose against Rock: Scissors
    WHEN opp_choice = 'A' AND my_choice = 'Y' THEN 1 -- Draw against Rock: Rock
    WHEN opp_choice = 'A' AND my_choice = 'Z' THEN 2 -- Win against Rock: Paper
    WHEN opp_choice = 'B' AND my_choice = 'X' THEN 1 -- Lose against Paper: Rock
    WHEN opp_choice = 'B' AND my_choice = 'Y' THEN 2 -- Draw against Paper: Paper
    WHEN opp_choice = 'B' AND my_choice = 'Z' THEN 3 -- Win against Paper: Scissors
    WHEN opp_choice = 'C' AND my_choice = 'X' THEN 2 -- Lose against Scissors: Paper
    WHEN opp_choice = 'C' AND my_choice = 'Y' THEN 3 -- Draw against Scissors: Scissors
    WHEN opp_choice = 'C' AND my_choice = 'Z' THEN 1 -- Win against Scissors: Rock
    ELSE -1000000
  END AS part2_selected_shape_points,
  CASE
    WHEN my_choice = 'X' THEN 0 -- Lose
    WHEN my_choice = 'Y' THEN 3 -- Draw
    WHEN my_choice = 'Z' THEN 6 -- Win
    ELSE -1000000
  END AS part2_outcome_points FROM strategy_guide
)
SELECT SUM(part1_selected_shape_points + part1_outcome_points) AS part1, SUM(part2_selected_shape_points + part2_outcome_points) AS part2 FROM points_per_round;
