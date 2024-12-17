//App
import React from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import "./App.css";

function App() {
  return (
    <div className="app-container">
      <Navbar />
      <div className="container">
        <h1>Welcome to GameZone! 🎮</h1>
        <p>
          Dive into a world of fun and challenge with our interactive games
          designed to entertain and test your skills. Whether you're looking to
          sharpen your mind or enjoy a quick break, we've got something for
          everyone:
        </p>
        <ul>
          <li>
            <strong>Tic Tac Toe:</strong> The classic strategy game – simple to
            learn, but can you master it? 🧠
          </li>
          <li>
            <strong>Memory Matrix:</strong> Train your memory and concentration
            with this thrilling challenge! 🧩
          </li>
          <li>
            <strong>Minesweeper:</strong> Navigate through a minefield – one
            wrong move, and it’s game over! 💣
          </li>
          <li>
            <strong>Math Whiz:</strong> Solve puzzles and prove you’re a
            mathematical genius. 🧮
          </li>
        </ul>
        <p>Click on a game and let the fun begin! Are you ready to beat your best score? 🚀</p>
      </div>
      <Footer />
    </div>
  );
}

export default App;