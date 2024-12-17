import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/Minesweeper.css";

function Minesweeper() {
  const [board, setBoard] = useState([]);
  const [gameStatus, setGameStatus] = useState("Playing");
  const [height, setHeight] = useState(8);
  const [width, setWidth] = useState(8);
  const [mines, setMines] = useState(8);

  // Backend API base URL
  const API_BASE_URL = "http://localhost:8080/api/minesweeper";

  // Initialize the game
  const startGame = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/start`, {
        height,
        width,
        mines,
      });
      setBoard(Array.from({ length: height }, () => Array(width).fill("_")));
      setGameStatus("Playing");
      console.log("Game Initialized:", response.data);
    } catch (error) {
      console.error("Error starting the game:", error);
      alert("Failed to start the game. Please try again.");
    }
  };

  // Reveal a cell
  const revealCell = async (x, y) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/reveal`, { x, y });
      const { status, nearbyMines } = response.data;

      if (status === "Mine") {
        const updatedBoard = [...board];
        updatedBoard[x][y] = "M"; // Represent mines as "M"
        setBoard(updatedBoard);
        setGameStatus("Lost");
        alert("You hit a mine! Game Over.");
      } else if (status === "Safe") {
        const updatedBoard = [...board];
        updatedBoard[x][y] = nearbyMines;
        setBoard(updatedBoard);
      }
    } catch (error) {
      console.error("Error revealing cell:", error);
      alert("Failed to reveal cell. Please try again.");
    }
  };

  // Get AI assistance
  const getAiMove = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/ai/help`);
      console.log("AI Help Response:", response.data);

      if (response.data.status === "Move") {
        const { x, y } = response.data.cell;
        const nearbyMines = response.data.nearbyMines;

        // Update the board with the AI move
        const updatedBoard = [...board];
        updatedBoard[x][y] = nearbyMines; // Show the number of nearby mines
        setBoard(updatedBoard);
      } else if (response.data.status === "NoMovesLeft") {
        alert(response.data.message || "No moves available.");
      } else if (response.data.status === "Mine") {
        alert(response.data.message || "AI selected a mine.");
      } else {
        alert("Unable to get AI assistance.");
      }
    } catch (error) {
      console.error("Error getting AI move:", error);
      alert("Failed to get AI move. Please try again.");
    }
  };

  // Restart the game
  const restartGame = () => {
    setBoard([]);
    setGameStatus("Playing");
    startGame();
  };

  // Start the game on component mount
  useEffect(() => {
    startGame();
  }, []);

  return (
    <div>
      <Navbar />
      <div className="minesweeper">
        <h1>Minesweeper</h1>
        <div className="board">
          {board.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`cell ${cell === "M" ? "mine" : ""}`}
                onClick={() => revealCell(rowIndex, colIndex)}
              >
                {cell !== "_" && cell !== "M" ? cell : cell === "M" ? "💣" : ""}
              </div>
            ))
          )}
        </div>
        <div className="controls">
          <button onClick={getAiMove} disabled={gameStatus === "Lost"}>AI Help</button>
          <button onClick={restartGame}>Restart Game</button>
        </div>
        {gameStatus === "Lost" && <h2>Game Over! You Lost.</h2>}
        {gameStatus === "Playing" && <h2>Game in Progress!</h2>}
      </div>
      <Footer />
    </div>
  );
}

export default Minesweeper;
