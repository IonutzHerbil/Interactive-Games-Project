package com.example.interactivegames.model;

import java.util.HashSet;
import java.util.Random;
import java.util.Set;

public class Minesweeper {
    private final int height;
    private final int width;
    private final boolean[][] board;
    private final Set<Cell> mines = new HashSet<>();

    public Minesweeper(int height, int width, int numMines) {
        this.height = height;
        this.width = width;
        this.board = new boolean[height][width];

        Random random = new Random();
        while (mines.size() < numMines) {
            int i = random.nextInt(height);
            int j = random.nextInt(width);
            if (!board[i][j]) {
                board[i][j] = true;
                mines.add(new Cell(i, j));
            }
        }
    }

    public boolean isMine(Cell cell) {
        return board[cell.row][cell.col];
    }

    public int countNearbyMines(Cell cell) {
        int count = 0;
        for (int i = cell.row - 1; i <= cell.row + 1; i++) {
            for (int j = cell.col - 1; j <= cell.col + 1; j++) {
                if (i >= 0 && i < height && j >= 0 && j < width && board[i][j]) {
                    count++;
                }
            }
        }
        return count;
    }

    public Set<Cell> getMines() {
        return mines;
    }

    public int getHeight() {
        return height;
    }

    public int getWidth() {
        return width;
    }

    public void printBoard() {
        System.out.println("Board:");
        for (int i = 0; i < height; i++) {
            for (int j = 0; j < width; j++) {
                if (board[i][j]) {
                    System.out.print("(M) ");
                } else {
                    System.out.print("(" + i + "," + j + ") ");
                }
            }
            System.out.println();
        }
    }

}
