import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // <-- Make sure this import is present

function TicTacToe() {
  const [player, setPlayer] = useState(null);
  const navigate = useNavigate(); // useNavigate hook to navigate programmatically

  const handlePlayerSelection = (selectedPlayer) => {
    setPlayer(selectedPlayer);
  };

  const renderGrid = () => {
    const grid = [];
    for (let i = 0; i < 9; i++) {
      grid.push(<div className="cell" key={i}></div>);
    }
    return grid;
  };

  return (
    <div className="tictactoe">
      <h1>Tic Tac Toe</h1>
      <div className="player-selection">
        <button onClick={() => handlePlayerSelection('X')}>Player 1: X</button>
        <button onClick={() => handlePlayerSelection('O')}>Player 2: O</button>
      </div>
      {player && <p>Player {player} is selected</p>}
      <div className="grid">{renderGrid()}</div>

      {/* Back Button */}
      <button onClick={() => navigate('/')}>Back to Homepage</button>
    </div>
  );
}

export default TicTacToe;
