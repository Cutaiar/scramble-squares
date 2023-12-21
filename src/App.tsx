import styled from "styled-components"

interface ISquare {
  id: string
  rotation?: 90 | 180 | 270; // omitted = 0
}

const squares: ISquare[][] = [[{id: "A1", rotation: 90}, {id: "B1"}, {id: "C1"}], [{id: "A2"}, {id: "B2"}, {id: "C2"}], [{id: "A3"}, {id: "B3"}, {id: "C3"}]]
export const App = () => {
  return (<Root><Cols>{squares.map(row => <Row>{row.map(square => <Square {...square}>{square.id}</Square>)}</Row>)}</Cols></Root>);
}

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
  gap: 12px;
  width: 100%;
`;

const Row = styled.div`
  display: flex;
  gap: 12px;
`;

const Square = styled.div<{rotation?: number}>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100px;
  height: 100px;
  background-color: #e2be6b;
  text-align: center;
  color: black;
  font-weight: 800;
  transform: rotate(${p => (p.rotation ?? 0) + "deg"});
`;