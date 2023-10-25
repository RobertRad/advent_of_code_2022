import { A, flow, pipe, S } from "@mobily/ts-belt";

export type Selected = {
  x: number;
  y: number;
};
type Grid = readonly (readonly number[])[];
type Color = "none" | "highlighted" | "green" | "red";

export function parseInput(input: string): Grid {
  return pipe(
    input,
    S.split("\n"),
    A.map(
      flow(
        S.split(""),
        A.map((s) => parseInt(s))
      )
    )
  );
}

export function buildHiddenMap(grid: Grid) {
  return grid.map((row, y) => row.map((val, x) => isHidden(grid, x, y, val)));
}

function isHidden(grid: Grid, x: number, y: number, val: number) {
  const hasHigherTreeAbove = range(0, y).some(
    (otherY) => grid[otherY][x] >= val
  );
  const hasHigherTreeBelow = range(y + 1, grid.length).some(
    (otherY) => grid[otherY][x] >= val
  );
  const hasHigherTreeLeft = range(0, x).some(
    (otherX) => grid[y][otherX] >= val
  );
  const hasHigherTreeRight = range(x + 1, grid[0].length).some(
    (otherX) => grid[y][otherX] >= val
  );
  return (
    hasHigherTreeAbove &&
    hasHigherTreeBelow &&
    hasHigherTreeLeft &&
    hasHigherTreeRight
  );
}

export function buildColorMap(grid: Grid, selected: Selected) {
  return grid.map((row, y) => row.map((val, x) => calcColor(grid, selected, x, y, val)));
}

function calcColor(
  grid: Grid,
  selected: Selected,
  x: number,
  y: number,
  val: number
): Color {
  if (x === selected.x && y === selected.y) {
    return "highlighted";
  } else if (x !== selected.x && y !== selected.y) {
    return "none";
  } else {
    if (val >= grid[selected.y][selected.x]) {
      return "red";
    } else {
      return "green";
    }
  }
}

export function findHighestScenicScore(scenicScoreMap: number[][]) {
  let highest = 0;
  scenicScoreMap.forEach((row) => row.forEach((val) => {
    if (val > highest) {
      highest = val;
    }
  }));
  return highest;
}

export function buildScenicScoresMap(grid: Grid) {
  return grid.map((row, y) => row.map((val, x) => calcScenicScore(grid, x, y, val)));
}

function calcScenicScore(grid: Grid, x: number, y: number, val: number) {
  const reduceFunction = (acc: { count: number, finished: boolean }, curr: number) => {
    if (acc.finished) {
      return acc;
    }
    return {
      count: acc.count + 1,
      finished: curr >= val
    }
  };
  const scoreAbove = range(y, 0).map(index => grid[index][x]).reduce(reduceFunction, { count: 0, finished: false }).count;
  const scoreBelow = range(y + 1, grid.length).map(index => grid[index][x]).reduce(reduceFunction, { count: 0, finished: false }).count;
  const scoreLeft = range(x, 0).map(index => grid[y][index]).reduce(reduceFunction, { count: 0, finished: false }).count;
  const scoreRight = range(x + 1, grid[0].length).map(index => grid[y][index]).reduce(reduceFunction, { count: 0, finished: false }).count;
  return scoreAbove * scoreBelow * scoreLeft * scoreRight;
}

export function countVisible(hiddenMap: boolean[][]) {
  let count = 0;
  hiddenMap.forEach((row) =>
    row.forEach((hidden) => (count += hidden ? 0 : 1))
  );
  return count;
}

function range(from: number, toExclusive: number) {
  let bigger: number;
  let smaller: number;
  if (from < toExclusive) {
    bigger = toExclusive;
    smaller = from;
  } else {
    bigger = from;
    smaller = toExclusive;
  }
  const result = [...Array(bigger - smaller).keys()].map((i) => i + smaller);
  return from < toExclusive ? result : result.reverse();
}
