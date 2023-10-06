import { Color } from "chess.js";
import { PieceSymbol} from "chess.js";

const pieceImageData = (piece: PieceSymbol, color : Color) => {

  return `https://images.chesscomfiles.com/chess-themes/pieces/neo/150/${color}${piece}.png`;
};

export { pieceImageData };
