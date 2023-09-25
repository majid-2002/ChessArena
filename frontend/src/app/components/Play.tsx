"use client";

import { useEffect, useState } from "react";
import chessboard from "@/../public/images/board.png";
import { pieceImageData } from "@/utils/pieces";
import Image from "next/image";
import { Square, Move, Color } from "chess.js";
import { Socket } from "socket.io-client";

interface PlayProps {
  boardArray: any;
  setBoardArray: (boardArray: any) => void;
  chess: any;
  playComputer: boolean;
  currentTurn: string;
  setCurrentTurn: (currentTurn: Color) => void;
  change: string;
  setChange: (change: Color) => void;
  fen: string;
  setNewfen: (fen: string) => void;
  playerColor: Color | null;
  setPlayerColor: (playerColor: Color) => void;
  socket: Socket;
}

export const Play = ({
  boardArray,
  chess,
  setCurrentTurn,
  currentTurn,
  setBoardArray,
  playComputer,
  change,
  setChange,
  fen,
  setNewfen,
  playerColor,
  setPlayerColor,
  socket,
}: PlayProps) => {
  const [currentPosition, setCurrentPosition] = useState<string>("");
  const [moves, setMoves] = useState<Move[]>([]);

  useEffect(() => {
    let roomId = localStorage.getItem("roomId");

    
    if (roomId) {
      console.log("works here");
      socket.emit("gameResume", roomId, fen);
    }

    socket.on("gameUpdate", (gameData) => {
      console.log("Resuming game with data:");
      console.log(gameData);
      setNewfen(gameData.fen);
      chess.load(fen);
      setCurrentTurn(chess.turn());
      setBoardArray(change == "w" ? chess.board() : chess.board().reverse());
      setPlayerColor(gameData.color);
    });
  }, [fen, setNewfen]);

  const shouldHighlightSquare = (square: Square) =>
    moves.some((move) => move.to === square);

  const makeComputerMove = () => {
    setTimeout(() => {
      if (chess.turn() === "b") {
        const moves = chess.moves();
        const move = moves[Math.floor(Math.random() * moves.length)];
        chess.move(move);
      }
      console.log(chess.pgn([{ newline_char: "\n" }]) + "\n");
      setNewfen(chess.fen());
      setCurrentTurn(chess.turn());
      setBoardArray(change == "w" ? chess.board() : chess.board().reverse());
    }, 1000);
  };

  return (
    <div className="relative w-full sm:w-1/2 justify-center flex items-center">
      <Image src={chessboard} alt="Chessboard" className="w-full h-full" />
      <div className="grid grid-cols-8 grid-rows-8 absolute top-0 w-full ">
        {boardArray.map((row: any, rowIndex: number) => {
          return row.map((piece: any, colIndex: number) => {
            const square = `${String.fromCharCode(97 + colIndex)}${
              change === "w" ? 8 - rowIndex : rowIndex + 1
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
                        : "w-full h-full"
                    }
                    onClick={() => {
                      if (currentTurn !== playerColor) return;

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
                        chess.load(fen);
                        if (moves.some((move) => move.to === piece.square)) {
                          chess.move({
                            from: currentPosition,
                            to: piece.square,
                          });
                        } else {
                          setMoves([]);
                          return;
                        }
                        setNewfen(chess.fen());
                        setCurrentTurn(chess.turn());
                        setBoardArray(
                          change == "w"
                            ? chess.board()
                            : chess.board().reverse()
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
                      if (currentTurn !== playerColor) return;
                      if (moves.length > 0) {
                        chess.load(fen);
                        if (moves.some((move) => move.to === square)) {
                          chess.move({
                            from: currentPosition,
                            to: square,
                          });
                        } else {
                          setMoves([]);
                          return;
                        }
                        setMoves([]);
                        setNewfen(chess.fen());
                        setCurrentTurn(chess.turn());
                        setBoardArray(
                          change == "w"
                            ? chess.board()
                            : chess.board().reverse()
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
