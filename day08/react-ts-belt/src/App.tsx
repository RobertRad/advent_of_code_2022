import { useCallback, useMemo, useState } from "react";
import styled from "styled-components";
import input from "./inputs/input";
import {
  buildColorMap,
  buildHiddenMap,
  buildScenicScoresMap,
  countVisible,
  findHighestScenicScore,
  parseInput,
  Selected
} from "./utils";

function App() {
  const [selected, setSelected] = useState<Selected>({ x: -1, y: -1 });
  const [showScenicMap, setShowScenicMap] = useState(false);
  const treeHeights = parseInput(input);
  const hiddenMap = useMemo(() => buildHiddenMap(treeHeights), [treeHeights]);
  const numberOfVisibleTrees = useMemo(
    () => countVisible(hiddenMap),
    [hiddenMap]
  );
  const colorMap = useMemo(
    () => buildColorMap(treeHeights, selected),
    [treeHeights, selected]
  );
  const scenicScoresMap = useMemo(
    () => buildScenicScoresMap(treeHeights),
    [treeHeights]
  );
  const highestScenicScore = useMemo(
    () => findHighestScenicScore(scenicScoresMap),
    [scenicScoresMap]
  );
  const chooseSelected = (x: number, y: number) => {
    return () => setSelected({ x: x, y: y });
  };
  const getColor = useCallback(
    (x: number, y: number) => {
      switch (colorMap[y][x]) {
        case "none":
          return "#000000";
        case "highlighted":
          return "#d9d914";
        case "green":
          return "#49fc08";
        case "red":
          return "#db4655";
      }
    },
    [colorMap]
  );
  return (
    <Root>
      <h1>Day 8</h1>
      <Result>{`Result Part1: ${numberOfVisibleTrees}`}</Result>
      <Result>{`Result Part2: ${highestScenicScore}`}</Result>
      <div>
        selected: {"{"}x: {selected.x}, y: {selected.y}
        {"}"}
      </div>
      <Headline>Trees:</Headline>
      <Grid>
        {treeHeights.map((row, y) => (
          <Row key={`row-${y}`}>
            {row.map((val, x) => (
              <Item
                key={`item-${x}`}
                onClick={chooseSelected(x, y)}
                style={{ backgroundColor: getColor(x, y) }}
              >
                {val}
              </Item>
            ))}
          </Row>
        ))}
      </Grid>
      <Headline>Visible Trees:</Headline>
      <Grid>
        {hiddenMap.map((row, y) => (
          <Row key={`row-${y}`}>
            {row.map((val, x) => (
              <Item
                key={`item-${x}`}
                onClick={chooseSelected(x, y)}
                style={{ backgroundColor: getColor(x, y) }}
              >
                {val ? "H" : "V"}
              </Item>
            ))}
          </Row>
        ))}
      </Grid>
      <Headline>Scenic Scores:</Headline>
      <button onClick={() => setShowScenicMap(!showScenicMap)}>{showScenicMap ? 'Hide' : 'Show'} Scenic Map</button>
      {showScenicMap && (
        <Grid>
          {scenicScoresMap.map((row, y) => (
            <Row key={`row-${y}`}>
              {row.map((val, x) => (
                <Item
                  style={{ width: "50px", backgroundColor: getColor(x, y) }}
                  key={`item-${x}`}
                  onClick={chooseSelected(x, y)}
                >
                  {val}
                </Item>
              ))}
            </Row>
          ))}
        </Grid>
      )}
    </Root>
  );
}

export default App;

const Root = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Result = styled.div`
  font-weight: bold;
`;

const Headline = styled.div`
  font-weight: bold;
  font-size: 20px;
  margin-top: 10px;
`;

const Grid = styled.div`
  display: flex;
  flex-direction: column;
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
`;

const Item = styled.span`
  font-size: 14px;
  font-family: monospace;
  padding: 2px;
  margin: 2px;
  border: 1px outset gray;
  cursor: pointer;
`;
