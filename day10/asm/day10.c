#include <regex.h>
#include <stdio.h>
#include <stdlib.h>
#include <stdint.h>
#include <string.h>

int read_file(int64_t instructions[], int maxInstructionsSize) {
    regex_t noop_regex;
    regex_t addx_regex;
    int reti;
    reti = regcomp(&noop_regex, "^noop", 0);
    if (reti) {
        fprintf(stderr, "Could not compile regex\n");
        exit(1);
    }
    reti = regcomp(&addx_regex, "^addx (-?[0-9]+)", REG_EXTENDED);
    if (reti) {
        fprintf(stderr, "Could not compile regex\n");
        exit(1);
    }

    FILE *fptr = fopen("../input.txt", "r");
    if(fptr == NULL) {
        fprintf(stderr, "File not found\n");
        exit(1);
    }
    const int MAX_CHAR_BUF_SIZE = 20;
    char buf[MAX_CHAR_BUF_SIZE];

    int instruction_index = 0;
    size_t nmatch = 2;
    regmatch_t match[nmatch];
    while(fgets(buf, MAX_CHAR_BUF_SIZE, fptr)) {
        if (instruction_index == maxInstructionsSize) {
            fprintf(stderr, "Number of lines exceeded max size: %d\n", maxInstructionsSize);
            exit(1);
        }
        reti = regexec(&noop_regex, buf, 0, NULL, 0);
        if (!reti) {
            instructions[instruction_index++] = 0;
        } else if (reti != REG_NOMATCH) {
            fprintf(stderr, "Regex match failed\n");
            exit(1);
        } else {
            reti = regexec(&addx_regex, buf, nmatch, match, 0);
            if (!reti) {
                char *result;
                result = (char*)malloc(match[1].rm_eo - match[1].rm_so);
                strncpy(result, &buf[match[1].rm_so], match[1].rm_eo - match[1].rm_so);
                int x = atoi(result);
                instructions[instruction_index++] = x;
                free(result);
            } else if (reti != REG_NOMATCH) {
                fprintf(stderr, "Regex match failed\n");
                exit(1);
            } else {
                fprintf(stderr, "Could not parse line: %s\n", buf);
                exit(1);
            }
        }
    }
    fclose(fptr);
    return instruction_index;
}

void calculate(int64_t instructions[], int32_t num_instructions) {
    int64_t res;
    int64_t cycles;
    // rax = Used for div as dividend (implicitely by instruction) and for mul as factor (each lower 64bits)
    // rbx = cycle counter
    // ecx = memory index
    // rdx = Used for div as dividend (implicitely by instruction) and for mul as factor (each upper 64bits)
    // r8 = For divisor and other arithmetic
    // r9 = holds the current instruction
    // r11 = X in 1 cycle
    // r12 = X in 2 cycles
    asm (
        // init
        "mov %0, 0;"
        "mov rbx, 0;"
        "mov ecx, 0;"
        "mov r11, 1;"
        "mov r12, 1;"
        "loop:"
        // Move the X register one cycle forward
        "mov r9, [%3];"
        "mov r11, r12;"
        "add r12, r9;"
        // move instruction pointer forward by 8 bytes
        "addq %3, 8;"
        // Add cycles - 2 if addx, 1 if noop
        "inc rbx;"
        "call check_cycle;"
        "cmp r9, 0;"
        "je noop_instruction;"
        "inc rbx;"
        "call check_cycle;"
        "noop_instruction:"
        // end of loop
        // for (xxx, xxx, ecx++)
        "inc ecx;"
        // for (xxx, ecx < size, xxx)
        "cmp ecx, %2;"
        "jne loop;"
        "mov %1, rbx;"
        "jmp end;"
        // check_cycle function
        "check_cycle:"
        // divide rbx by 40
        "xor rdx, rdx;"
        "mov rax, rbx;"
        "mov r8, 40;"
        "div r8;"
        // Check if remainder is 20
        "cmp rdx, 20;"
        "jne signal_strength_not_relevant;"
        // signal_strength = rbx * r11
        "xor rdx, rdx;"
        "mov rax, rbx;"
        "imul r11;"
        // sum += rbx * r11
        "add %0, rax;"
        "signal_strength_not_relevant:"
        "ret;"
        // end of check_cycle function
        "end:"
        : "+r" (res), "+r" (cycles)
        : "r" (num_instructions), "r" (instructions)
        : "rax", "rbx", "ecx", "rdx", "r8", "r9", "r11", "r12");
    printf("res: %d, cycles: %d\n", res, cycles);
}

int main() {
    const int MAX_INSTRUCTION_SIZE = 1000;
    int64_t instructions[MAX_INSTRUCTION_SIZE];
    int num_instructions = read_file(instructions, MAX_INSTRUCTION_SIZE);
    calculate(instructions, num_instructions);
}
