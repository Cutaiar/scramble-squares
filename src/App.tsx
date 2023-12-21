import { useState } from "react";
import styled from "styled-components";

type Rotation = 90 | 180 | 270;
interface ISquare {
  id: string;
  rotation?: Rotation; // omitted = 0
}

const initialSquares: ISquare[][] = [
  [{ id: "A1" }, { id: "B1" }, { id: "C1" }],
  [{ id: "A2" }, { id: "B2" }, { id: "C2" }],
  [{ id: "A3" }, { id: "B3" }, { id: "C3" }],
];

export const App = () => {
  const [squares, setSquares] = useState<ISquare[][]>(initialSquares);

  const onClick = (id: string) => {
    console.log(id);
    // TODO
    // const newSquares = [...squares, [squares[0], { id: "C1", rotation: 90 }]];
    // setSquares(newSquares);
  };

  return (
    <Root>
      <Cols>
        {squares.map((row, i) => (
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
