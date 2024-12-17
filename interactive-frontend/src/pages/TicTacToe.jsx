import React, { useState } from "react";
import "../styles/TicTacToe.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function TicTacToe() {
  const [board, setBoard] = useState(null);
  const [playerSymbol, setPlayerSymbol] = useState(null);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [isVsComputer, setIsVsComputer] = useState(null);
  const [currentSymbol, setCurrentSymbol] = useState("X");

  const transformBoard = (board) => board.map((row) => row.split(""));

  const startGame = (symbol, mode) => {
    setIsVsComputer(mode);
    setPlayerSymbol(symbol);

    if (mode) {
      fetch(`http://localhost:8080/api/tictactoe/start?playerSymbol=${symbol}`, {
        method: "POST",
      })
        .then((res) => res.json())
        .then((data) => {
          setBoard(transformBoard(data.board));
          if (symbol === "O") setIsPlayerTurn(true);
        })
        .catch((error) => console.error("Error starting the game:", error));
    } else {
      setBoard([
        ["_", "_", "_"],
        ["_", "_", "_"],
        ["_", "_", "_"],
      ]);
    }
  };

  const handleCellClick = (row, col) => {
    if (!board || board[row][col] !== "_") return;

    if (isVsComputer) {
      if (!isPlayerTurn) return;

      const updatedBoard = board.map((rowArr, rowIndex) =>
        rowArr.map((tictaccell, colIndex) =>
          rowIndex === row && colIndex === col ? playerSymbol : tictaccell
        )
      );

      setBoard(updatedBoard);
      setIsPlayerTurn(false);

      fetch(
        `http://localhost:8080/api/tictactoe/move?playerSymbol=${playerSymbol}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedBoard),
        }
      )
        .then((res) => res.json())
        .then((data) => {
          setBoard(transformBoard(data.board));
          if (data.status !== "Continue") {
            setTimeout(() => {
              alert(data.status);
            }, 300);
          } else {
            setIsPlayerTurn(true);
          }
        })
        .catch((error) => console.error("Error making a move:", error));
    } else {
      const updatedBoard = board.map((rowArr, rowIndex) =>
        rowArr.map((tictaccell, colIndex) =>
          rowIndex === row && colIndex === col ? currentSymbol : tictaccell
        )
      );

      setBoard(updatedBoard);
      const winner = checkWinner(updatedBoard);

      if (winner) {
        setTimeout(() => {
          alert(winner === "_" ? "It's a draw!" : `Winner: ${winner}`);
        }, 300);
      } else {
        setCurrentSymbol(currentSymbol === "X" ? "O" : "X");
      }
    }
  };

  const checkWinner = (board) => {
    const lines = [
      ...board,
      [board[0][0], board[1][0], board[2][0]],
      [board[0][1], board[1][1], board[2][1]],
      [board[0][2], board[1][2], board[2][2]],
      [board[0][0], board[1][1], board[2][2]],
      [board[0][2], board[1][1], board[2][0]],
    ];

    for (const line of lines) {
      if (line.every((tictaccell) => tictaccell === "X")) return "X";
      if (line.every((tictaccell) => tictaccell === "O")) return "O";
    }

    return board.flat().includes("_") ? null : "_";
  };

  if (isVsComputer === null) {
    return (
      <div>
        <Navbar />
        <div className="tictactoe">
          <h1>Choose Your Game Mode</h1>
          <div className="mode-buttons">
            <button onClick={() => startGame("X", true)}>Play vs Computer (X)</button>
            <button onClick={() => startGame("O", true)}>Play vs Computer (O)</button>
            <button onClick={() => startGame("X", false)}>Two-Player Mode</button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!board) {
    return (
      <div>
        <Navbar />
        <div className="tictactoe">
          <h1>Loading...</h1>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="tictactoe">
        <h1>{isVsComputer ? "Tic Tac Toe (vs Computer)" : "Tic Tac Toe (Two Players)"}</h1>
        <div className="tictacboard">
          {board.map((row, rowIndex) =>
            row.map((tictaccell, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`tictaccell ${tictaccell}`}
                onClick={() => handleCellClick(rowIndex, colIndex)}
              >
                {tictaccell !== "_" ? tictaccell : ""}
              </div>
            ))
          )}
        </div>
        {!isVsComputer && <p>Current Turn: {currentSymbol}</p>}
        <button onClick={() => window.location.reload()}>Restart</button>
      </div>
      <Footer />
    </div>
  );
}

export default TicTacToe;
