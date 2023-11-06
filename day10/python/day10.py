import os
import re

x1 = 1
x2 = 1
sum = 0
cycles = 0
crt_lines = []

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
with open(f"{os.path.dirname(__file__)}/../input.txt") as f:
  lines = f.readlines()

instructions = [parse_line(x) for x in lines]
print(f"instructions: {instructions}")

def process_cycle():
  global sum
  if (cycles % 40) == 20:
    print(f"modulo 20: {cycles}, x1: {x1}")
    print(f"[cycle {cycles}] x1: {x1}, x2: {x2}")
    sum += cycles * x1
  pixel_position = (cycles - 1) % 40
  print_pixel = (x1 - 1 == pixel_position) or (x1 == pixel_position) or (x1 + 1 == pixel_position)
  print(f"cycle: {cycles}, pixel_position: {pixel_position}, x1: {x1}, print_pixel: {print_pixel}")
  crt_lines.append(print_pixel)



for inst in instructions:
  x1 = x2
  x2 = x2 + inst
  cycles += 1
  process_cycle()
  if (inst != 0):
    cycles += 1
    process_cycle()
print(f"sum: {sum}")
for index, crt_line in enumerate(crt_lines):
  if (index % 40 == 0):
    print("")
  if (crt_line):
    print("#", end = "")
  else:
    print(".", end = "")
print("")
