// App.js
import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import "./App.css";

import Minesweeper from "./pages/Minesweeper";
import TicTacToe from "./pages/TicTacToe";
import MemoryMatrix from "./pages/MemoryMatrix";

function App() {
  return (
    <div className="app-container">
      <Navbar />
      <div className="container">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <h1>Welcome to GameZone! 🎮</h1>
                <p>
                  Dive into a world of fun and challenge with our
                  interactive games designed to entertain and test your
                  skills.
                </p>
                <ul>
                  <li>
                    <strong>Tic Tac Toe:</strong> The classic strategy game
                    – simple to learn, but can you master it? 🧠
                  </li>
                  <li>
                    <strong>Memory Matrix:</strong> Train your memory and
                    concentration with this thrilling challenge! 🧩
                  </li>
                  <li>
                    <strong>Minesweeper:</strong> Navigate through a
                    minefield – one wrong move, and it’s game over! 💣
                  </li>
                  <li>
                    <strong>Maths Game:</strong> Test you arithmetic skills and tackle the toughest challenges!📚
                  </li>
                </ul>
              </>
            }
          />
          <Route path="/TicTacToe" element={<TicTacToe />} />
          <Route path="/Minesweeper" element={<Minesweeper />} />
          <Route path="/MemoryMatrix" element={<MemoryMatrix />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;
