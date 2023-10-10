"use client";

import { use, useEffect, useState } from "react";
import chessboardPlain from "@/../public/images/board.png";
import chessBoardDemo from "@/../public/images/Chessboard.png";
import { pieceImageData } from "@/utils/pieces";
import Image from "next/image";
import { Square, Move, Color, PieceSymbol } from "chess.js";
import { Socket } from "socket.io-client";
import { connectSocket } from "@/utils/socket";

interface PlayProps {
  boardArray: any;
  setBoardArray: (boardArray: any) => void;
  chess: any;
  playComputer: boolean;
  currentTurn: string;
  setCurrentTurn: (currentTurn: Color) => void;
  change: string;
  setChange: (change: Color) => void;
  fen: string;
  setNewfen: (fen: string) => void;
  playerColor: Color | null;
  setPlayerColor: (playerColor: Color) => void;
  gameReady: boolean;
  opponentId: string | null;
  startGame: boolean;
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
  playerColor,
  setPlayerColor,
  gameReady,
  opponentId,
  startGame,
}: PlayProps) => {
  type CapturedPieceSymbol = "p" | "n" | "b" | "r" | "q";

  type CaputredPieces = {
    [color in Color]: {
      [piece in CapturedPieceSymbol]: number;
    };
  };

  const [currentPosition, setCurrentPosition] = useState<string>("");
  const [moves, setMoves] = useState<Move[]>([]);
  const [socket, setSocket] = useState<Socket>(connectSocket());
  const [onMove, setOnMove] = useState(false);
  const [inComingFen, setInComingFen] = useState(false);
  const [showPromotion, setShowPromotion] = useState(false);
  const [promotionPieces, setPromotionPieces] = useState<Move[]>();
  const [capturedPieces, setCapturedPieces] = useState<CaputredPieces>({
    w: {
      p: 0,
      n: 0,
      b: 0,
      r: 0,
      q: 0,
    },
    b: {
      p: 0,
      n: 0,
      b: 0,
      r: 0,
      q: 0,
    },
  });

  const [promotionMoveFromAndTo, setPromotionMoveFromAndTo] = useState<{
    from: string;
    to: string;
  }>();

  useEffect(() => {
    // console.log(capturedPieces);
  }, [capturedPieces, setCapturedPieces]);

  useEffect(() => {
    setSocket(connectSocket());
    OnMoveSendFEN();
  }, [onMove == true]);

  useEffect(() => {
    if (inComingFen) {
      setInComingFen(false);
      chess.load(fen);
      if (playerColor) setChange(playerColor);
      setBoardArray(change === "w" ? chess.board() : chess.board().reverse());
      setCurrentTurn(chess.turn());
    }
  }, [inComingFen == true]);

  const OnMoveSendFEN = () => {
    let roomId = localStorage.getItem("roomId");
    let playerId = localStorage.getItem("playerId");

    if (playerId && roomId && gameReady && onMove) {
      socket.emit("gameUpdate", roomId, fen, (cb: string) => {
        setOnMove(false);
        console.log(cb);
      });
    }
  };

  socket.on("gameUpdate", (updatedFen) => {
    if (updatedFen) {
      setInComingFen(true);
      setNewfen(updatedFen);
    }
  });

  //? Captured Pieces Logic
  const getCaputredPieces = () => {
    const previousMove = chess.history({
      verbose: true,
    });

    if (previousMove[previousMove.length - 1].captured) {
      const capturedMove = previousMove[previousMove.length - 1];
      const pieceColor = capturedMove.color as Color;
      const capturedPiece =
        capturedMove.captured as keyof CaputredPieces[Color];

      setCapturedPieces((prev) => {
        const updatedCapturedPieces = { ...prev };

        updatedCapturedPieces[pieceColor][capturedPiece]++;

        return updatedCapturedPieces;
      });
    }
  };

  //? Highlighting Logic
  const shouldHighlightSquare = (square: Square) =>
    moves.some((move) => move.to === square);

  //? Computer Logic
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

  //? Pawn Promotion Logic
  const isPawnPromotionMove = (square: string): boolean => {
    const promotionMoves = moves.filter(
      (move) => move.promotion && move.to === square && move.piece === "p"
    );

    setPromotionPieces(promotionMoves);
    setShowPromotion(promotionMoves.length > 0);

    return promotionMoves.length > 0;
  };

  const [dots, setDots] = useState("");

  useEffect(() => {
    setInterval(() => {
      setDots((prevdot) => (prevdot.length < 3 ? prevdot + "." : ""));
    }, 1000);
  }, [gameReady]);

  return (
    <div className=" w-full sm:w-1/2 justify-center flex flex-col items-center space-y-2">
      <div className="flex flex-row justify-between w-full">
        <div className="flex flex-row gap-x-2">
          <div>
            <Image
              src={`https://www.chess.com/bundles/web/images/${
                playerColor == "b" ? "white_400" : "black_400"
              }.png`}
              alt="Opponent"
              width={40}
              height={40}
            ></Image>
          </div>
          <p className="text-white font-bold text-xs p-1">
            {playerColor == change
              ? "Guest" + opponentId?.slice(-10)
              : "Opponent"}
          </p>
        </div>
        <div className={"flex items-center px-4 font-sans"}>
          <p className="font-bold text-neutral-500 text-2xl">3:00</p>
        </div>
      </div>
      <div className="relative h-full w-full">
        {/* Player Waiting to load the game */}
        {startGame && (
          <div className="h-full absolute w-full backdrop-blur-sm z-10 flex items-center justify-center bg-[rgba(0,0,0,0.6)]">
            <p className="text-xl sm:text-4xl font-bold text-neutral-300 text-center">
              Waiting for opponent {dots.split("").join(" ")}
            </p>
          </div>
        )}

        {/* Player Promotion Selection Modal */}
        {showPromotion && (
          <div className="h-full absolute w-full  flex justify-center items-center bg-[rgba(0,0,0,0.6)] backdrop-blur-sm z-40">
            <div className="flex flex-row justify-center items-center gap-x-2">
              {promotionPieces?.map((move: Move) => (
                <div
                  className="flex flex-col items-center justify-center p-1 bg-[rgba(200,200,200,0.6)] rounded-md "
                  key={move.promotion}
                  onClick={() => {
                    if (promotionMoveFromAndTo) {
                      chess.move({
                        from: promotionMoveFromAndTo.from,
                        to: promotionMoveFromAndTo.to,
                        promotion: move.promotion as PieceSymbol,
                      });
                      setNewfen(chess.fen());
                      setOnMove(true);
                      setCurrentTurn(chess.turn());
                      setBoardArray(
                        change == "w" ? chess.board() : chess.board().reverse()
                      );
                      setMoves([]);
                      setCurrentPosition(promotionMoveFromAndTo.to);
                      setShowPromotion(false);
                      getCaputredPieces();

                      if (playComputer) {
                        makeComputerMove();
                      }
                    }
                  }}
                >
                  <Image
                    src={pieceImageData(
                      move.promotion as PieceSymbol,
                      move.color
                    )}
                    alt="piece"
                    width={50}
                    height={50}
                    className="w-full h-full"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        <Image
          src={gameReady ? chessboardPlain : chessBoardDemo}
          alt="Chessboard"
          className="w-full h-full"
        />

        {/* Main Logic for the game */}
        <div className="grid grid-cols-8 grid-rows-8 absolute top-0 w-full ">
          {gameReady &&
            boardArray.map((row: any, rowIndex: number) => {
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
                          if (currentTurn !== playerColor) return;

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
                            if (isPawnPromotionMove(piece.square)) {
                              setPromotionMoveFromAndTo({
                                from: currentPosition,
                                to: piece.square,
                              });
                              return;
                            } else if (
                              moves.some((move) => move.to === piece.square)
                            ) {
                              chess.move({
                                from: currentPosition,
                                to: piece.square,
                              });
                              getCaputredPieces();
                            } else {
                              setMoves([]);
                              return;
                            }

                            setNewfen(chess.fen());
                            setOnMove(true);
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
                          if (currentTurn !== playerColor) return;

                          if (moves.length > 0) {
                            chess.load(fen);
                            if (isPawnPromotionMove(square)) {
                              setPromotionMoveFromAndTo({
                                from: currentPosition,
                                to: square,
                              });
                              return;
                            } else if (
                              moves.some((move) => move.to === square)
                            ) {
                              chess.move({
                                from: currentPosition,
                                to: square,
                              });
                              getCaputredPieces();
                            } else {
                              setMoves([]);
                              return;
                            }
                            setNewfen(chess.fen());
                            setOnMove(true);
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
      <div className="flex flex-row justify-between w-full">
        <div className="flex flex-row gap-x-2">
          <div>
            <Image
              src={`https://www.chess.com/bundles/web/images/${
                playerColor == "b" && change == "b" ? "black_400" : "white_400"
              }.png`}
              alt="Opponent"
              width={40}
              height={40}
            ></Image>
          </div>
          <p className="text-white font-bold text-xs p-1">
            {playerColor == change
              ? "Guest" + localStorage.getItem("playerId")?.slice(-10)
              : "You"}
          </p>
        </div>
        <div className="flex items-center px-4 font-sans">
          <p className="font-bold text-neutral-500 text-2xl ">3:00</p>
        </div>
      </div>
    </div>
  );
};
