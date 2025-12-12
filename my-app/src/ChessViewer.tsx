import { useEffect, useRef, useState } from "react";
import { Chessboard } from "react-chessboard"; // or your chess library

type Player = {
  username: string;
};

type Move = {
  moveNumber: number;
  color: "WHITE" | "BLACK";
  san: string;
  from: string;
  to: string;
  promotion: string;
  fenAfter: string;
};

type Game = {
  id: string;
  url: string;
  whitePlayer: Player;
  blackPlayer: Player;
  result: string;
  ecoCode: string;
  moves: Move[];
};

type ChessViewerProps = {
  game: Game;
};

export default function ChessViewer({ game }: ChessViewerProps) {
  if (!game || !game.moves) {
    return (
      <div style={{ width: "500px", margin: "20px auto", textAlign: "center" }}>
        <h3>Error: Game data not available</h3>
      </div>
    );
  }

  const [moveIndex, setMoveIndex] = useState(0);
  const movesContainerRef = useRef<HTMLOListElement | null>(null);
  const moveItemRefs = useRef<(HTMLLIElement | null)[]>([]);

  // Current FEN position based on move index
  const currentFen = moveIndex === 0 ? "start" : game.moves[moveIndex - 1].fenAfter;

  const next = () => {
    if (moveIndex < game.moves.length) setMoveIndex(moveIndex + 1);
  };

  const prev = () => {
    if (moveIndex > 0) setMoveIndex(moveIndex - 1);
  };

  const jumpTo = (index: number) => {
    // index is half-move count (ply). 0 means start position.
    if (index >= 0 && index <= game.moves.length) {
      setMoveIndex(index);
    }
  };

  // Auto-scroll the moves list to keep the current move in view
  useEffect(() => {
    // moveIndex 0 is start; items start at index 1 => map to i = moveIndex - 1
    const item = moveItemRefs.current[moveIndex - 1];
    const container = movesContainerRef.current;
    if (!item || !container) return;

    // Prefer scrollIntoView for reliability across styling changes
    try {
      item.scrollIntoView({ behavior: "smooth", block: "nearest" });
    } catch {
      // Fallback manual scroll math
      const itemTop = item.offsetTop;
      const itemBottom = itemTop + item.offsetHeight;
      const viewTop = container.scrollTop;
      const viewBottom = viewTop + container.clientHeight;

      if (itemTop < viewTop) {
        container.scrollTop = itemTop - 8;
      } else if (itemBottom > viewBottom) {
        container.scrollTop = itemBottom - container.clientHeight + 8;
      }
    }
  }, [moveIndex]);

  return (
    <div style={{ maxWidth: "900px", margin: "20px auto" }}>
      {/* Move titles above the two-column layout so both columns align at the very top */}
      <div style={{ textAlign: "center", marginBottom: 12 }}>
        <h2 style={{ margin: 0 }}>
          {game.whitePlayer.username} vs {game.blackPlayer.username}
        </h2>
        <h3 style={{ marginTop: 6, marginBottom: 0 }}>Result: {game.result}</h3>
      </div>
      <div style={{ display: "flex", gap: "20px", alignItems: "flex-start" }}>
        <div style={{ width: "400px", textAlign: "center" }}>

<Chessboard
  options={{
    position:
      currentFen === "start"
        ? "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
        : currentFen,
    showNotation: true,
    alphaNotationStyle: { color: "#6b7280", fontWeight: 600 },
    numericNotationStyle: { color: "#6b7280", fontWeight: 600 },
    boardStyle: {
      width: "350px",
      height: "350px",
      border: "2px solid #333",
      borderRadius: 8,
      boxShadow: "0 2px 10px rgba(0,0,0,0.12)",
      backgroundColor: "#fff"
    }
          }}
/>
        </div>

        <div style={{ flex: 1, display: "flex", flexDirection: "column", height: "350px", minWidth: "220px" }}>
          <h3 style={{ marginTop: 0, marginBottom: 8, textAlign: "left" }}>Moves</h3>
          <ol ref={movesContainerRef} style={{ paddingLeft: "24px", paddingRight: "12px", flex: 1, minHeight: 0, overflowY: "auto", border: "1px solid #ddd", borderRadius: 6 }}>
            {/* Each item represents a half-move (ply). Index for jumpTo is i+1 since moveIndex counts from 1 */}
            {game.moves.map((m, i) => {
              const isCurrent = moveIndex === i + 1;
              return (
                <li
                    key={i}
                    ref={(el) => {
                      moveItemRefs.current[i] = el;
                    }}
                    style={{
                      cursor: "pointer",
                      padding: "4px 8px",
                      background: isCurrent ? "#e6f7ff" : undefined,
                      borderLeft: isCurrent ? "3px solid #1890ff" : undefined
                    }}
                    onClick={() => jumpTo(i + 1)}
                    title={`Go to move ${i + 1}`}
                >
                  <span style={{ fontWeight: m.color === "WHITE" ? 600 : 400 }}>
                    {m.moveNumber}. {m.color === "WHITE" ? "White" : "Black"}
                  </span>{" "}
                  <span>{m.san || `${m.from}-${m.to}`}</span>
                </li>
              );
            })}
          </ol>

        </div>
      </div>
      {/* Unified controls panel under board and moves log */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 16 }}>
        <button onClick={() => jumpTo(0)} disabled={moveIndex === 0}>⏮ Start</button>
        <button onClick={prev} disabled={moveIndex === 0}>⬅ Back</button>
        <span style={{ margin: "0 10px", fontWeight: "bold" }}>
          Move: {moveIndex}/{game.moves.length}
        </span>
        <button onClick={next} disabled={moveIndex === game.moves.length}>Next ➡</button>
        <button onClick={() => jumpTo(game.moves.length)} disabled={moveIndex === game.moves.length}>⏭ End</button>
      </div>
    </div>
  );
}
