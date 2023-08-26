"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import chessboard from "@/../public/images/board.png";
import { pieceImageData } from "@/utils/pieces";
import convertBoardArrayToFEN from "@/utils/FENConfig";
import { AiFillPlusSquare } from "react-icons/ai";
import { Chess, Piece } from "chess.js";

export default function Playpage() {
  const chess = new Chess();
  const [boardArray, setBoardArray] = useState(chess.board());

  console.log(boardArray);

  let board = [];
  const verticalAxis = ["1", "2", "3", "4", "5", "6", "7", "8"];
  const horizontalAxis = ["a", "b", "c", "d", "e", "f", "g", "h"];

  for (let i = verticalAxis.length - 1; i >= 0; i--) {
    for (let j = 0; j < horizontalAxis.length; j++) {
      board.push(horizontalAxis[j] + verticalAxis[i]);
    }
  }

  console.log(board);

  return (
    <div className="w-full h-screen flex flex-col sm:flex-row items-center justify-center sm:space-x-5 space-y-8 p-5">
      {/* Chessboard */}
      <div className="relative sm:w-[800px] w-full justify-center flex items-center">
        <Image src={chessboard} alt="Chessboard" className="w-full h-full" />
        <div className="grid grid-cols-8 grid-rows-8 absolute top-0 w-full ">
          {board.map((square, index) => {
            const row = Math.floor(index / 8);
            const col = square.charCodeAt(0) - "a".charCodeAt(0);

            const piece = boardArray[row][col];
            const pieceKey = row * 8 + col; // Generate a unique key for each piece

            return (
              <div key={pieceKey} className="h-full w-full">
                {piece ? (
                  <Image
                    src={pieceImageData(piece.type, piece.color)}
                    alt="piece"
                    width={200}
                    height={200}
                    className="w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full">
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
