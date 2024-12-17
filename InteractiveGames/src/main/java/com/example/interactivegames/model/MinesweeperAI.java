package com.example.interactivegames.model;

import java.util.*;

public class MinesweeperAI {
    private final int height;
    private final int width;
    private final Set<Cell> movesMade = new HashSet<>();
    private final Set<Cell> mines = new HashSet<>();
    private final Set<Cell> safes = new HashSet<>();
    private final List<Sentence> knowledge = new ArrayList<>();

    public MinesweeperAI(int height, int width) {
        this.height = height;
        this.width = width;
    }

    public void markMine(Cell cell) {
        mines.add(cell);
        for (Sentence sentence : knowledge) {
            sentence.markMine(cell);
        }
    }

    public void markSafe(Cell cell) {
        safes.add(cell);
        for (Sentence sentence : knowledge) {
            sentence.markSafe(cell);
        }
    }

    public void addKnowledge(Cell cell, int count) {
        movesMade.add(cell);
        markSafe(cell);

        Set<Cell> neighbors = new HashSet<>();
        for (int i = cell.row - 1; i <= cell.row + 1; i++) {
            for (int j = cell.col - 1; j <= cell.col + 1; j++) {
                if (i >= 0 && i < height && j >= 0 && j < width && !(i == cell.row && j == cell.col)) {
                    Cell neighbor = new Cell(i, j);
                    if (!safes.contains(neighbor) && !mines.contains(neighbor)) {
                        neighbors.add(neighbor);
                    }
                }
            }
        }

        knowledge.add(new Sentence(neighbors, count));

        updateKnowledge();
    }

    private void updateKnowledge() {
        Set<Cell> newSafes = new HashSet<>();
        Set<Cell> newMines = new HashSet<>();

        for (Sentence sentence : knowledge) {
            newSafes.addAll(sentence.knownSafes());
            newMines.addAll(sentence.knownMines());
        }

        for (Cell safe : newSafes) {
            markSafe(safe);
        }
        for (Cell mine : newMines) {
            markMine(mine);
        }
    }

    public Cell makeSafeMove() {
        for (Cell cell : safes) {
            if (!movesMade.contains(cell)) {
                return cell;
            }
        }
        return null;
    }

    public Cell makeRandomMove() {
        Random random = new Random();
        List<Cell> choices = new ArrayList<>();

        for (int i = 0; i < height; i++) {
            for (int j = 0; j < width; j++) {
                Cell cell = new Cell(i, j);
                if (!movesMade.contains(cell) && !mines.contains(cell)) {
                    choices.add(cell);
                }
            }
        }

        if (choices.isEmpty()) {
            return null;
        }
        return choices.get(random.nextInt(choices.size()));
    }
}
