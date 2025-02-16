'use client'

import { useState, useEffect, FormEvent} from 'react'

import Link from 'next/link'
import { Gear, Info } from '@phosphor-icons/react'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const knightMoves = [
  [2, 1],
  [1, 2],
  [-1, 2],
  [-2, 1],
  [-2, -1],
  [-1, -2],
  [1, -2],
  [2, -1],
]

interface SquareProps {
  x: number
  y: number
  isKnight: boolean
  visited: boolean
  onClick: () => void
}

const Square: React.FC<SquareProps> = ({ x, y, isKnight, visited, onClick }) => {
  const getBackgroundColor = () => {
    if (visited) return 'bg-green-500';
    if (isKnight) return 'bg-gray-500';
    return (x + y) % 2 === 0 ? 'bg-gray-200' : 'bg-white';
  };

  return (
    <div
      onClick={onClick}
      className={`flex items-center justify-center border cursor-pointer ${getBackgroundColor()} aspect-square w-full text-xs`}
    >
      {isKnight && '♞'}
    </div>
  );
};


export default function Home() {
  const [knightPos, setKnightPos] = useState<[number, number]>([1, 7])
  const [visited, setVisited] = useState<Set<string>>(new Set(['1,7']))
  const [gameOver, setGameOver] = useState(false)
  const [boardSize, setBoardSize] = useState<[number, number]>([8, 8])

  const handleMove = (x: number, y: number) => {
    const [kx, ky] = knightPos
    const validMove = knightMoves.some(
      ([dx, dy]) => kx + dx === x && ky + dy === y,
    )

    if (validMove && !visited.has(`${x},${y}`)) {
      setKnightPos([x, y])
      setVisited(new Set([...visited, `${x},${y}`]))
    }
  }

  const resetGame = () => {
    setKnightPos([1, 7])
    setVisited(new Set(['1,7']))
    setGameOver(false)
  }

  useEffect(() => {
    const checkGameOver = () => {
      const [kx, ky] = knightPos
      const canMove = knightMoves.some(
        ([dx, dy]) =>
          !visited.has(`${kx + dx},${ky + dy}`) &&
          kx + dx >= 0 &&
          kx + dx < 8 &&
          ky + dy >= 0 &&
          ky + dy < 8,
      )
  
      if (!canMove || visited.size === 64) {
        setGameOver(true)
      }
  
      return !canMove
    }

    
    checkGameOver()
  }, [knightPos, visited])

  const handleSizeChange = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const width = parseInt((e.currentTarget[0] as HTMLInputElement).value, 10);
    const height = parseInt((e.currentTarget[1] as HTMLInputElement).value, 10);
    
    setBoardSize([width, height]);
  }
  
  
  return (
    <div className="flex flex-col items-center p-4 justify-center w-screen h-screen">
      {/* Tutorial Modal */}
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" className="absolute top-4 right-4">
            <Info size={24} />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Tutorial</DialogTitle>
            <DialogDescription>
              Bem-vindo ao Passeio do Cavalo!
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col my-4">
            <p className="mt-4 text-gray-600">
              O objetivo do jogo é preencher todo o tabuleiro movendo o cavalo
              (♞) em seus movimentos em &quot;L&quot;. Você deve visitar todas
              as casas do tabuleiro sem repetir nenhuma.
            </p>
            <p className="mt-4 text-gray-600">
              Para mais detalhes sobre a teoria por trás do Passeio do Cavalo,
              visite a página de teoria clicando no botão abaixo.
            </p>
          </div>
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Fechar
              </Button>
            </DialogClose>

            <Link href="/theory">
              <Button variant="link" className="text-blue-500">
                Ver Teoria
              </Button>
            </Link>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Change Board Size */}
      <Dialog>
  <DialogTrigger asChild>
    <Button variant="outline" className="absolute top-4 left-4">
      <Gear size={24} />
    </Button>
  </DialogTrigger>
  
  <DialogContent className="sm:max-w-md">
    <DialogHeader>
      <DialogTitle>Alterar Tamanho do Tabuleiro</DialogTitle>
      <DialogDescription>
        Escolha o tamanho do tabuleiro para jogar.
      </DialogDescription>
    </DialogHeader>

    <div className="flex flex-col my-4">
      <p className="mb-4 text-gray-600">
        O tabuleiro padrão é de 8x8, mas você pode escolher um tamanho
        diferente para jogar. Insira os valores abaixo:
      </p>

      <form onSubmit={(e) => handleSizeChange(e)} className="space-y-4">
        <div>
          <Label htmlFor="rows" className="block text-sm font-medium text-gray-700">
            Número de linhas
          </Label>
          <Input
            id="rows"
            type="number"
            placeholder="Ex: 8"
            min={4}
            max={20}
            className="mt-1 w-full"
            required
          />
        </div>

        <div>
          <Label htmlFor="columns" className="block text-sm font-medium text-gray-700">
            Número de colunas
          </Label>
          <Input
            id="columns"
            type="number"
            placeholder="Ex: 8"
            min={4}
            max={20}
            className="mt-1 w-full"
            required
          />
        </div>

        <Button type="submit" className="w-full">
          Alterar
        </Button>
      </form>
    </div>

    <DialogFooter className="sm:justify-start">
      <DialogClose asChild>
        <Button type="button" variant="secondary">
          Fechar
        </Button>
      </DialogClose>
    </DialogFooter>
  </DialogContent>
</Dialog>

      {/* Game Board */}
      <div
        style={{ gridTemplateColumns: `repeat(${boardSize[0]}, minmax(0, 1fr))` }}
        className="grid w-96 h-96 border"
      >
        {[...Array(boardSize[1])].map((_, y) =>
          [...Array(boardSize[0])].map((_, x) => (
            <Square
              x={x}
              y={y}
              key={`${x},${y}`}
              isKnight={x === knightPos[0] && y === knightPos[1]}
              visited={visited.has(`${x},${y}`)}
              onClick={() => handleMove(x, y)}
            />
          )),
        )}
      </div>

      {/* Game Status */}
      {gameOver && visited.size === 64 && (
        <div className="mt-4 text-green-600 font-bold">
          Parabéns! Você venceu!
        </div>
      )}
      {gameOver && visited.size < 64 && (
        <div className="mt-4 text-red-600 font-bold">
          Você não pode mais se mover. Fim de jogo!
        </div>
      )}
      <button
        onClick={resetGame}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
      >
        Reiniciar Jogo
      </button>
    </div>
  )
}
