"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import chessboard from "@/../public/images/board.png";
import { pieceImageData } from "@/utils/pieces";
import { AiFillPlusSquare } from "react-icons/ai";
import { Chess } from "chess.js";

export default function Playpage() {
  const chess = new Chess();
  const [boardArray, setBoardArray] = useState<any>([]);

  useEffect(() => {
    setBoardArray(chess.board());
    console.log(boardArray);
  }, []);

  return (
    <div className="w-full h-screen flex flex-col sm:flex-row items-center justify-center sm:space-x-5 space-y-8 p-5">
      {/* Chessboard */}
      <div className="relative sm:w-1/2 md:2/3 w-full justify-center flex items-center">
        <Image src={chessboard} alt="Chessboard" className="w-full" />
        <div className="grid grid-cols-8 grid-rows-8 absolute top-0 w-full">
          {boardArray.map((row: any, index: number) => {
            return row.map((piece: any, index: number) => {
              return (
                <div
                  key={index}
                  className="w-full flex items-center justify-center h-full"
                >
                  {piece && (
                    <Image
                      src={pieceImageData(piece.type, piece.color)}
                      alt="piece"
                      width={100}
                      height={100}
                      className="w-full h-full"
                    />
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
