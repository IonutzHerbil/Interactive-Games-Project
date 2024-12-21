import React, { useState, useEffect } from 'react';
import '../styles/MemoryMatrix.css';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Square from './Square'; // Assuming you have a separate Square component

function MemoryMatrix() {
  const [pattern, setPattern] = useState([]);
  const [userInput, setUserInput] = useState([]);
  const [feedback, setFeedback] = useState([]); // Array to hold feedback for each square
  const [isFlashing, setIsFlashing] = useState(true);
  const [currentSquare, setCurrentSquare] = useState(0); 
  const [gameState, setGameState] = useState("Remember the pattern!");
  const [counter,setCounter]=useState(3);
  const [gameLevel, setGameLevel] = useState(1);
  const [gridSize,setGridSize] = useState(4);
  const [totalSquares, setTotalSquares] = useState(16);

  useEffect(() => {
    // Fetch the pattern from the backend
    const fetchPattern = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/pattern?level=${gameLevel}`);
        const data = await response.json();
        console.log('Fetched pattern:', data.pattern);  // Debugging line
        console.log('Fetched gridSize:', data.gridSize); 
        setPattern(data.pattern);
        setGridSize(data.gridSize);
        setTotalSquares(data.gridSize*data.gridSize)
      } catch (error) {
        console.error('Error fetching pattern:', error);
      }
    };
    fetchPattern();
  }, [gameLevel]);
  
  
  const handleSquareClick = async (index) => {
   if (counter>0 || gameState==="You won!") return; // Block user input while pattern is flashing

    // Add user's click to input sequence
    const newInput = [...userInput, index];
    setUserInput(newInput);

    // Check if the current click is part of the pattern
    const newFeedback = [...feedback];
    if (pattern.includes(index)) {
      newFeedback.push('correct'); 
      console.log('correct');// Correct click
    } else {
      newFeedback.push('incorrect'); 
      console.log('incorrect');// Incorrect click
    }
    setFeedback(newFeedback);

    // Send the user's input to the backend to check if it's correct
    if (newInput.length === pattern.length) {
      if (newFeedback.every(feedback => feedback === 'correct')) {
        setGameState("You won!");
      } else {
        setGameState("Incorrect! Try again.");
        setTimeout(() => {
          setUserInput([]); // Reset user input
          setFeedback([]);  // Reset feedback
          setCounter(3);
        }, 1000);   
       
      }
    }
  };


  const renderSquares = () => {
    console.log('Rendering Squares: ', totalSquares);
    return Array.from({ length: totalSquares }, (_, index) => (
      <div
        key={index}
        className={`square ${getSquareClass(index)}`} // Add class based on feedback
        onClick={() => handleSquareClick(index)}
      />
    ));
  };


  const getSquareClass = (index) => {
    if (counter>0 && pattern.includes(index)) return 'flashing';
    const feedbackIndex = userInput.indexOf(index);
    if (feedbackIndex === -1) return ''; // Default class when not clicked
    
    // Determine if the square was clicked correctly or incorrectly
    return feedback[feedbackIndex] === 'correct' ? 'correct' : 'incorrect';
  };

  useEffect(() => {
    if (counter > 0) {
      // Start countdown when game begins
      const interval = setInterval(() => {
        setCounter(prevCounter => prevCounter - 1);
      }, 1000);
      
      // Clear interval once counter reaches 0
      return () => clearInterval(interval);
    }
    else if(counter===0)
      setCounter('GO!');
  }, [counter]);
  
  const startNewGame = () => {
    setCounter(3);
    setUserInput([]);
    setFeedback([]);
    setGameState("Remember the pattern!");
    setGameLevel(gameLevel+1);
    setPattern([]);
  };

  const goToLvl = (level) => {
    if (level > 0) {
      setCounter(3);
      setUserInput([]);
      setFeedback([]);
      setGameState("Remember the pattern!");
      setGameLevel(level); // Update the level
      setPattern([]); // Clear the pattern to fetch the new one
    }
  };


  return (
    <div>
      <Navbar/>
    <div className="game">
      <h1>Memory Pattern Game</h1>
      <div className="level-controls">
        <span>LEVEL: </span>
        <input
          type="number"
          min="1"
          value={gameLevel} // Display the current level
          onChange={(e) => goToLvl(Number(e.target.value))} // Update level dynamically
          className="level-input"
        />
      </div>
      <p>{gameState}</p>
      <div className="countdown">
        {gameState === "You won!" ? (
          <button
            onClick={startNewGame}
            className="next-level"
          >
            Next Level
          </button>
        ) : counter > 0 ? (
          counter
        ) : (
          "GO!"
        )}
      </div>
      <div
        className="grid"
        style={{
          gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
          gridTemplateRows: `repeat(${gridSize}, 1fr)`,
        }}
      >
        {renderSquares()}
      </div>
    </div>
    <Footer/>
    </div>
  );
}

export default MemoryMatrix;
