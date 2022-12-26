package com.github.robertrad;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;
import java.util.function.Function;
import java.util.stream.Collector;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import java.util.stream.StreamSupport;

public class Main {
    public static void main(String[] args) {
        long sum = readFile("/input.txt").map(line -> {
                int half = line.length() / 2;
                String firstPart = line.substring(0, half);
                String secondPart = line.substring(half);
                for (int i = 0; i < firstPart.length(); i++) {
                    char c = firstPart.charAt(i);
                    if (secondPart.contains(String.valueOf(c))) {
                        return getPriority(c);
                    }
                }
                return 0;
            }).mapToInt(Integer::valueOf)
            .sum();
        System.out.println("day3, part1: " + sum);

        List<TripleChecker> tripleCheckers = readFile("/input.txt").collect(tripleCollector());
        long result = tripleCheckers.stream()
                .map(TripleChecker::getNumber)
                .collect(Collectors.summarizingInt(Integer::valueOf)).getSum();
        System.out.println("day3, part2: " + result);
    }

    public static Collector<String, List<TripleChecker>, List<TripleChecker>> tripleCollector() {
        return Collector.of(
                () -> new ArrayList<>(List.of(new TripleChecker())),
                (acc, line) -> {
                    TripleChecker last = acc.get(acc.size() - 1);
                    if (last.isFull()) {
                        last = new TripleChecker();
                        acc.add(last);
                    }
                    last.addItem(line);
                },
                (left, right) -> {
                    left.addAll(right);
                    return left;
                },
                Function.identity()
        );
    }

    private static class TripleChecker {
        private final List<String> list = new ArrayList<>();

        public boolean isFull() {
            return list.size() >= 3;
        }

        public void addItem(String line) {
            list.add(line);
        }

        public int getNumber() {
            if (!isFull()) {
                throw new IllegalStateException("Must have 3 items");
            }
            String refString = list.get(0);
            for (int i = 0; i < refString.length(); i++) {
                char c = refString.charAt(i);
                String toCheck = String.valueOf(c);
                if (list.get(1).contains(toCheck) && list.get(2).contains(toCheck)) {
                    return getPriority(c);
                }
            }
            throw new IllegalStateException("Could not find value :(");
        }
    }

    public static int getPriority(char c) {
        int base = c >= 'a' && c <= 'z' ? 'a' - 1 : 'A' - 27;
        return c - base;
    }

    public static Stream<String> readFile(String fileName) {
        InputStream inputStream = Main.class.getResourceAsStream(fileName);
        Scanner scanner = new Scanner(inputStream);
        Iterable<String> iterable = () -> scanner;
        return StreamSupport.stream(iterable.spliterator(), false);
    }
}