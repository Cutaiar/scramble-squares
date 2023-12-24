import { useState } from "react";
import styled from "styled-components";
import * as _ from "lodash";

type Rotation = 0 | 90 | 180 | 270;
interface ISquare {
  id: string;
  rotation: Rotation;
}

const rotate = (r: Rotation): Rotation => {
  return ((r + 90) % 360) as Rotation;
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

  return (
    <Root>
      <Cols>
        {rows.map((row, i) => (
          <Row key={i}>
            {row.map((square) => (
              <Square
                rotation={square.rotation}
                onClick={() => onClick(square.id)}
                key={square.id}
              >
                {square.id}
              </Square>
            ))}
          </Row>
        ))}
      </Cols>
    </Root>
  );
};

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

const Row = styled.div`
  display: flex;
  gap: 12px;
`;

const Square = styled.div<{ rotation?: Rotation }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100px;
  height: 100px;
  background-color: #e2be6b;
  text-align: center;
  color: black;
  font-weight: 800;
  transform: rotate(${(p) => (p.rotation ?? 0) + "deg"});
`;
