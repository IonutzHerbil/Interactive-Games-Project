package com.example.interactivegames.controllers;

import com.example.interactivegames.model.GameResponse;
import com.example.interactivegames.service.TicTacToeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/tictactoe")
public class TicTacToeController {

    private final TicTacToeService ticTacToeService;

    @Autowired
    public TicTacToeController(TicTacToeService ticTacToeService) {
        this.ticTacToeService = ticTacToeService;
    }

    @PostMapping("/start")
    public GameResponse startGame(@RequestParam char playerSymbol) {
        char[][] board = ticTacToeService.getGameLogic().initialBoard();
        char computerSymbol = (playerSymbol == 'X') ? 'O' : 'X';

        if (playerSymbol == 'O') {
            int[] bestMove = ticTacToeService.findBestMove(board, computerSymbol);
            if (bestMove[0] != -1 && bestMove[1] != -1) {
                board[bestMove[0]][bestMove[1]] = computerSymbol;
            }
        }

        GameResponse response = new GameResponse(board, "Game started");
        System.out.println("Start Game Response: " + response);
        return response;
    }

    @PostMapping("/move")
    public GameResponse getNextMove(@RequestParam char playerSymbol, @RequestBody char[][] board) {
        char computerSymbol = (playerSymbol == 'X') ? 'O' : 'X';

        if (ticTacToeService.getGameLogic().isTerminal(board)) {
            char winner = ticTacToeService.getGameLogic().getWinner(board);
            GameResponse response = new GameResponse(board, winner == '_' ? "Draw" : "Winner: " + winner);
            System.out.println("Move Response (Terminal): " + response);
            return response;
        }

        int[] bestMove = ticTacToeService.findBestMove(board, computerSymbol);
        if (bestMove[0] != -1 && bestMove[1] != -1) {
            board[bestMove[0]][bestMove[1]] = computerSymbol;
        }

        if (ticTacToeService.getGameLogic().isTerminal(board)) {
            char winner = ticTacToeService.getGameLogic().getWinner(board);
            GameResponse response = new GameResponse(board, winner == '_' ? "Draw" : "Winner: " + winner);
            System.out.println("Move Response (Winner): " + response);
            return response;
        }

        GameResponse response = new GameResponse(board, "Continue");
        System.out.println("Move Response (Continue): " + response);
        return response;
    }

}
