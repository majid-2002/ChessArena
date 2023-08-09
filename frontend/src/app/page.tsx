import Image from "next/image";
import chessboard from "@/../public/images/Chessboard.png";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen w-full py-4">
      <div className="flex">
        <div className="w-1/2 flex items-center justify-center">
          <Image src={chessboard} alt="Chessboard" width={600}  className="rounded-lg"/>
        </div>
        <div className="flex flex-col w-1/2  justify-between">
          <div className="text-6xl font-bold text-white flex flex-col items-center p-8">
            <h4 className="inline">Play Chess</h4>
            <h4 className="inline">Online</h4>
          </div>
          <div className="flex flex-col w-auto items-center justify-center space-y-7 p-3">
            <div className="bg-lime-300/70  flex items-center w-96 rounded-xl shadow-xl text-left text-3xl text-white font-bold px-10  py-8 ">
              <button className="text-shadow-lg">Play Online</button>
            </div>
            <div className="bg-neutral-600 flex items-center w-96 rounded-xl shadow-xl text-left text-3xl text-white font-bold px-10  py-8">
              <button className="text-shadow-lg">Play Computer</button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
