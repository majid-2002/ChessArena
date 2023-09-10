"use client";

import { useEffect, useState } from "react";
import chessboard from "@/../public/images/board.png";
import { pieceImageData } from "@/utils/pieces";
import Image from "next/image";
import { Square, Move, Color } from "chess.js";
import { connectSocket } from "@/utils/socket";
import { Socket, io } from "socket.io-client";
import { data } from "autoprefixer";

interface PlayProps {
  boardArray: any;
  chess: any;
  playComputer: boolean;
  setCurrentTurn: (currentTurn: string) => void;
  currentTurn: string;
  setBoardArray: (boardArray: any) => void;
  change: string;
  setChange: (change: string) => void;
  fen: string;
  setNewfen: (fen: string) => void;
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
}: PlayProps) => {
  const [currentPosition, setCurrentPosition] = useState<string>("");
  const [moves, setMoves] = useState<Move[]>([]);
  const [roomId, setRoomId] = useState<string>("");
  const [playerColor, setPlayerColor] = useState<string>("");
  const [socket, setSocket] = useState<Socket | null>(null);

  // useEffect(() => {
  //   setSocket(connectSocket());
  // }, []);

  // useEffect(() => {
  //   if (!socket) return;

  //   socket.on("game", (data) => {
  //     setRoomId(data.roomId);
  //     setPlayerColor(data.color);
  //     setChange(data.color);
  //   });

  //   // socket.on("fen", (fen: string) => {
  //   //   console.log("fen changed");
  //   //   setNewfen(fen);
  //   //   chess.load(fen);
  //   //   setBoardArray(chess.board());
  //   // });

  //   return () => {
  //     socket.disconnect();
  //   };
  // }, [socket]);

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
      setBoardArray(change == "w" ? chess.board() : chess.board().reverse());
    }, 1000);
  };

  // useEffect(() => {
  //   socket?.emit("fen", fen);
  // }, [fen]);

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
                        setMoves([]);
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
