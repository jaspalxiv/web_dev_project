"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

const TicTacToe = () => {
  const router = useRouter();
  const [board, setBoard] = useState(Array(9).fill(""));
  const [currentPlayer, setCurrentPlayer] = useState("X");
  const [scores, setScores] = useState({ X: 0, O: 0 });
  const [gameOver, setGameOver] = useState(false);  // To track game over state
  const [tie, setTie] = useState(false);  // To track tie game state

  const handlePress = (index) => {
    if (board[index] !== "" || gameOver) return;

    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);

    if (checkWinner(newBoard)) {
      setScores({ ...scores, [currentPlayer]: scores[currentPlayer] + 1 });
      setGameOver(true);
    } else if (checkTie(newBoard)) {
      setTie(true);
      setGameOver(true);
    } else {
      setCurrentPlayer(currentPlayer === "X" ? "O" : "X");
    }
  };

  const checkWinner = (board) => {
    const winPatterns = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    return winPatterns.some((pattern) =>
      pattern.every((index) => board[index] === currentPlayer)
    );
  };

  const checkTie = (board) => {
    // Tie is when the board is full and there is no winner
    return board.every((cell) => cell !== "") && !checkWinner(board);
  };

  const resetGame = () => {
    setBoard(Array(9).fill(""));
    setCurrentPlayer("X");
    setGameOver(false);
    setTie(false); // Reset tie state
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-6">
      <button
        className="absolute top-10 left-6 bg-red-600 text-white px-4 py-2 rounded"
        onClick={() => router.push("/")}
      >
        Exit
      </button>

      <div className="flex space-x-8 mb-6">
        <div className="text-center text-red-600">
          <p className="text-xl">Player 1</p>
          <p className="text-3xl font-bold">{scores.X}</p>
        </div>
        <div className="text-white text-2xl font-bold">VS</div>
        <div className="text-center text-red-600">
          <p className="text-xl">Player 2</p>
          <p className="text-3xl font-bold">{scores.O}</p>
        </div>
      </div>

      <div
        className="grid grid-cols-3 gap-4"
        style={{ width: "calc(100% - 2rem)", maxWidth: "360px" }}
      >
        {board.map((value, index) => (
          <button
            key={index}
            className="flex justify-center items-center bg-black text-red-600 text-4xl font-bold p-8 rounded-lg aspect-square"
            onClick={() => handlePress(index)}
            disabled={value !== "" || gameOver}  // Disable cell after game over
          >
            {value}
          </button>
        ))}
      </div>

      {gameOver && !tie && (
        <div className="mt-6 text-center text-white text-xl font-bold">
          Game Over! {currentPlayer} wins! Click Restart to play again.
        </div>
      )}

      {gameOver && tie && (
        <div className="mt-6 text-center text-white text-xl font-bold">
          It&apos;s a Tie! Click Restart to play again.
        </div>
      )}

      <button
        className="mt-6 bg-red-600 text-white px-6 py-3 rounded"
        onClick={resetGame}
        disabled={!gameOver}  // Only enable Restart button after game over
      >
        Restart
      </button>
    </div>
  );
};

export default TicTacToe;