import { useRef, useState } from "react";
import styled from "styled-components";
import * as _ from "lodash";

type Rotation = 0 | 90 | 180 | 270;
interface ISquare {
  id: number;
  rotation: Rotation;
}

const rotate = (r: Rotation): Rotation => {
  return ((r + 90) % 360) as Rotation;
};

const initialSquares: ISquare[] = [
  { id: 0, rotation: 0 },
  { id: 1, rotation: 0 },
  { id: 2, rotation: 0 },
  { id: 3, rotation: 0 },
  { id: 4, rotation: 0 },
  { id: 5, rotation: 0 },
  { id: 6, rotation: 0 },
  { id: 7, rotation: 0 },
  { id: 8, rotation: 0 },
];

const swap = (array: any[], index1: number, index2: number) => {
  const myArray = [...array];
  [myArray[index1], myArray[index2]] = [myArray[index2], myArray[index1]];
  return myArray;
};

export const App = () => {
  const [squares, setSquares] = useState<ISquare[]>(initialSquares);
  const [selectedSquare, setSelectedSquare] = useState<number>();
  const rows = _.chunk(squares, 3); // Split squares into rows for easy display

  const rotateSquare = (id: number) => {
    // Rotate the square that was clicked on
    const newSquares = squares.map((s) =>
      s.id === id ? { ...s, rotation: rotate(s.rotation) } : s
    );
    setSquares(newSquares);
  };

  const selectedElement = useRef<EventTarget | null>(null);

  const onClick = async (e: MouseEvent, id: number) => {
    if (selectedSquare === undefined) {
      setSelectedSquare(id);
      selectedElement.current = e.target;
    } else {
      // If user clicks on the same square twice, rotate it
      if (id === selectedSquare) {
        rotateSquare(id);

        // Otherwise, swap it with another square
      } else {
        const destRect = e.target?.getBoundingClientRect();
        // animate squares such that they swap positions
        const sourceRect = selectedElement.current?.getBoundingClientRect();
        const diffY = sourceRect.top - destRect.top;
        const diffX = sourceRect.left - destRect.left;
        e.target.style.transform = `translate(${diffX}px, ${diffY}px)`;
        selectedElement.current.style.transform = `translate(${-diffX}px, ${-diffY}px)`;
        await new Promise((res, rej) => setTimeout(res, 300)); // Wait the amount of time it takes squares to animate their transform (currently 300ms)

        // Then reset transforms before swapping square data (TODO: this plays weird with rotations)
        e.target.style.transform = undefined;
        selectedElement.current.style.transform = undefined;

        // Finally after the animation is done, we can swap the data
        handleSwap(id);

        // And reset selections for the next go
        setSelectedSquare(undefined);
        selectedElement.current === null;
      }
    }
  };

  // Handles the swapping of squares data
  const handleSwap = (id: number) => {
    // Cant swap if there is no selected square
    if (selectedSquare === undefined) {
      return;
    }

    console.log(`swapping ${selectedSquare} and ${id}`);

    // Swap items
    const index1 = squares.findIndex((s) => s.id === selectedSquare);
    const index2 = squares.findIndex((s) => s.id === id);
    const squaresWithSwap = swap(squares, index1, index2);
    setSquares(squaresWithSwap);
  };

  return (
    <Root>
      <Title>Scramble Squares</Title>
      <Cols>
        {rows.map((row, i) => (
          <Row key={i}>
            {row.map((square) => (
              <Square
                $selected={selectedSquare === square.id}
                $rotation={square.rotation}
                onClick={(e) => onClick(e, square.id)}
                key={square.id}
              >
                {square.id}
                <RedShell />
                <BlueShell />
                <GreenShell />
                <BlackShell />
              </Square>
            ))}
          </Row>
        ))}
      </Cols>
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

const Row = styled.div`
  display: flex;
  gap: 12px;
`;

const Square = styled.div<{ $rotation?: Rotation; $selected?: boolean }>`
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

  --rotation: ${(p) => (p.$rotation ?? 0) + "deg"};
  transition: all ease-in-out 300ms;
  transform: rotate(var(--rotation));

  &:hover {
    transform: scale(1.05) rotate(var(--rotation));
    background-color: hsl(42, 67%, 70%);
  }

  outline: ${(p) => p.$selected && "5px solid hotpink"};
`;

const Shell = styled.div`
  position: absolute;
  width: 20px;
  height: 20px;
  pointer-events: none;
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
