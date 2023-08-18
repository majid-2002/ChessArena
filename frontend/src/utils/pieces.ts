type color = "w" | "b";
export type pieceType = "r" | "k" | "b" | "q" | "k" | "p";

const pieceImageData = (piece: pieceType, color: color) => {
  return `https://images.chesscomfiles.com/chess-themes/pieces/neo/150/${color}${piece}.png`;
};

export { pieceImageData };
