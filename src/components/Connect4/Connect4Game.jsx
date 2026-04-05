import React, { useState, useEffect } from "react";
import "./index.css";

const COLS = 7;
const ROWS = 6;

// Keeping outside since independent of state and will prevent re initializqation on renders
const checkWinner = (board, player, r, c) => {
  const checkCount = (dr, dc) => {
    let row = r + dr;
    let col = c + dc;

    let count = 0;

    while (
      row < ROWS &&
      row >= 0 &&
      col < COLS &&
      col >= 0 &&
      board[col][row] === player
    ) {
      count++;
      row += dr;
      col += dc;
    }
    return count;
  };

  // For col
  if (checkCount(1, 0) + checkCount(-1, 0) + 1 >= 4) return player;

  // For row
  if (checkCount(0, 1) + checkCount(0, -1) + 1 >= 4) return player;

  // For diagnol
  if (checkCount(1, 1) + checkCount(-1, -1) + 1 >= 4) return player;

  // For anti diagnol
  if (checkCount(1, -1) + checkCount(-1, 1) + 1 >= 4) return player;

  return null;
};

function Connect4Game() {
  const [board, setBoard] = useState(
    Array.from({ length: COLS }, () => Array(ROWS).fill("")),
  );
  const [isX, setIsX] = useState(true);
  const [winner, setWinner] = useState("");

  const handleClick = (cIdx) => {
    if (winner !== "" || board[cIdx][0] !== "") return;

    const newBoard = board.map((item) => [...item]);
    const player = isX ? "X" : "O";

    let rIdx = ROWS - 1;
    let placedIdx = -1;

    while (rIdx >= 0) {
      if (newBoard[cIdx][rIdx] === "") {
        newBoard[cIdx][rIdx] = player;
        placedIdx = rIdx;
        break;
      }
      rIdx--;
    }
    if (placedIdx === -1) return;
    setBoard(newBoard);

    const isWinner = checkWinner(newBoard, player, placedIdx, cIdx);
    if (isWinner) {
      //  do something
      setWinner(player);
    } else {
      setIsX(!isX);
    }
  };

  return (
    <>
      <div className="connect-wrapper">
        <div className="connect-board">
          {board.map((col, cIdx) => {
            return (
              <div
                className="connect-col"
                key={cIdx}
                onClick={() => handleClick(cIdx)}
              >
                {col.map((cell, rIdx) => {
                  return (
                    <div className="connect-cell" key={`${cIdx}-${rIdx}`}>
                      <div
                        className={`connect-token ${cell === "X" ? "player-x" : cell === "O" ? "player-o" : ""}`}
                      >
                        {/* Keep the cell variable here if you want text, or leave empty for pure colors */}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
        {winner && <div>Winner is {winner} </div>}
      </div>
    </>
  );
}

export default Connect4Game;
