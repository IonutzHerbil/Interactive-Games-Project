package com.example.interactivegames.model;

public class TicTacToe {

    private static final char EMPTY = '_';

    public char[][] initialBoard() {
        return new char[][]{
                {EMPTY, EMPTY, EMPTY},
                {EMPTY, EMPTY, EMPTY},
                {EMPTY, EMPTY, EMPTY}
        };
    }

    public boolean isTerminal(char[][] board) {
        return getWinner(board) != EMPTY || isBoardFull(board);
    }

    public char getWinner(char[][] board) {
        for (int i = 0; i < 3; i++) {
            if (board[i][0] == board[i][1] && board[i][1] == board[i][2] && board[i][0] != EMPTY)
                return board[i][0];
            if (board[0][i] == board[1][i] && board[1][i] == board[2][i] && board[0][i] != EMPTY)
                return board[0][i];
        }
        if (board[0][0] == board[1][1] && board[1][1] == board[2][2] && board[0][0] != EMPTY)
            return board[0][0];
        if (board[0][2] == board[1][1] && board[1][1] == board[2][0] && board[0][2] != EMPTY)
            return board[0][2];
        return EMPTY;
    }

    public boolean isBoardFull(char[][] board) {
        for (char[] row : board) {
            for (char cell : row) {
                if (cell == EMPTY) return false;
            }
        }
        return true;
    }
}
