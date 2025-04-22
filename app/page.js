"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { checkUser } from "/lib/auth";

const Calculator = () => {
    const router = useRouter();
    const [input, setInput] = useState("");

    const handleButtonClick = async (value) => {
        if (value === "AC") {
            setInput("");
        } else if (value === "C") {
            if (input == "Error") {
                setInput("");
            }
            else {
                setInput(input.slice(0, -1));
            }
        } else if (value === "=") {

            try {
                const result = eval(input).toString();
                setInput(result);

                var islogged = await checkUser();

                if (result === "1000") {
                    router.push("/project/userManagement");
                }
                else if (islogged) {
                    if (result === "1001") {
                        router.push("/project/userManagement?logout=true");
                    }
                    else if (result === "666") {
                        router.push("/project/tictactoe");
                    } else if (result === "108") {
                        router.push("/project/snake");
                    } else if (result === "1111") {
                        router.push("/project/hangman");
                    }
                }
            } catch {
                setInput("Error");
            }
        } else {
            setInput(input + value);
        }
    };

    const buttons = [
        ["C", "AC", "%", "÷"],
        ["1", "2", "3", "×"],
        ["4", "5", "6", "-"],
        ["7", "8", "9", "+"],
        ["0", ".", "="],
    ];

    return (
        <div className="flex flex-col items-center justify-center bg-black min-h-screen p-4">
            {/* Centered Result Display */}
            <div className="w-full max-w-md flex justify-center mb-8">
                <div className="w-[328px] h-24 flex justify-end items-center px-4">
                    <span className="text-white text-6xl font-light text-center">
                        {input || "0"}
                    </span>
                </div>
            </div>

            {/* Calculator Buttons */}
            <div className="grid grid-cols-4 gap-3 w-[328px]">
                {buttons.flat().map((btn) => (
                    <button
                        key={btn}
                        className={`
              h-16 rounded-full flex justify-center items-center text-3xl
              ${btn === "=" ? "col-span-2 w-full" : "w-16"}
              ${["÷", "×", "-", "+", "="].includes(btn) ? "text-red-600" : "text-white"}
              ${["C", "AC", "%"].includes(btn) ? "text-gray-400" : ""}
              bg-gray-800 hover:bg-gray-700 active:bg-gray-600
              transition-colors duration-100
            `}
                        onClick={() => handleButtonClick(btn.replace("×", "*").replace("÷", "/"))}
                    >
                        {btn}
                    </button>
                ))}
            </div>
        </div>
    );
};


export default Calculator;
