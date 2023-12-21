import styled from "styled-components"

function App() {

  const squares = [["A1", "B1", "C1"], ["A2", "B2", "C2"], ["A3", "B3", "C3"]];

  return (<Root><Cols>{squares.map(row => <Row>{row.map(square => <Square>{square}</Square>)}</Row>)}</Cols></Root>);
}

export default App

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

const Square = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100px;
  height: 100px;
  background-color: #e2be6b;
  text-align: center;
  color: black;
  font-weight: 800;
`;