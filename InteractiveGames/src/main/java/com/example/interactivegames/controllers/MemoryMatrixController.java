package com.example.interactivegames.controllers;

import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@RestController
@RequestMapping("/api")
public class MemoryMatrixController {

    private List<Integer> currentPattern = new ArrayList<>();
    private int gridSize;

    public boolean exists(int x)
    {
        for(int i=0;i<currentPattern.size();i++)
            if(x==currentPattern.get(i))
                return true;
        return false;
    }

    // Endpoint to generate the pattern
    @GetMapping("/pattern")
    public PatternResponse generatePattern(@RequestParam int level) {
        Random rand = new Random();
        currentPattern.clear();
        gridSize = (level/3) +3; // Increase grid size with level
        int totalSquares = gridSize * gridSize;
        int patternSize =gridSize+ (level%3); // Add more pattern points for higher levels

        while (currentPattern.size() < patternSize) {
            int x = rand.nextInt(totalSquares);
            if (!exists(x)) {
                currentPattern.add(x);
            }
        }
        return new PatternResponse(currentPattern, gridSize);
    }

    // Endpoint to check the user input against the pattern
    @PostMapping("/check-input")
    public GameResponse checkInput(@RequestBody UserInput userInput) {
        boolean isCorrect = currentPattern.equals(userInput.getUserInput());
        return new GameResponse(isCorrect);
    }

    // Class to hold the user input in a POST request
    public static class UserInput {
        private List<Integer> userInput;

        public List<Integer> getUserInput() {
            return userInput;
        }

        public void setUserInput(List<Integer> userInput) {
            this.userInput = userInput;
        }
    }

    // Class to send the response with the result of the game check (correct/incorrect)
    public static class GameResponse {
        private boolean isCorrect;

        public GameResponse(boolean isCorrect) {
            this.isCorrect = isCorrect;
        }

        public boolean isCorrect() {
            return isCorrect;
        }

        public void setCorrect(boolean correct) {
            isCorrect = correct;
        }
    }

    // Class to send the pattern as a JSON response
    public static class PatternResponse {
        private List<Integer> pattern;
        private int gridSize;
        public PatternResponse(List<Integer> pattern, int gridSize) {
            this.pattern = pattern;
            this.gridSize = gridSize;
        }

        public List<Integer> getPattern() {
            return pattern;
        }

        public void setPattern(List<Integer> pattern) {
            this.pattern = pattern;
        }

        public int getGridSize() {
            return gridSize;
        }
        public void setGridSize(int gridSize) {
            this.gridSize = gridSize;
        }
    }
}
