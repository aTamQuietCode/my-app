import { useState } from 'react'
import './App.css'

// リファクタリング
// （currentPlayer: 'X' | 'O'）

// 1. 型の定義
type SquareValue = 'X' | 'O' | null;

interface SquareProps {
  value : SquareValue;
  onSquareClick:() => void;
}

// 2. 1マスをあらわすコンポーネント
function Square ( { value, onSquareClick }: SquareProps) {
  console.log("マスの値:", value);
  return (
    <button className = "square" onClick = { onSquareClick }>
      {value}
    </button>
  );
}

// 3. メインゲーム画面
export default function Board() {
  // 9マス配列
  const [squares, setSquares] = useState<SquareValue[]>(Array(9).fill(null));
  
  // 新しい状態をセット
  const[currentPlayer, setCurrentPlayer] = useState<"X" | "O">("X");

  // 勝者判定
  const winner = calculateWinner(squares);
  // マスがすべて埋まったかチェック(nullがないか)
  const isDraw = !winner && squares.every(square => square != null);
  // メッセージを3パターン分岐
  const status = winner 
    ? `Winner: ${winner}` 
    : isDraw
      ? "Draw（引き分け）" 
      : `Next player: ${currentPlayer}`;

  function handleClick(i:number) {
    // すでに埋まっている or 勝者が決まっている なら何もしない
    if (squares[i] || calculateWinner(squares)) return;

    // 配列のコピーを作る
    const nextSquares = squares.slice();

    // 現在のプレイヤーの文字をそのまま入れる
    nextSquares[i] = currentPlayer;
    setSquares(nextSquares);

    // プレイヤー交代
    setCurrentPlayer(currentPlayer === "X" ? "O" : "X");

    /* 仮に3人以上になった場合
    const players: ('X' | 'O' | 'Z')[] = ['X', 'O', 'Z'];

    function handleClick(i: number) {
      // ...略...
      
      // 現在のプレイヤーが配列の何番目かを探し、次に進める（剰余算 % を使用）
      const currentIndex = players.indexOf(currentPlayer);
      const nextIndex = (currentIndex + 1) % players.length;
      
      setCurrentPlayer(players[nextIndex]);
    */
  }

  function resetGame() {
    setSquares(Array(9).fill(null));
    setCurrentPlayer("X");
  }

  return(
    <div className='board'>
      <p>{`現在の盤面状況 (全 ${squares.length} マス)`}</p>
      <div className='status'>{status}</div>
      <div className='grid-container' style={{display: 'grid', gridTemplateColumns: 'repeat(3, 40px)', gap: '5px'}}>
        {Array.from({length: 9}).map((_, i) => (
          <Square
            key={i}
            value={squares[i]}
            onSquareClick={() => handleClick(i)}
          />
        ))}
      </div>
      <button onClick={resetGame} style={{ marginTop: "10px"}}>
        Play Again
      </button>
    </div>
  )
}

function calculateWinner(squares: SquareValue[]): SquareValue {
  // 勝ちパターン配列
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],  // 横
    [0, 3, 6], [1, 4, 7], [2, 5, 8],  // 縦
    [0, 4, 8], [2, 4, 6]              // 斜め
  ];

  for(const [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];  // X or O
    }
  }
  
  return null;  // 勝者なし
}