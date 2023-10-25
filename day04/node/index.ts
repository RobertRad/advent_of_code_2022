import { readFileSync } from 'fs';

type Range = {
  aStart: number;
  aEnd: number;
  bStart: number;
  bEnd: number;
}

function containsFully(range: Range): boolean {
  return (range.aStart <= range.bStart && range.aEnd >= range.bEnd)
  || (range.bStart <= range.aStart && range.bEnd >= range.aEnd);
}

function containsPartially(range: Range): boolean {
  return (range.aStart <= range.bStart && range.aEnd >= range.bStart)
  || (range.bStart <= range.aStart && range.bEnd >= range.aStart);
}

function specificPart(input: string, containFunc: (range: Range) => boolean) {
  return input.split('\n')
  .filter(line => line.length > 0)
  .map(line => line.split(','))
  .map(arr => [arr[0].split('-'), arr[1].split('-')])
  .map(arr => ({ aStart: parseInt(arr[0][0]), aEnd: parseInt(arr[0][1]), bStart: parseInt(arr[1][0]), bEnd: parseInt(arr[1][1]) }))
  .map(range => containFunc(range) ? 1 : 0)
  .reduce((left, right) => left + right, 0 as number);
}

function part1(input: string) {
  return specificPart(input, containsFully);
}

function part2(input: string) {
  return specificPart(input, containsPartially);
}

const data = readFileSync('input.txt', 'utf8');
console.log(`Part 1: ${part1(data)}`);
console.log(`Part 2: ${part2(data)}`);
