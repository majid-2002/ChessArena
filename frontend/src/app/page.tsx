import Image from "next/image";
import chessboard from "@/../public/images/Chessboard.png";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen w-full py-4">
      <div className="flex">
        <div className="w-1/2 hidden items-center justify-center sm:flex">
          <Image src={chessboard} alt="Chessboard" width={600} height={500} className="rounded-lg"/>
        </div>
        <div className="flex flex-col sm:w-1/2 justify-evenly w-full">
          <div className="sm:text-6xl text-2xl font-bold text-white flex flex-col items-center p-8">
            <h4 className="inline">Play Chess</h4>
            <h4 className="inline">Online</h4>
          </div>
          <div className="flex flex-col w-auto items-center justify-center space-y-7 p-3">
            <div className="bg-lime-300/70  flex items-center w-52 p-5 sm:w-96 rounded-xl max-sm:justify-center max-sm:text-xl shadow-xl sm:text-left sm:text-3xl text-white font-bold sm:px-10 sm:py-8 ">
              <button className="text-shadow-lg">Play Online</button>
            </div>
            <div className="bg-neutral-600 flex items-center w-52 p-5 sm:w-96 rounded-xl max-sm:justify-center max-sm:text-xl shadow-xl sm:text-left sm:text-3xl text-white font-bold sm:px-10  sm:py-8">
              <button className="text-shadow-lg">Play Computer</button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
