import { useState } from "react";
import chessboard from "@/../public/images/board.png";
import { pieceImageData } from "@/utils/pieces";
import Image from "next/image";
import { Square, Move } from "chess.js";

interface PlayProps {
  boardArray: any;
  chess: any;
  playComputer: boolean;
  setCurrentTurn: (currentTurn: string) => void;
  setBoardArray: (boardArray: any) => void;
  play: string;
}

export const Play = ({
  boardArray,
  chess,
  setCurrentTurn,
  setBoardArray,
  playComputer,
  play,
}: PlayProps) => {
  const [currentPosition, setCurrentPosition] = useState<string>("");
  const [moves, setMoves] = useState<Move[]>([]);
  const [fen, setNewfen] = useState(chess.fen());

  const shouldHighlightSquare = (square: Square) =>
    moves.some((move) => move.to === square);

  const makeComputerMove = () => {
    setTimeout(() => {
      if (chess.turn() === "b") {
        const moves = chess.moves();
        const move = moves[Math.floor(Math.random() * moves.length)];
        chess.move(move);
      }
      setNewfen(chess.fen());
      setCurrentTurn(chess.turn());
      setBoardArray(chess.board());
    }, 1000);
  };

  return (
    <div className="relative w-full sm:w-1/2 justify-center flex items-center">
      <Image src={chessboard} alt="Chessboard" className="w-full h-full" />
      <div className="grid grid-cols-8 grid-rows-8 absolute top-0 w-full ">
        {boardArray.map((row: any, rowIndex: number) => {
          return row.map((piece: any, colIndex: number) => {
            const square = `${String.fromCharCode(97 + colIndex)}${
              play === "w" ? 8 - rowIndex : rowIndex + 1
            }`;

            return (
              <div key={colIndex} className="h-full w-full relative">
                {piece ? (
                  <div
                    className={
                      piece.square === currentPosition
                        ? "w-full h-full bg-[#BBCC44]"
                        : shouldHighlightSquare(piece.square)
                        ? "w-full h-full bg-[#f6ab80] border border-[#f6ab80]"
                        : "w-full h-full "
                    }
                    onClick={() => {
                      if (moves.length === 0) {
                        chess.load(fen);
                        setMoves(
                          chess.moves({
                            square: piece.square,
                            piece: piece.type,
                            verbose: true,
                          })
                        );
                        setCurrentPosition(piece.square);
                      } else if (shouldHighlightSquare(piece.square)) {
                        // Check if the clicked square is a valid move (including capturing)
                        chess.load(fen);
                        chess.move({
                          from: currentPosition,
                          to: piece.square,
                        });
                        setNewfen(chess.fen());
                        setCurrentTurn(chess.turn());
                        setBoardArray(
                          play == "w" ? chess.board() : chess.board().reverse()
                        );
                        setMoves([]);
                        setCurrentPosition(piece.square);
                        if (playComputer) {
                          makeComputerMove();
                        }
                      } else {
                        setMoves([]);
                        setCurrentPosition("");
                      }
                    }}
                  >
                    {rowIndex === 7 && (
                      <div
                        className={`absolute bottom-0 right-1 text-sm ${
                          (colIndex + 1) % 2 === 0
                            ? "text-green-700"
                            : "text-white"
                        }`}
                      >
                        {piece.square[0]}
                      </div>
                    )}
                    {colIndex === 0 && (
                      <div
                        className={`absolute top-0 left-1 text-sm ${
                          (rowIndex + 1) % 2 === 0
                            ? "text-white"
                            : "text-green-700"
                        }`}
                      >
                        {piece.square[1]}
                      </div>
                    )}
                    <Image
                      src={pieceImageData(piece.type, piece.color)}
                      alt="piece"
                      width={200}
                      height={200}
                      className="w-full h-full"
                    />
                  </div>
                ) : (
                  <div
                    className={`w-full h-full ${
                      shouldHighlightSquare(square as Square)
                        ? "bg-[#f4f680] border border-[#efe862]"
                        : ""
                    }`}
                    onClick={() => {
                      if (moves.length > 0) {
                        chess.load(fen);
                        chess.move({ from: currentPosition, to: square });
                        setNewfen(chess.fen());
                        setCurrentTurn(chess.turn());
                        setBoardArray(
                          play == "w" ? chess.board() : chess.board().reverse()
                        );
                        setMoves([]);
                        if (playComputer) {
                          makeComputerMove();
                        }
                      }
                    }}
                  >
                    {colIndex === 0 && (
                      <div
                        className={`absolute top-0 left-1 text-sm ${
                          (rowIndex + 1) % 2 === 0
                            ? "text-white"
                            : "text-green-700"
                        }`}
                      >
                        {square[1]}
                      </div>
                    )}
                    <Image
                      src={pieceImageData("p", "b")}
                      alt="piece"
                      width={200}
                      height={200}
                      className="w-full h-full opacity-0"
                    />
                  </div>
                )}
              </div>
            );
          });
        })}
      </div>
    </div>
  );
};
