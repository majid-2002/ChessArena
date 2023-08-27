"use client";

import Image from "next/image";
import React, { use, useEffect, useState } from "react";
import chessboard from "@/../public/images/board.png";
import { pieceImageData } from "@/utils/pieces";
import convertBoardArrayToFEN from "@/utils/FENConfig";
import { AiFillPlusSquare } from "react-icons/ai";
import { Chess, Piece, Square } from "chess.js";

export default function Playpage() {
  const chess = new Chess();
  const [boardArray, setBoardArray] = useState(chess.board());
  const [currentPosition, setCurrentPosition] = useState<string>("");
  const [moves, setMoves] = useState<string[]>([]);
  const [fen, setNewfen] = useState(chess.fen());

  // let board = [];
  // const verticalAxis = ["1", "2", "3", "4", "5", "6", "7", "8"];
  // const horizontalAxis = ["a", "b", "c", "d", "e", "f", "g", "h"];

  // for (let i = verticalAxis.length - 1; i >= 0; i--) {
  //   for (let j = 0; j < horizontalAxis.length; j++) {
  //     board.push(horizontalAxis[j] + verticalAxis[i]);
  //   }
  // }

  return (
    <div className="w-full h-screen flex flex-col sm:flex-row items-center justify-center sm:space-x-5 space-y-8 p-5">
      {/* Chessboard */}
      <div className="relative w-full sm:w-1/2 justify-center flex items-center">
        <Image src={chessboard} alt="Chessboard" className="w-full h-full" />
        <div className="grid grid-cols-8 grid-rows-8 absolute top-0 w-full ">
          {boardArray.map((row: any, rowIndex: number) => {
            return row.map((piece: any, colIndex: number) => {
              // start from a8 to h1
              const square = `${String.fromCharCode(97 + colIndex)}${
                8 - rowIndex
              }`;

              return (
                <div key={colIndex} className="h-full w-full relative">
                  {piece ? (
                    <div
                      className = {square === currentPosition ? "w-full h-full bg-[#BBCC44]" : "w-full h-full "}
                      onClick={() => {
                        if (moves.length === 0) {
                          chess.load(fen);
                          console.log(chess.fen());
                          setMoves(chess.moves({ square: piece.square }));
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
                          {square[0]}
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
                          {square[1]}
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
                      className={
                        "w-full h-full " +
                        (moves.includes(square) ? "bg-[#f4f680] border border-[#efe862]" : "")
                      }
                      onClick={() => {
                        if (moves.length > 0) {
                          chess.load(fen);
                          chess.move({ from: currentPosition, to: square });
                          setNewfen(chess.fen());
                          setBoardArray(chess.board());
                          setMoves([]);
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

      <div className="w-full h-5/6 sm:w-1/2 md:w-1/3 bg-neutral-800  rounded-md">
        <div className="flex flex-row justify-between w-full items-center">
          <div className="items-center flex justify-center flex-col p-4 text-slate-200 w-full space-y-1">
            <AiFillPlusSquare className="text-2xl" />
            <p className="text-xs">New Game</p>
          </div>
          <div className="items-center flex justify-center flex-col p-4 text-slate-200 w-full space-y-1">
            <AiFillPlusSquare className="text-2xl" />
            <p className="text-xs">Games</p>
          </div>
          <div className="items-center flex justify-center flex-col p-4 text-slate-200 w-full space-y-1">
            <AiFillPlusSquare className="text-2xl" />
            <p className="text-xs">Players</p>
          </div>
        </div>
        <div className=" flex-col flex p-5">
          <div className="bg-lime-300/70 flex items-center justify-center rounded-xl text-center shadow-xl sm:text-2xl text-white font-bold border border-b-8 border-green-900/70 rounded-b-2xl">
            <button className="text-shadow-lg p-2 w-full">Play</button>
          </div>
        </div>
      </div>
    </div>
  );
}
