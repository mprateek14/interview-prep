import React, { useState } from "react";
import "./index.css";

const N = 9;

export default function OptimisedTicTacToe() {
  // 1. Visual State (for rendering the UI)
  const [board, setBoard] = useState(Array(N * N).fill(""));
  const [winner, setWinner] = useState(null);
  const [isX, setIsX] = useState(true);

  // 2. Mathematical State (for O(1) win detection)
  const [rowSums, setRowSums] = useState(Array(N).fill(0));
  const [colSums, setColSums] = useState(Array(N).fill(0));
  const [diagSum, setDiagSum] = useState(0);
  const [antiDiagSum, setAntiDiagSum] = useState(0);

  const handleClick = (idx) => {
    if (board[idx] !== "" || winner) return;

    // Update visual board
    const player = isX ? "X" : "O";
    const newBoard = [...board];
    newBoard[idx] = player;
    setBoard(newBoard);

    // --- THE O(1) LOGIC ---

    // Step 1: Translate 1D index to 2D coordinates
    const row = Math.floor(idx / N);
    const col = idx % N;

    // Step 2: Determine math value (+1 for X, -1 for O)
    const moveValue = isX ? 1 : -1;

    // Step 3: Create localized updates
    const newRowSums = [...rowSums];
    newRowSums[row] += moveValue;

    const newColSums = [...colSums];
    newColSums[col] += moveValue;

    let newDiagSum = diagSum;
    if (row === col) {
      newDiagSum += moveValue;
    }

    let newAntiDiagSum = antiDiagSum;
    if (row + col === N - 1) {
      newAntiDiagSum += moveValue;
    }

    // Step 4: Check if any of the sums hit N or -N
    if (
      Math.abs(newRowSums[row]) === N ||
      Math.abs(newColSums[col]) === N ||
      Math.abs(newDiagSum) === N ||
      Math.abs(newAntiDiagSum) === N
    ) {
      setWinner(player);
    } else {
      setIsX(!isX);
    }

    // Step 5: Commit the math to React state for the next turn
    setRowSums(newRowSums);
    setColSums(newColSums);
    setDiagSum(newDiagSum);
    setAntiDiagSum(newAntiDiagSum);
  };

  return (
    <div className="tic-tic-toe-wrapper">
      <div
        className="tic-tac-toe-board-v2"
        style={{
          gridTemplateColumns: `repeat(${N}, 1fr)`,
          gridTemplateRows: `repeat(${N}, 1fr)`,
        }}
      >
        {board.map((cellValue, idx) => (
          <div
            key={idx}
            className="tic-tac-toe-cell"
            onClick={() => handleClick(idx)}
          >
            {cellValue}
          </div>
        ))}
      </div>
      {winner && (
        <div style={{ marginTop: "20px", fontSize: "24px", color: "wheat" }}>
          Winner is {winner}!
        </div>
      )}
    </div>
  );
}






// rowSums is initialized as [0, 0, 0]. These three slots represent the total score for Row 0, Row 1, and Row 2.

// colSums is initialized as [0, 0, 0]. These three slots represent the total score for Col 0, Col 1, and Col 2.

// You do not need to check indices 0-2 to know if Row 0 has a winner. The score for the entire Row 0 is stored as a single integer inside rowSums[0].


// Player X is worth +1 point. Player O is worth -1 point.

// Move 1: Player X clicks the top-right square. In your 1D flat board, this is index 2.

// The Math: We translate index 2 into 2D coordinates:

// row = Math.floor(2 / 3) = 0

// col = 2 % 3 = 2

// The Update: We add Player X's point (+1) to those specific trackers:

// rowSums[0] becomes 1. (Row 0 now has a score of 1)

// colSums[2] becomes 1. (Col 2 now has a score of 1)

// The Check: We look at the trackers we just touched. Does Math.abs(rowSums[0]) === 3? No, it equals 1. The game continues.

// If Player X later places pieces at index 0 and index 1, the math will calculate row = 0 for both of them.
// rowSums[0] will be incremented two more times, reaching a total of 3.