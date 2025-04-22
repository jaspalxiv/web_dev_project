"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import words from "./words.json";

const hangmanImages = [
  "/1.png",
  "/2.png",
  "/3.png",
  "/4.png",
  "/5.png",
  "/6.png",
  "/7.png",
];

const getRandomWord = () =>
  words[Math.floor(Math.random() * words.length)].toUpperCase();

export default function Page() {
  const router = useRouter();
  const [word, setWord] = useState(null); // Initially set to null
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [incorrectGuesses, setIncorrectGuesses] = useState(0);

  // Only execute this effect client-side
  useEffect(() => {
    setWord(getRandomWord()); // Set word when component is mounted on client
  }, []);

  const handleGuess = (letter) => {
    if (guessedLetters.includes(letter) || incorrectGuesses >= 7) return;

    setGuessedLetters([...guessedLetters, letter]);

    if (!word.includes(letter)) {
      setIncorrectGuesses(incorrectGuesses + 1);
    }
  };

  const resetGame = () => {
    setWord(getRandomWord());
    setGuessedLetters([]);
    setIncorrectGuesses(0);
  };

  const renderWord = () => (
    <div className="flex justify-center gap-2 mb-4 text-4xl text-white">
      {word.split("").map((letter, index) => (
        <span key={index}>
          {guessedLetters.includes(letter) ? letter : "_"}
        </span>
      ))}
    </div>
  );

  const renderAlphabet = () => {
    if (incorrectGuesses >= 6) return null;

    return (
      <div className="flex flex-wrap justify-center max-w-md gap-2 mt-4">
        {"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((letter) => {
          const isGuessed = guessedLetters.includes(letter);
          const isCorrect = word.includes(letter);
          return (
            <button
              key={letter}
              onClick={() => handleGuess(letter)}
              disabled={isGuessed}
              className={`w-8 h-10 rounded bg-gray-600 text-white font-semibold ${
                isGuessed
                  ? isCorrect
                    ? "bg-green-600"
                    : "bg-red-600"
                  : "hover:bg-orange-500"
              }`}
            >
              {letter}
            </button>
          );
        })}
      </div>
    );
  };

  const renderHangman = () => (
    <img
      src={hangmanImages[Math.min(incorrectGuesses, 6)]}
      alt="Hangman"
      className="w-64 h-64 object-contain mb-4"
    />
  );

  const renderGameOver = () => {
    if (incorrectGuesses < 6) return null;

    return (
      <div className="text-center mt-6">
        <h2 className="text-red-500 text-3xl font-bold mb-4">Game Over!</h2>
        <p className="text-white text-xl mb-4">
          The correct word was: <span className="text-yellow-500">{word}</span>
        </p>
        <button
          className="bg-green-600 text-white font-bold py-2 px-4 rounded mr-4"
          onClick={resetGame}
        >
          Retry
        </button>
        <button
          className="bg-gray-500 text-white font-bold py-2 px-4 rounded"
          onClick={() => router.push("/")}
        >
          Exit
        </button>
      </div>
    );
  };

  if (!word) {
    return <div>Loading...</div>; // Render this while the word is being set
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 px-4">
      <button
        onClick={() => router.push("/")}
        className="absolute bottom-10 bg-red-600 text-white py-2 px-4 rounded"
      >
        Return
      </button>

      {renderHangman()}
      <p className="text-white text-xl font-bold mb-2">
        Attempts Left: {Math.max(6 - incorrectGuesses, 0)}
      </p>
      {renderWord()}
      {renderAlphabet()}
      {renderGameOver()}
    </div>
  );
}
