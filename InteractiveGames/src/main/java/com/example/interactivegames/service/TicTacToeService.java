package com.example.interactivegames.service;

import com.example.interactivegames.model.TicTacToe;
import org.springframework.stereotype.Service;

@Service
public class TicTacToeService {

    private final TicTacToe gameLogic = new TicTacToe();

    public TicTacToe getGameLogic() {
        return gameLogic;
    }

    public int[] findBestMove(char[][] board, char computerSymbol) {
        int bestValue = Integer.MIN_VALUE;
        int[] bestMove = {-1, -1};
        char playerSymbol = (computerSymbol == 'X') ? 'O' : 'X';

        for (int row = 0; row < 3; row++) {
            for (int col = 0; col < 3; col++) {
                if (board[row][col] == '_') {
                    board[row][col] = computerSymbol;
                    int moveValue = minimax(board, false, computerSymbol, playerSymbol);
                    board[row][col] = '_';
                    if (moveValue > bestValue) {
                        bestMove[0] = row;
                        bestMove[1] = col;
                        bestValue = moveValue;
                    }
                }
            }
        }
        return bestMove;
    }

    private int minimax(char[][] board, boolean isMaximizing, char computerSymbol, char playerSymbol) {
        if (gameLogic.isTerminal(board)) {
            return evaluate(board, computerSymbol, playerSymbol);
        }

        if (isMaximizing) {
            int best = Integer.MIN_VALUE;
            for (int row = 0; row < 3; row++) {
                for (int col = 0; col < 3; col++) {
                    if (board[row][col] == '_') {
                        board[row][col] = computerSymbol;
                        best = Math.max(best, minimax(board, false, computerSymbol, playerSymbol));
                        board[row][col] = '_';
                    }
                }
            }
            return best;
        } else {
            int best = Integer.MAX_VALUE;
            for (int row = 0; row < 3; row++) {
                for (int col = 0; col < 3; col++) {
                    if (board[row][col] == '_') {
                        board[row][col] = playerSymbol;
                        best = Math.min(best, minimax(board, true, computerSymbol, playerSymbol));
                        board[row][col] = '_';
                    }
                }
            }
            return best;
        }
    }

    private int evaluate(char[][] board, char computerSymbol, char playerSymbol) {
        char winner = gameLogic.getWinner(board);
        if (winner == computerSymbol) return 10;
        if (winner == playerSymbol) return -10;
        return 0;
    }

}
