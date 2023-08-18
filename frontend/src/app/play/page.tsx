"use client";

import Image from "next/image";
import React from "react";
import chessboard from "@/../public/images/board.png";
import { pieceImageData, pieceType } from "@/utils/pieces";
import { Chess } from "chess.js";

export default function Playpage() {
  const chess = new Chess();

  const [fromIndex, setFromIndex] = React.useState<number>(-1);
  const [toIndex, setToIndex] = React.useState<number>(-1);

  const [moves, setMoves] = React.useState<string>(
    "rnbqkbnrppppppppxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxpppppppprnbkqbnr"
  );

  return (
    <div className="w-full h-screen flex justify-center items-center">
      {/* Chessboard */}
      <div className="relative">
        <Image src={chessboard} alt="Chessboard" className="w-[40vw]" />
        <div className="grid grid-cols-8 grid-rows-8 absolute top-0">
          {moves.split("").map((piece, index) => {
            return (
              <div
                key={index}
                className="w-[5vw] h-[5vw] flex items-center justify-center"
              >
                {piece === "x" ? (
                  ""
                ) : (
                  <Image
                    src={pieceImageData(piece as pieceType, "w")}
                    alt="piece"
                    width={100}
                    height={100}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
      {/* Moves */}
      <div className="w-[40vw] h-screen py-10 ml-5">
        <div className="bg-neutral-900/75 rounded-md h-4/5 flex-col flex p-10">
          <div>
            <div className="bg-lime-300/70 flex items-center justify-center rounded-xl text-center shadow-xl sm:text-2xl text-white font-bold border border-b-8 border-green-900/70 rounded-b-2xl">
              <button className="text-shadow-lg p-3 w-full">Play</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
