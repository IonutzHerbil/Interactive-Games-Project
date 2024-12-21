package com.example.interactivegames.model;

import java.util.HashSet;
import java.util.Set;

public class Sentence {
    private Set<Cell> cells;
    private int count;

    public Sentence(Set<Cell> cells, int count) {
        this.cells = new HashSet<>(cells);
        this.count = count;
    }

    public Set<Cell> getCells() {
        return cells;
    }

    public int getCount() {
        return count;
    }

    /**
     * Returns all cells in this sentence known to be mines.
     * If count == size of cells, all are mines.
     */
    public Set<Cell> knownMines() {
        if (count == cells.size()) {
            return new HashSet<>(cells);
        }
        return new HashSet<>();
    }

    /**
     * Returns all cells in this sentence known to be safe.
     * If count == 0, none of these cells are mines, so all are safe.
     */
    public Set<Cell> knownSafes() {
        if (count == 0) {
            return new HashSet<>(cells);
        }
        return new HashSet<>();
    }

    public void markMine(Cell cell) {
        if (cells.contains(cell)) {
            cells.remove(cell);
            count--;
        }
    }

    public void markSafe(Cell cell) {
        cells.remove(cell);
    }

    @Override
    public String toString() {
        return cells + " = " + count;
    }
}
