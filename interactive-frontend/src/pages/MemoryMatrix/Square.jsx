import React, { useState, useEffect } from 'react';
import './MemoryMatrix.css';
import Square from './Square';

function MemoryMatrix() {
  const [pattern, setPattern] = useState([]);
  const [userInput, setUserInput] = useState([]);
  const [feedback, setFeedback] = useState([]); // Array to hold feedback for each square
  const [isFlashing, setIsFlashing] = useState(true);
  const [currentSquare, setCurrentSquare] = useState(0);
  const [gameState, setGameState] = useState("Remember the pattern!");
  const gridSize = 4;
  const totalSquares = gridSize * gridSize;

  useEffect(() => {
    // Fetch the pattern from the backend
    const fetchPattern = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/pattern');
        const data = await response.json();
        setPattern(data.pattern);
        // Flash the pattern for 5 seconds
        flashPattern(data.pattern);
      } catch (error) {
        console.error('Error fetching pattern:', error);
      }
    };
    fetchPattern();
  }, []);

  const flashPattern = (pattern) => {
    setIsFlashing(true);  // Start flashing
    const flashDuration = 5000; // 5 seconds
    const flashInterval = 1000; // Flash every second

    // Flash squares one by one during the pattern reveal
    const interval = setInterval(() => {
      if (currentSquare < pattern.length) {
        setCurrentSquare(prev => prev + 1);
      } else {
        clearInterval(interval);
        setIsFlashing(false); // End flashing after the pattern is shown
      }
    }, flashInterval);

    // Stop flashing after 5 seconds
    setTimeout(() => {
      clearInterval(interval);
      setIsFlashing(false);
    }, flashDuration);
  };

  const handleSquareClick = async (index) => {
    if (isFlashing) return; // Block user input while pattern is flashing

    // Add user's click to input sequence
    const newInput = [...userInput, index];
    setUserInput(newInput);

    // Check if the current click is part of the pattern
    const newFeedback = [...feedback];
    if (pattern[newInput.length - 1] === index) {
      newFeedback.push('correct'); // Correct click
    } else {
      newFeedback.push('incorrect'); // Incorrect click
    }
    setFeedback(newFeedback);

    // Send the user's input to the backend to check if it's correct
    const response = await fetch('http://localhost:8080/api/check-input', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userInput: newInput })
    });

    const result = await response.json();
    if (result.isCorrect) {
      setGameState("You won! Correct pattern.");
    } else {
      setGameState("Incorrect! Try again.");
      setUserInput([]); // Reset user input on error
      setFeedback([]);   // Reset feedback colors
    }
  };

  const renderSquares = () => {
    return Array.from({ length: totalSquares }, (_, index) => {
      const isFlashed = isFlashing && pattern.includes(index);  // Check if square is in pattern
      const isFlipped = userInput.includes(index) || isFlashed;  // If user clicked or square is flashing
      return (
        <Square
          key={index}
          isFlipped={isFlipped}  // Pass the flipped state to the Square component
          color={getColor(index)} // Pass color based on feedback
          onClick={() => handleSquareClick(index)}
        />
      );
    });
  };

  const getColor = (index) => {
    // Color logic: Blue for the flashing squares, based on feedback
    const feedbackIndex = userInput.indexOf(index);
    if (isFlashing && pattern.includes(index)) {
      return 'blue';  // During flashing, all pattern squares turn blue
    }
    if (feedbackIndex === -1) return 'white';  // Default color when not clicked

    // Return color based on feedback for user input
    return feedback[feedbackIndex] === 'correct' ? 'blue' : 'red';
  };

  return (
    <div className="game">
      <h1>Memory Pattern Game</h1>
      <p>{gameState}</p>
      <div className="grid">
        {renderSquares()}
      </div>
    </div>
  );
}

export default MemoryMatrix;
