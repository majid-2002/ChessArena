"use client";
import { useEffect, useState } from "react";
import { AiFillPlusSquare } from "react-icons/ai";
import { Play } from "@/app/components/Play";
import { connectSocket } from "@/utils/socket";
import { Chess, Color } from "chess.js";
import { Socket } from "socket.io-client";
import { ButtonGray, ButtonLime, ChipButton } from "@/app/components/Button";
import Openingoptions from "@/app/components/Openingoptions";

export default function PlayOnline() {
  const chess = new Chess();
  const [change, setChange] = useState<Color>("w");
  const [currentTurn, setCurrentTurn] = useState<Color>(chess.turn());
  const [boardArray, setBoardArray] = useState(chess.board());
  const [fen, setNewfen] = useState(chess.fen());
  const [playerColor, setPlayerColor] = useState<Color | null>(null);
  const [gameReady, setGameReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showOptions, setShowOptions] = useState(false);
  const [opponentId, setOpponentId] = useState<string | null>(null);
  const [showGameInitialSettings, setShowGameInitialSettings] = useState(false);
  const [startGame, setStartGame] = useState(false);

  useEffect(() => {
    const playerId = localStorage.getItem("playerId");
    if (!playerId) setShowGameInitialSettings(true);
  }, []);

  useEffect(() => {
    chess.load(fen);
    if (playerColor) setChange(playerColor);
    setBoardArray(change === "w" ? chess.board() : chess.board().reverse());
    setCurrentTurn(chess.turn());

    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, [change, playerColor, setNewfen]);

  useEffect(() => {
    const socket = connectSocket();
    socket.on("connect", () => {
      console.log("connected to server");
      handleSocketActions(socket);
    });
  }, []);

  useEffect(() => {
    handleSocketActions(connectSocket());
  }, [setStartGame, startGame]);

  const handleSocketActions = (socket: Socket) => {
    const initializePlayer = async () => {
      let roomId = localStorage.getItem("roomId");
      let playerId = localStorage.getItem("playerId");

      if ((!roomId || !playerId) && startGame) {
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
                } else {
                  console.log(player._id);
                  setOpponentId(player._id);
                }
              });
            }
            setGameReady(gameData.gameReady);
            setStartGame(false);
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
    <div>
      {/* Chessboard */}
      {isLoading ? (
        <div className="w-full flex items-center justify-center h-screen">
          <span className="loading loading-bars loading-md"></span>
        </div>
      ) : (
        <div>
          <div>
            {showGameInitialSettings && (
              <Openingoptions
                showModal={showGameInitialSettings}
                setShowModal={setShowGameInitialSettings}
              />
            )}
          </div>
          <div className="w-full sm:min-h-[700px] sm:max-h-screen flex flex-col sm:flex-row items-center justify-center sm:space-x-10 py-1">
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
              opponentId={opponentId}
              startGame={startGame}
            />
            <div className="sm:w-[30vw] w-full bg-stone-800/40 rounded-md sm:min-h-[95vh] sm:max-h-screen">
              <div className="flex flex-row justify-between w-full items-center">
                <div className="items-center flex justify-center flex-col p-4 text-slate-200 w-full space-y-1 bg-stone-700/25 rounded-md m-1">
                  <AiFillPlusSquare className="text-2xl" />
                  <p className="text-sm">New Game</p>
                </div>
                {/* <div className="items-center flex justify-center flex-col p-4 text-slate-200 w-full space-y-1">
                <AiFillPlusSquare className="text-2xl" />
                <p className="text-xs">Games</p>
              </div>
              <div className="items-center flex justify-center flex-col p-4 text-slate-200 w-full space-y-1">
                <AiFillPlusSquare className="text-2xl" />
                <p className="text-xs">Players</p>
              </div> */}
              </div>

              <div className="flex-col flex p-5 space-y-5 w-full overflow-hidden">
                <div
                  className="collapse collapse-arrow border-none rounded-md bg-stone-800 hover:bg-stone-700/75"
                  onClick={() => {
                    setShowOptions(!showOptions);
                  }}
                >
                  <p
                    className="collapse-title text-base text-neutral-200 text-center font-semibold"
                    style={{ paddingLeft: "3em" }}
                  >
                    10 min
                  </p>
                </div>

                {showOptions && (
                  <div className="flex flex-row justify-center space-x-4 ">
                    <ChipButton>5 min</ChipButton>
                    <ChipButton>10 min</ChipButton>
                    <ChipButton>30 min</ChipButton>
                  </div>
                )}
                <ButtonLime
                  onClick={() => {
                    setStartGame(true);
                  }}
                >
                  Play
                </ButtonLime>
              </div>

              {/* <ButtonGray
                onClick={() => {
                  setChange(change === "w" ? "b" : "w");
                }}
              >
                Change
              </ButtonGray> */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
