"use client";

import Image from "next/image";
import chessboard from "@/../public/images/Chessboard.png";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen w-full py-9 justify-center">
      <div className="flex">
        <div className="w-1/2 hidden items-center justify-center sm:flex">
          <Image
            src={chessboard}
            alt="Chessboard"
            width={600}
            height={500}
            className="rounded-lg"
          />
        </div>
        <div className="flex flex-col sm:w-1/2 justify-evenly w-full">
          <div className="md:text-6xl sm:text-4xl text-2xl font-bold text-white flex flex-col items-center p-8">
            <h4 className="inline">Play Chess</h4>
            <h4 className="inline">Online</h4>
          </div>
          <div className="flex flex-col w-auto items-center justify-center space-y-7 p-3">
            <div className="bg-lime-300/70 cursor-pointer flex items-center w-52 md:w-1/2 sm:w-5/6 rounded-xl max-sm:justify-center max-sm:text-xl shadow-xl sm:text-left  sm:text-2xl text-white font-bold  border border-b-8 border-green-900/70 rounded-b-2xl">
              <Link href="/play/online">
                <button className="p-4 text-shadow-lg">Play Online</button>
              </Link>
            </div>
            <div className="bg-neutral-600 flex items-center w-52  md:w-1/2 sm:w-5/6 rounded-xl max-sm:justify-center max-sm:text-xl shadow-xl sm:text-left sm:text-2xl  text-white font-bold border border-b-8 border-neutral-800/70 rounded-b-2xl">
              <Link href="/play/computer">
                <button className="p-4 text-shadow-lg">Play Computer</button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
