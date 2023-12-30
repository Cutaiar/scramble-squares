import { useState } from "react";
import styled from "styled-components";
import * as _ from "lodash";

import {
  DragDropContext,
  Draggable,
  OnDragEndResponder,
} from "react-beautiful-dnd";
import { StrictModeDroppable as Droppable } from "./StrictModeDroppable";

type Rotation = 0 | 90 | 180 | 270;
interface ISquare {
  id: string;
  rotation: Rotation;
}

const rotate = (r: Rotation): Rotation => {
  return ((r + 90) % 360) as Rotation;
};

const reorder = (list: ISquare[], startIndex: number, endIndex: number) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

const move = (
  sourceList: ISquare[],
  destList: ISquare[],
  startIndex: number,
  endIndex: number
) => {
  const sourceResult = Array.from(sourceList);
  const destResult = Array.from(destList);
  const [removed] = sourceResult.splice(startIndex, 1);
  destResult.splice(endIndex, 0, removed);
  return [sourceResult, destResult];
};

const initialSquares: ISquare[] = [
  { id: "A1", rotation: 0 },
  { id: "B1", rotation: 0 },
  { id: "C1", rotation: 0 },
  { id: "A2", rotation: 0 },
  { id: "B2", rotation: 0 },
  { id: "C2", rotation: 0 },
  { id: "A3", rotation: 0 },
  { id: "B3", rotation: 0 },
  { id: "C3", rotation: 0 },
];

export const App = () => {
  const [squares, setSquares] = useState<ISquare[]>(initialSquares);

  const onClick = (id: string) => {
    // Rotate the square that was clicked on
    const newSquares = squares.map((s) =>
      s.id === id ? { ...s, rotation: rotate(s.rotation) } : s
    );
    setSquares(newSquares);
  };

  const rows = _.chunk(squares, 3);

  // Based on https://codesandbox.io/p/sandbox/multiple-lists-with-drag-and-drop-zvdfe?file=/index.js:22,1-23,1
  const onDragEnd: OnDragEndResponder = (result, provided) => {
    const { source, destination } = result;

    // dropped outside the list
    if (!destination) {
      return;
    }

    // TODO: Limit lists to three items

    console.log(
      "move " +
        result.draggableId +
        " from " +
        source.index +
        " to " +
        destination?.index
    );

    const rowIndex = source.droppableId as unknown as number;
    if (source.droppableId === destination.droppableId) {
      const newRow = reorder(rows[rowIndex], source.index, destination.index);

      const result = Array.from(rows);
      result.splice(rowIndex, 1, newRow);
      setSquares(result.flat());
    } else {
      // TODO: moving between lists works, but we need to implement swapping for it to work correctly with the flat list state.
      // Without swapping, when the list is rerendered, items move around
      const destRowIndex = destination.droppableId as unknown as number;

      const [newSource, newDest] = move(
        rows[rowIndex],
        rows[destRowIndex],
        source.index,
        destination.index
      );
      const result = Array.from(rows);
      result.splice(rowIndex, 1, newSource);
      result.splice(destRowIndex, 1, newDest);
      setSquares(result.flat());
    }
  };

  // TODO: Add list to hold pieces "off the board"
  return (
    <Root>
      <Title>Scramble Squares</Title>
      <DragDropContext onDragEnd={onDragEnd}>
        <Cols>
          {rows.map((row, ri) => (
            <Droppable droppableId={String(ri)} key={ri} direction="horizontal">
              {(provided) => (
                <Row
                  key={ri}
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {row.map((square, ci) => (
                    <Draggable
                      key={square.id}
                      draggableId={square.id}
                      index={ci}
                    >
                      {(provided) => (
                        <Square
                          rotation={square.rotation}
                          onClick={() => onClick(square.id)}
                          key={square.id}
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          {/* {square.id} */}
                          <RedShell />
                          <BlueShell />
                          <GreenShell />
                          <BlackShell />
                        </Square>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </Row>
              )}
            </Droppable>
          ))}
        </Cols>
      </DragDropContext>
      <Reset onClick={() => setSquares(initialSquares)}>Reset</Reset>
    </Root>
  );
};

const Title = styled.span`
  margin-bottom: 16px;
  font-weight: 800;
`;

const Reset = styled.a`
  margin-top: 16px;
  font-weight: 800;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;

const Root = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
`;

const Cols = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  width: 100%;
`;

const Row = styled.ul`
  display: flex;
  justify-content: center;
  gap: 12px;
  width: 400px;

  margin: 0;
  padding: 0;
`;

const Square = styled.li<{ rotation?: Rotation }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100px;
  height: 100px;
  background-color: hsl(42, 67%, 65%);
  text-align: center;
  color: black;
  font-weight: 800;
  cursor: pointer;

  --rotation: ${(p) => (p.rotation ?? 0) + "deg"};
  /* transition: all ease-in-out 300ms; */ /* TODO: transition interferes with DND casing causing snapping */
  transform: rotate(var(--rotation));

  &:hover {
    transform: scale(1.05) rotate(var(--rotation));
    background-color: hsl(42, 67%, 70%);
  }
`;

const Shell = styled.div`
  position: absolute;
  width: 20px;
  height: 20px;
`;

const RedShell = styled(Shell)`
  background-color: red;

  top: calc(50% - 10px);
  right: 0;
  border-radius: 50% 0 0 50%;
`;

const BlueShell = styled(Shell)`
  background-color: blue;

  top: calc(50% - 10px);
  left: 0;
  border-radius: 0 50% 50% 0;
`;

const GreenShell = styled(Shell)`
  background-color: green;

  left: calc(50% - 10px);
  top: 0;
  border-radius: 0 0 50% 50%;
`;

const BlackShell = styled(Shell)`
  background-color: black;

  left: calc(50% - 10px);
  bottom: 0;
  border-radius: 50% 50% 0 0;
`;
