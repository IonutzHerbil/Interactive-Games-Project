package com.example.interactivegames.model;

import java.util.*;

public class MinesweeperAI {
    private int height;
    private int width;

    private Set<Cell> movesMade = new HashSet<>();
    private Set<Cell> mines = new HashSet<>();
    private Set<Cell> safes = new HashSet<>();
    private List<Sentence> knowledge = new ArrayList<>();

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

    /**
     * Add new knowledge based on a revealed safe cell and the count of nearby mines.
     * This simulates the Python logic:
     * 1) Mark the cell as a move made and safe.
     * 2) Gather all of the cell's unrevealed neighbors that are not already known as safe or mines.
     * 3) Add a new Sentence to knowledge.
     * 4) Update knowledge to infer new safes or mines.
     */
    public void addKnowledge(Cell cell, int count) {
        movesMade.add(cell);
        markSafe(cell);

        // Find neighbors
        Set<Cell> neighbors = new HashSet<>();
        for (int di = -1; di <= 1; di++) {
            for (int dj = -1; dj <= 1; dj++) {
                if (di == 0 && dj == 0) continue;
                int ni = cell.row + di;
                int nj = cell.col + dj;
                if (ni >= 0 && ni < height && nj >= 0 && nj < width) {
                    Cell neighbor = new Cell(ni, nj);
                    if (!safes.contains(neighbor) && !mines.contains(neighbor)) {
                        neighbors.add(neighbor);
                    }
                }
            }
        }

        // Add new sentence
        knowledge.add(new Sentence(neighbors, count));

        // Update knowledge
        updateKnowledge();
    }

    /**
     * Called after new knowledge is added to infer additional safes/mines.
     * Repeatedly apply inference until no new deductions can be made.
     */
    private void updateKnowledge() {
        boolean changed = true;

        while (changed) {
            changed = false;

            Set<Cell> newSafes = new HashSet<>();
            Set<Cell> newMines = new HashSet<>();

            // Identify known safes and mines from all sentences
            for (Sentence sentence : knowledge) {
                newSafes.addAll(sentence.knownSafes());
                newMines.addAll(sentence.knownMines());
            }

            // Mark new safes
            for (Cell safe : newSafes) {
                if (!safes.contains(safe)) {
                    markSafe(safe);
                    changed = true;
                }
            }

            // Mark new mines
            for (Cell mine : newMines) {
                if (!mines.contains(mine)) {
                    markMine(mine);
                    changed = true;
                }
            }

            // Try to derive new sentences from existing ones
            // If Sentence A is a subset of Sentence B:
            // B - A = new sentence with count adjusted
            List<Sentence> newKnowledge = new ArrayList<>();
            for (int i = 0; i < knowledge.size(); i++) {
                for (int j = i + 1; j < knowledge.size(); j++) {
                    Sentence s1 = knowledge.get(i);
                    Sentence s2 = knowledge.get(j);

                    // Check if s1 is subset of s2
                    if (s2.getCells().containsAll(s1.getCells()) && !s2.getCells().equals(s1.getCells())) {
                        Set<Cell> diff = new HashSet<>(s2.getCells());
                        diff.removeAll(s1.getCells());
                        int newCount = s2.getCount() - s1.getCount();
                        Sentence inferred = new Sentence(diff, newCount);

                        if (!knowledge.contains(inferred) && !newKnowledge.contains(inferred)) {
                            newKnowledge.add(inferred);
                            changed = true;
                        }
                    }

                    // Check if s2 is subset of s1
                    if (s1.getCells().containsAll(s2.getCells()) && !s1.getCells().equals(s2.getCells())) {
                        Set<Cell> diff = new HashSet<>(s1.getCells());
                        diff.removeAll(s2.getCells());
                        int newCount = s1.getCount() - s2.getCount();
                        Sentence inferred = new Sentence(diff, newCount);

                        if (!knowledge.contains(inferred) && !newKnowledge.contains(inferred)) {
                            newKnowledge.add(inferred);
                            changed = true;
                        }
                    }
                }
            }

            // Add all new inferred sentences
            knowledge.addAll(newKnowledge);

            // Remove empty or duplicate sentences
            cleanKnowledge();
        }
    }

    /**
     * Removes empty or duplicate sentences from the knowledge base.
     */
    private void cleanKnowledge() {
        // Remove empty sentences
        knowledge.removeIf(sentence -> sentence.getCells().isEmpty());

        // Remove duplicates
        Set<String> seen = new HashSet<>();
        knowledge.removeIf(s -> !seen.add(s.toString()));
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
        List<Cell> choices = new ArrayList<>();
        for (int i = 0; i < height; i++) {
            for (int j = 0; j < width; j++) {
                Cell c = new Cell(i, j);
                if (!movesMade.contains(c) && !mines.contains(c)) {
                    choices.add(c);
                }
            }
        }
        if (!choices.isEmpty()) {
            Random rand = new Random();
            return choices.get(rand.nextInt(choices.size()));
        }
        return null;
    }
}
