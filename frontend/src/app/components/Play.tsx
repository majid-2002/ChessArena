import { useEffect } from "react";
import chessboard from "@/../public/images/board.png";
import { pieceImageData } from "@/utils/pieces";
import Image from "next/image";

interface PlayProps {
  boardArray: any;
  currentPosition: string;
  moves: string[];
  setMoves: (moves: string[]) => void;
  setCurrentPosition: (currentPosition: string) => void;
  fen: string;
  chess: any;
  playComputer: boolean;
  setNewfen: (fen: string) => void;
  setCurrentTurn: (currentTurn: string) => void;
  setBoardArray: (boardArray: any) => void;
  shouldHighlightSquare: (square: string) => boolean;
  play: string;
}

export const Play = ({
  boardArray,
  currentPosition,
  moves,
  setMoves,
  setCurrentPosition,
  fen,
  chess,
  setNewfen,
  setCurrentTurn,
  setBoardArray,
  shouldHighlightSquare,
  playComputer,
  play,
}: PlayProps) => {
  // useEffect(() => {
  //   console.log(chess.moves());
  //   console.log(boardArray);
  // });

  return (
    <div className="relative w-full sm:w-1/2 justify-center flex items-center">
      <Image src={chessboard} alt="Chessboard" className="w-full h-full" />

      <div className="grid grid-cols-8 grid-rows-8 absolute top-0 w-full ">
        {play == "w"
          ? // Board array when the player is white
            boardArray.map((row: any, rowIndex: number) => {
              return row.map((piece: any, colIndex: number) => {
                const square = `${String.fromCharCode(97 + colIndex)}${
                  8 - rowIndex
                }`;

                return (
                  <div key={colIndex} className="h-full w-full relative">
                    {piece ? (
                      <div
                        className={
                          piece.square === currentPosition
                            ? "w-full h-full bg-[#BBCC44]"
                            : "w-full h-full "
                        }
                        onClick={() => {
                          if (moves.length === 0) {
                            chess.load(fen);
                            setMoves(
                              chess.moves({
                                square: piece.square,
                                piece: piece.type,
                              })
                            );
                            setCurrentPosition(piece.square);
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
                          shouldHighlightSquare(square)
                            ? "bg-[#f4f680] border border-[#efe862]"
                            : ""
                        }`}
                        onClick={() => {
                          if (moves.length > 0) {
                            chess.load(fen);
                            chess.move({ from: currentPosition, to: square });
                            setNewfen(chess.fen());
                            setCurrentTurn(chess.turn());
                            setBoardArray(chess.board());
                            setMoves([]);

                            {
                              playComputer &&
                                setTimeout(() => {
                                  if (chess.turn() === "b") {
                                    const moves = chess.moves();
                                    const move =
                                      moves[
                                        Math.floor(Math.random() * moves.length)
                                      ];
                                    chess.move(move);
                                  }
                                  setNewfen(chess.fen());
                                  setCurrentTurn(chess.turn());
                                  setBoardArray(chess.board());
                                }, 1000);
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
            })
          : // Board array when the player is black
            boardArray.map((row: any, rowIndex: number) => {
              return row.map((piece: any, colIndex: number) => {
                const square = `${String.fromCharCode(97 + colIndex)}${
                  rowIndex + 1
                }`;

                return (
                  <div key={colIndex} className="h-full w-full relative">
                    {piece ? (
                      <div
                        className={
                          piece.square === currentPosition
                            ? "w-full h-full bg-[#BBCC44]"
                            : "w-full h-full "
                        }
                        onClick={() => {
                          if (moves.length === 0) {
                            chess.load(fen);
                            setMoves(
                              chess.moves({
                                square: piece.square,
                                piece: piece.type,
                              })
                            );
                            setCurrentPosition(piece.square);
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
                          shouldHighlightSquare(square)
                            ? "bg-[#f4f680] border border-[#efe862]"
                            : ""
                        }`}
                        onClick={() => {
                          if (moves.length > 0) {
                            chess.load(fen);
                            chess.move({ from: currentPosition, to: square });
                            setNewfen(chess.fen());
                            setCurrentTurn(chess.turn());
                            setBoardArray(chess.board().reverse());
                            setMoves([]);

                            {
                              playComputer &&
                                setTimeout(() => {
                                  if (chess.turn() === "b") {
                                    const moves = chess.moves();
                                    const move =
                                      moves[
                                        Math.floor(Math.random() * moves.length)
                                      ];
                                    chess.move(move);
                                  }
                                  setNewfen(chess.fen());
                                  setCurrentTurn(chess.turn());
                                  setBoardArray(chess.board());
                                }, 1000);
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
