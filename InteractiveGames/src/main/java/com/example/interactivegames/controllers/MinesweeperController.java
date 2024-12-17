package com.example.interactivegames.controllers;

import com.example.interactivegames.model.Cell;
import com.example.interactivegames.model.Minesweeper;
import com.example.interactivegames.model.MinesweeperAI;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/minesweeper")
public class MinesweeperController {

    private Minesweeper game;
    private MinesweeperAI ai;

    @PostMapping("/start")
    public Map<String, Object> startGame(@RequestBody Map<String, Integer> params) {
        if (params.get("height") == null || params.get("width") == null || params.get("mines") == null) {
            return Map.of("status", "Error", "message", "Missing required parameters.");
        }

        int height = params.get("height");
        int width = params.get("width");
        int mines = params.get("mines");

        game = new Minesweeper(height, width, mines);
        ai = new MinesweeperAI(height, width);

        game.printBoard();

        return Map.of(
                "status", "Game Started",
                "height", height,
                "width", width,
                "mines", mines
        );
    }

    @PostMapping("/reveal")
    public Map<String, Object> reveal(@RequestBody Map<String, Integer> params) {
        if (game == null) {
            return Map.of("status", "Error", "message", "Game not started.");
        }

        int x = params.getOrDefault("x", -1);
        int y = params.getOrDefault("y", -1);

        if (x < 0 || y < 0 || x >= game.getHeight() || y >= game.getWidth()) {
            return Map.of("status", "Error", "message", "Invalid cell coordinates.");
        }

        Cell cell = new Cell(x, y);

        if (game.isMine(cell)) {
            return Map.of("status", "Mine", "cell", Map.of("x", x, "y", y));
        }

        int nearbyMines = game.countNearbyMines(cell);

        // Notify the AI about the revealed cell
        ai.markSafe(cell);
        ai.addKnowledge(cell, nearbyMines);

        return Map.of(
                "status", "Safe",
                "nearbyMines", nearbyMines,
                "cell", Map.of("x", x, "y", y)
        );
    }

    @GetMapping("/ai/help")
    public Map<String, Object> helpMove() {
        if (ai == null || game == null) {
            return Map.of("status", "Error", "message", "Game not started.");
        }

        Cell move = ai.makeSafeMove();
        boolean isSafeMove = true;

        if (move == null) {
            move = ai.makeRandomMove();
            isSafeMove = false; // If no safe moves, fallback to random
        }

        if (move != null) {
            int x = move.row;
            int y = move.col;

            // If the cell is a mine, skip and warn
            if (game.isMine(move)) {
                ai.markMine(move); // Mark the move as a mine
                return Map.of(
                        "status", "Mine",
                        "cell", Map.of("x", x, "y", y),
                        "message", "AI selected a mine. Move skipped."
                );
            }

            int nearbyMines = game.countNearbyMines(move);
            ai.addKnowledge(move, nearbyMines); // Add new knowledge to the AI

            return Map.of(
                    "status", "Move",
                    "cell", Map.of("x", x, "y", y),
                    "nearbyMines", nearbyMines,
                    "moveType", isSafeMove ? "Safe" : "Random"
            );
        }

        return Map.of("status", "NoMovesLeft", "message", "No available moves.");
    }
}
