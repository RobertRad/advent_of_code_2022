import re

x1 = 1
x2 = 1
sum = 0
cycles = 0

def parse_line(line):
  line = line.rstrip()
  if (re.search("^noop$", line)) != None:
    return 0
  match = re.search("^addx (-?\d+)", line)
  if (match != None):
    return int(match[1])
  else:
    raise f"Cannot parse line: {line}"

lines = ""
with open("../input.txt") as f:
  lines = f.readlines()

instructions = [parse_line(x) for x in lines]
print(f"instructions: {instructions}")

def check_cycle():
  global sum
  if (cycles % 40) == 20:
    print(f"modulo 20: {cycles}, x1: {x1}")
    print(f"[cycle {cycles}] x1: {x1}, x2: {x2}")
    sum += cycles * x1

for inst in instructions:
  x1 = x2
  x2 = x2 + inst
  cycles += 1
  check_cycle()
  if (inst != 0):
    cycles += 1
    check_cycle()
print(f"sum: {sum}")
