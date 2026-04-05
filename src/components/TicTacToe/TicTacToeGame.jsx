import React, { useState, useEffect, useMemo } from "react";
import "./index.css";

const N = 3;

function TicTacToeGame() {
  const [board, setBoard] = useState(Array(N * N).fill(""));
  const [winner, setWinner] = useState(null);
  const [isX, setIsX] = useState(true);

  const getWinnerCombos = (N) => {
    const winners = [];

    for (let i = 0; i < N; i++) {
      const row = [];
      for (let j = 0; j < N; j++) {
        row.push(i * N + j);
      }
      winners.push(row);
    }

    for (let i = 0; i < N; i++) {
      const col = [];
      for (let j = 0; j < N; j++) {
        col.push(j * N + i);
      }
      winners.push(col);
    }

    let diag = [];

    // main diag
    for (let i = 0; i < N; i++) {
      diag.push(i * N + i);
    }
    winners.push(diag);

    diag = [];

    // Reverse diag
    for (let i = 0; i < N; i++) {
      diag.push(i * N + (N - i - 1));
    }
    winners.push(diag);

    //  i*size gives starting point of each row. size-i-1 gives column offset

    return winners;
  };

  const winnerCombos = useMemo(() => getWinnerCombos(N), [N]);

  const checkWinner = (board) => {
    for (const combo of winnerCombos) {
      let player = board[combo[0]];

      if (!player || player === "") continue; // to prevent declaring empty rows as winners as we are checjking all combos on every turn

      if (combo.every((position) => board[position] === player)) return player;

    }
    return null;
  };

  const handleClick = (idx) => {
    if (board[idx] != "" || winner) return;
    const temp = [...board];
    temp[idx] = isX ? "X" : "O";

    const isWinner = checkWinner(temp);

    if (isWinner) {
      setWinner(isWinner);
    } else {
      setIsX(!isX);
    }
    setBoard(temp);
  };

  return (
    <>
      <div className="tic-tic-toe-wrapper">
        <div className="tic-tac-toe-board">
          {board.slice(0, N).map((_, rIdx) => {
            return (
              <div
                className="tic-tac-toe-row"
                style={{ height: `${100 / N}%` }}
                key={rIdx}
              >
                {board.slice(0, N).map((col, cIdx) => {
                  const idx = rIdx * N + cIdx;
                  return (
                    <div
                      className="tic-tac-toe-col"
                      style={{ width: `${100 / N}%` }}
                      onClick={() => handleClick(idx)}
                      key={cIdx}
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
      </div>

      <br />


    </>
  );
}

export default TicTacToeGame;
