"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const GRID_SIZE = 15;
const CELL_SIZE = 20;
const INITIAL_SNAKE = [
    { x: 5, y: 5 },
    { x: 4, y: 5 },
    { x: 3, y: 5 },
];
const INITIAL_DIRECTION = { x: 1, y: 0 };

const SnakeGame = () => {
    const router = useRouter();

    const [snake, setSnake] = useState(INITIAL_SNAKE);
    const [food, setFood] = useState({ x: 10, y: 10 });
    const [direction, setDirection] = useState(INITIAL_DIRECTION);
    const [gameOver, setGameOver] = useState(false);
    const [score, setScore] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setSnake((prev) => {
                const newHead = {
                    x: prev[0].x + direction.x,
                    y: prev[0].y + direction.y,
                };

                if (
                    newHead.x < 0 ||
                    newHead.x >= GRID_SIZE ||
                    newHead.y < 0 ||
                    newHead.y >= GRID_SIZE ||
                    prev.some((segment) => segment.x === newHead.x && segment.y === newHead.y)
                ) {
                    setGameOver(true);
                    return prev;
                }

                const newSnake = [newHead, ...prev];

                if (newHead.x === food.x && newHead.y === food.y) {
                    setScore((s) => s + 1);
                    let newFood;
                    do {
                        newFood = {
                            x: Math.floor(Math.random() * GRID_SIZE),
                            y: Math.floor(Math.random() * GRID_SIZE),
                        };
                    } while (newSnake.some((segment) => segment.x === newFood.x && segment.y === newFood.y));
                    setFood(newFood);
                } else {
                    newSnake.pop();
                }

                return newSnake;
            });
        }, 150);

        if (gameOver) clearInterval(interval);
        return () => clearInterval(interval);
    }, [direction, gameOver]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            switch (e.key) {
                case "ArrowUp":
                    handleMove({ x: 0, y: -1 });
                    break;
                case "ArrowDown":
                    handleMove({ x: 0, y: 1 });
                    break;
                case "ArrowLeft":
                    handleMove({ x: -1, y: 0 });
                    break;
                case "ArrowRight":
                    handleMove({ x: 1, y: 0 });
                    break;
                default:
                    break;
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [direction]);

    const handleMove = (newDir) => {
        if (
            (direction.x !== 0 && newDir.x === 0) ||
            (direction.y !== 0 && newDir.y === 0)
        ) {
            setDirection(newDir);
        }
    };

    const resetGame = () => {
        setSnake(INITIAL_SNAKE);
        setFood({
            x: Math.floor(Math.random() * GRID_SIZE),
            y: Math.floor(Math.random() * GRID_SIZE),
        });
        setDirection(INITIAL_DIRECTION);
        setScore(0);
        setGameOver(false);
    };

    const exitGame = () => {
        router.push("/");
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-4">
            <div className="flex justify-between w-full mb-4">
                <div className="text-white text-xl font-bold">Score: {score}</div>
                <div className="flex space-x-4">
                    {!gameOver && (
                        <button
                            className="bg-gray-600 text-white px-4 py-2 rounded"
                            onClick={exitGame}
                        >
                            Exit
                        </button>
                    )}
                </div>
            </div>

            <div
                className="grid"
                style={{
                    gridTemplateColumns: `repeat(${GRID_SIZE}, ${CELL_SIZE}px)`,
                    gridTemplateRows: `repeat(${GRID_SIZE}, ${CELL_SIZE}px)`,
                }}
            >
                {[...Array(GRID_SIZE * GRID_SIZE)].map((_, index) => {
                    const row = Math.floor(index / GRID_SIZE);
                    const col = index % GRID_SIZE;
                    const isSnake = snake.some((s) => s.x === col && s.y === row);
                    const isHead = snake[0].x === col && snake[0].y === row;
                    const isFood = food.x === col && food.y === row;
                    return (
                        <div
                            key={index}
                            className={`w-full h-full ${isFood
                                ? "bg-yellow-500"
                                : isSnake
                                    ? isHead
                                        ? "bg-green-500"
                                        : "bg-green-700"
                                    : "bg-gray-800"
                                }`}
                        />
                    );
                })}
            </div>

            <div className="flex flex-col mt-6">
                <div className="flex">
                    <button
                        className="bg-gray-700 text-white px-6 py-4 rounded mx-20"
                        onClick={() => handleMove({ x: 0, y: -1 })}
                    >
                        ↑
                    </button>
                </div>
                <div className="flex mt-2">
                    <button
                        className="bg-gray-700 text-white px-5 py-2 rounded mx-6"
                        onClick={() => handleMove({ x: -1, y: 0 })}
                    >
                        ←
                    </button>
                    <button
                        className="bg-gray-700 text-white px-5 py-4 rounded mx-6"
                        onClick={() => handleMove({ x: 1, y: 0 })}
                    >
                        →
                    </button>
                </div>
                <div className="flex mt-2">
                    <button
                        className="bg-gray-700 text-white px-6 py-4 rounded mx-20"
                        onClick={() => handleMove({ x: 0, y: 1 })}
                    >
                        ↓
                    </button>
                </div>
            </div>

            {gameOver && (
                <>
                    <div className="mt-6 text-center text-red-600 font-bold text-xl">
                        Game Over! Final Score: {score}
                    </div>
                    <div className="flex mt-4 space-x-4">
                        <button
                            className="bg-green-500 text-white px-6 py-3 rounded border-2 border-green-300"
                            onClick={resetGame}
                        >
                            Retry
                        </button>
                        <button
                            className="bg-gray-600 text-white px-6 py-3 rounded border-2 border-gray-300"
                            onClick={exitGame}
                        >
                            Exit
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default SnakeGame;