import './App.css';
import ChessViewer from './ChessViewer.tsx';
import game from './game.json';

// Чтобы TypeScript понимал JSON
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

const typedGame: Game = game as Game;

function App() {
  return (
    <div style={{ padding: '20px' }}>
      <ChessViewer game={typedGame} />
    </div>
  );
}

export default App;
