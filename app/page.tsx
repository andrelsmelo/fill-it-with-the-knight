/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from "react";

const knightMoves = [
  [2, 1], [1, 2], [-1, 2], [-2, 1],
  [-2, -1], [-1, -2], [1, -2], [2, -1]
];

interface SquareProps {
  isKnight: boolean;
  visited: boolean;
  isCurrent: boolean;
  onClick: () => void;
}

function Square({ isKnight, visited, isCurrent, onClick }: SquareProps) {
  return (
    <div
      onClick={onClick}
      className={`flex items-center justify-center border cursor-pointer
        ${visited ? "bg-green-500" : isCurrent ? "bg-gray-500" : "bg-white"}
        ${!visited && !isCurrent && (Math.floor((visited as any).index / 8) + Math.floor((visited as any).index / 8)) % 2 === 0
          ? 'bg-white'
          : 'bg-gray-400'}
        aspect-square w-full`}
    >
      {isKnight && "♞"}
    </div>
  );
}

export default function Home() {
  const [knightPos, setKnightPos] = useState([1, 7]);
  const [visited, setVisited] = useState(new Set(["1,7"]));
  const [gameOver, setGameOver] = useState(false);

  const handleMove = (x: number, y: number) => {
    const [kx, ky] = knightPos;
    const validMove = knightMoves.some(
      ([dx, dy]) => kx + dx === x && ky + dy === y
    );

    if (validMove && !visited.has(`${x},${y}`)) {
      setKnightPos([x, y]);
      setVisited(new Set([...visited, `${x},${y}`]));
      setGameOver(false);
    }
  };

  const resetGame = () => {
    setKnightPos([1, 7]);
    setVisited(new Set(["1,7"]));
    setGameOver(false);
  };

  const checkGameOver = () => {
    const [kx, ky] = knightPos;
    const canMove = knightMoves.some(
      ([dx, dy]) => !visited.has(`${kx + dx},${ky + dy}`) && kx + dx >= 0 && kx + dx < 8 && ky + dy >= 0 && ky + dy < 8
    );
    return !canMove;
  };

  const isGameComplete = visited.size === 64;
  const isStuck = checkGameOver();

  if (isGameComplete || isStuck) {
    setGameOver(true);
  }    

  return (
    <div className="flex flex-col items-center p-4 justify-center w-screen h-screen">
      <div className="grid grid-cols-8 w-64 h-64 border">
        {[...Array(8)].map((_, y) =>
          [...Array(8)].map((_, x) => (
            <Square
              key={`${x},${y}`}
              isKnight={x === knightPos[0] && y === knightPos[1]}
              visited={visited.has(`${x},${y}`)}
              isCurrent={x === knightPos[0] && y === knightPos[1]}
              onClick={() => handleMove(x, y)}
            />
          ))
        )}
      </div>
      {isGameComplete && (
        <div className="mt-4 text-green-600 font-bold">Parabéns! Você venceu!</div>
      )}
      {(isStuck && !isGameComplete) || gameOver && (
        <div className="mt-4 text-red-600 font-bold">Você não pode mais se mover. Fim de jogo!</div>
      )}
      <button
        onClick={resetGame}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
      >
        Reiniciar Jogo
      </button>
    </div>
  );
}
