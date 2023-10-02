"use client";
import { useEffect, useState } from "react";
import { AiFillPlusSquare } from "react-icons/ai";
import { Play } from "@/app/components/Play";
import { connectSocket } from "@/utils/socket";
import { Chess, Color } from "chess.js";
import { Socket } from "socket.io-client";

export default function PlayOnline() {
  const chess = new Chess();
  const [change, setChange] = useState<Color>("w");
  const [currentTurn, setCurrentTurn] = useState<Color>(chess.turn());
  const [boardArray, setBoardArray] = useState(chess.board());
  const [fen, setNewfen] = useState(chess.fen());
  const [playerColor, setPlayerColor] = useState<Color | null>(null);
  const [gameReady, setGameReady] = useState(false);

  useEffect(() => {
    chess.load(fen);
    if (playerColor) setChange(playerColor);
    setBoardArray(change === "w" ? chess.board() : chess.board().reverse());
    setCurrentTurn(chess.turn())
  }, [change, playerColor, setNewfen]);

  useEffect(() => {
    const socket = connectSocket();
    socket.on("connect", () => {
      console.log("connected to server");
      handleSocketActions(socket);
    });
  }, []);

  const handleSocketActions = (socket: Socket) => {
    const initializePlayer = async () => {
      let roomId = localStorage.getItem("roomId");
      let playerId = localStorage.getItem("playerId");

      if (!roomId || !playerId) {
        if (!playerId) {
          await new Promise((resolve) => {
            socket.emit("newPlayer", true, (id: string) => {
              localStorage.setItem("playerId", id);
              playerId = id;
              createGame(socket, playerId);
              resolve(true);
            });
          });
        } else {
          createGame(socket, playerId);
        }
      }

      socket.on("gameCreated", (gameData) => {
        localStorage.setItem("roomId", gameData.roomId);
        setPlayerColor(gameData.color);
        handleCommonLogic();
      });

      handleCommonLogic();
    };

    const handleCommonLogic = () => {
      const roomId = localStorage.getItem("roomId");
      const playerId = localStorage.getItem("playerId");


      if (roomId && playerId && !gameReady) {
        socket.emit("joinRoom", roomId, playerId, (cb: string) => {
          console.log(cb);
        });
        socket.on("startGame", async (gameData) => {
          if (gameData.gameReady) {
            setNewfen(gameData.fen);
            if (gameData.players) {
              gameData.players.map((player: any) => {
                if (player._id === playerId) {
                  setPlayerColor(player.playerColor);
                }
              });
            }
            setGameReady(gameData.gameReady);
          } else {
            setGameReady(gameData.gameReady); //here it is false
          }
        });
      }
    };

    initializePlayer();
  };

  const createGame = (socket: Socket, playerId: string) => {
    socket.emit("createGame", playerId, fen, (cb: any) => {
      console.log(cb);
    });
  };

  return (
    <div className="w-full h-screen flex flex-col sm:flex-row items-center justify-center sm:space-x-5 space-y-8 p-5">
      {/* Chessboard */}
      <Play
        chess={chess}
        setCurrentTurn={setCurrentTurn}
        currentTurn={currentTurn}
        boardArray={boardArray}
        setBoardArray={setBoardArray}
        playComputer={false}
        change={change}
        setChange={setChange}
        fen={fen}
        setNewfen={setNewfen}
        playerColor={playerColor}
        setPlayerColor={setPlayerColor}
        gameReady={gameReady}
      />
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
        <div className=" flex-col flex p-5 space-y-5">
          <div className="bg-lime-300/70 flex items-center justify-center rounded-xl text-center shadow-xl sm:text-2xl text-white font-bold border border-b-8 border-green-900/70 rounded-b-2xl">
            <button className="text-shadow-lg p-2 w-full">Play</button>
          </div>
          <div className="bg-neutral-600/70 flex items-center justify-center rounded-xl text-center shadow-xl sm:text-2xl text-white font-bold border border-b-8 border-neutral-800/70 rounded-b-2xl">
            <button
              className="text-shadow-lg p-2 w-full"
              onClick={() => {
                setChange(change === "w" ? "b" : "w");
              }}
            >
              Change
            </button>
          </div>
          <p className="text-red-50">
            Current Turn: {currentTurn === "w" ? "White" : "Black"}
          </p>
        </div>
      </div>
    </div>
  );
}
