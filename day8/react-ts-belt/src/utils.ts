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

export function countVisible(hiddenMap: boolean[][]) {
  let count = 0;
  hiddenMap.forEach((row) =>
    row.forEach((hidden) => (count += hidden ? 0 : 1))
  );
  return count;
}

function range(from: number, toExclusive: number) {
  return [...Array(toExclusive - from).keys()].map((i) => i + from);
}
