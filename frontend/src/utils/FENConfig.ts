import { Square, PieceSymbol, Color } from "chess.js";

export type ChessPiece = {
  square: Square;
  color: Color;
  type: PieceSymbol;
} | null;

function convertBoardArrayToFEN(boardArray: ChessPiece[][]) {
  let fen = "";

  for (let row of boardArray) {
    let emptyCount = 0;
    for (let piece of row) {
      if (piece === null) {
        emptyCount++;
      } else {
        if (emptyCount > 0) {
          fen += emptyCount;
          emptyCount = 0;
        }
        fen +=
          piece.color === "w"
            ? piece.type.toUpperCase()
            : piece.type.toLowerCase();
      }
    }
    if (emptyCount > 0) {
      fen += emptyCount;
    }
    fen += "/";
  }

  fen = fen.slice(0, -1); // Remove trailing '/'
  return fen;
}

export default convertBoardArrayToFEN;
