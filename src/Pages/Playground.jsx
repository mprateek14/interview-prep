import React, { useState, useMemo } from "react";

const N = 3;

const generateWinnerCombos = (N) => {
  const winners = [];

  //for rows
  for (let i = 0; i < N; i++) {
    let row = [];
    for (let j = 0; j < N; j++) {
      row.push(i * N + j);
    }
    winners.push(row);
  }

  //for cols
  for (let i = 0; i < N; i++) {
    let col = [];
    for (let j = 0; j < N; j++) {
      col.push(j * N + i);
    }
    winners.push(col);
  }

  //main diag
  const diag = [];
  for (let i = 0; i < N; i++) {
    diag.push(i * N + i);
  }
  winners.push(diag);

  const antiDiag = [];

  for (let i = 0; i < N; i++) {
    antiDiag.push(i * N + (N - i - 1));
  }
  winners.push(antiDiag);

  return winners;
};
//   const winnerCombos = useMemo(() => generateWinnerCombos(N), [N]);
//   const checkWinner = (board) => {
//     // check with combos
//     for (const combo of winnerCombos) {
//       let player = board[combo[0]];

//       if (!player || player === "") continue;

//       if (combo.every((idx) => board[idx] === player)) {
//         console.log("ere");
//         return player;
//       }
//     }
//     return null;
//   };

function Playground() {
  const [board, setBoard] = useState(Array(N * N).fill(""));
  const [isX, setIsX] = useState(true);
  const [winner, setWinner] = useState("");
  const [moveCount, setMoveCount] = useState(0)

  const [rows, setRows] = useState(Array(N).fill(0));
  const [cols, setCols] = useState(Array(N).fill(0));
  const [mainDiag, setMainDiag] = useState(0);
  const [antiDiag, setAntiDiag] = useState(0);

  const handleClick = (rowIdx, colIdx) => {
    let idx = rowIdx * N + colIdx;
    if (winner || board[idx] !== "") return;

    let temp = [...board];
    let player = isX ? "X" : "O";
    temp[idx] = player;

    let value = isX ? 1 : -1;

    const curRows = [...rows];
    curRows[rowIdx] += value;

    const curCols = [...cols];
    curCols[colIdx] += value;

    let curDiag = mainDiag;
    if (rowIdx === colIdx) {
      curDiag += value;
    }

    let otherDiag = antiDiag;
    if (rowIdx + colIdx === N - 1) {
      otherDiag += value;
    }

    if (
      Math.abs(curRows[rowIdx]) === N ||
      Math.abs(curCols[colIdx]) === N ||
      Math.abs(curDiag) === N ||
      Math.abs(otherDiag) === N
    ) {
      setWinner(player);
    }

    setAntiDiag(otherDiag)
    setCols(curCols)
    setRows(curRows)
    setMainDiag(curDiag)

    setBoard(temp);
    setIsX(!isX);
    setMoveCount((prev) => prev+1)
  };

  return (
    <>
      <div
        className="container"
        style={{
          border: "1px solid black",
          height: "500px",
          width: "500px",
        }}
      >
        {board.slice(0, N).map((_, rowIdx) => {
          return (
            <div
              className="row"
              style={{
                borderBottom: "1px solid black",
                width: "100%",
                height: `${100 / N}%`,
                display: "flex",
                justifyContent: "space-evenly",
                alignItems: "center",
              }}
              key={rowIdx}
            >
              {board.slice(0, N).map((col, colIdx) => {
                let idx = rowIdx * N + colIdx;
                return (
                  <div
                    key={rowIdx + "-" + colIdx}
                    className="col"
                    onClick={() => handleClick(rowIdx, colIdx)}
                    style={{
                      borderRight: "1px solid black",
                      width: `${100 / N}%`,
                      height: "100%",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      cursor: board[idx] !== "" ? "not-allowed" : "pointer",
                    }}
                  >
                    {board[idx]}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
      {winner && <div>Winner is {winner}</div>}
      {moveCount === N*N && !winner ? <div>"Draw"</div> : ""}
    </>
  );
}

export default Playground;
