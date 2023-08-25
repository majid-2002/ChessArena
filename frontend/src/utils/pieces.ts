type color = "w" | "b";

const pieceImageData = (piece: string, color: color) => {
  return `https://images.chesscomfiles.com/chess-themes/pieces/neo/150/${color}${piece[0]}.png`;
};

export { pieceImageData };
