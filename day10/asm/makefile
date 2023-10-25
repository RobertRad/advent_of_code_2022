all: run

run: day10
	./day10

day10: day10.o
	gcc -o day10 day10.o

day10.o: day10.c
	gcc -c day10.c -masm=intel

clean:
	rm -f day10.o day10
