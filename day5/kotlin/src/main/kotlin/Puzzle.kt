import java.util.LinkedList
import kotlin.IllegalArgumentException

class Puzzle(private val stacks: List<Stack>, private val instructions: List<Instruction>) {
    override fun toString(): String {
        return "stacks: {$stacks}, instructions: {$instructions}"
    }

    fun part1(): String {
        val writableStacks = stacks.map {
            LinkedList(it.crates)
        }

        instructions.forEach {
            for (i in 1..it.number) {
                val toMove = writableStacks[it.from - 1].removeLast()
                writableStacks[it.to - 1].add(toMove)
            }
            println("processed $it: $writableStacks")
        }
        return writableStacks.joinToString("") { it.last.name }
    }

    fun part2(): String {
        val writableStacks = stacks.map {
            LinkedList(it.crates)
        }

        instructions.forEach {
            val buffer = ArrayList<Crate>()
            for (i in 1..it.number) {
                buffer.add(writableStacks[it.from - 1].removeLast())
            }
            writableStacks[it.to - 1].addAll(buffer.reversed())
            println("processed $it: $writableStacks")
        }
        return writableStacks.joinToString("") { it.last.name }
    }
}

fun parse(input: String): Puzzle {
    val (stackString, instructionString) = input.split("\n\n")

    val transposedStacks = stackString.split('\n')
        .filter { it.isNotEmpty() }
        .filter { !it.startsWith(" 1 ") }
        .map {
            val letters = ArrayList<String?>()
            val regex = Regex("(\\[(?<letter>[A-Z])\\]|(   )) ?")
            var startIndex = 0
            do {
                val occurrence = regex.find(it, startIndex)
                if (occurrence != null) {
                    startIndex = occurrence.range.last + 1
                    letters.add(occurrence.groups["letter"]?.value)
                }
            } while (occurrence != null)
            letters
        }
        .reversed()

    val rawStacks = ArrayList<MutableList<Crate>>()
    transposedStacks.forEach {
        it.forEachIndexed { index, letter ->
            if (rawStacks.size <= index) {
                rawStacks.add(ArrayList())
            }
            if (letter != null) {
                rawStacks[index].add(Crate(letter))
            }
        }
    }
    val stacks = rawStacks.map { Stack(it) }

    val instructions = instructionString.split('\n')
        .filter { it.isNotEmpty() }
        .map { Instruction.parse(it) }
        .toList()

    return Puzzle(stacks, instructions)
}



class Stack(val crates: List<Crate>) {
    override fun toString(): String {
        return crates.joinToString(", ", "(", ")")
    }
}

class Crate(val name: String) {
    override fun toString(): String {
        return name
    }
}

class Instruction(val from: Int, val to: Int, val number: Int) {
    companion object {
        fun parse(input: String): Instruction {
            val regex = Regex("move (?<number>\\d+) from (?<from>\\d+) to (?<to>\\d+)")
            val matchResult = regex.find(input) ?: throw IllegalArgumentException("Cannot parse: $input")
            val from = matchResult.groups["from"] ?: throw IllegalArgumentException()
            val to = matchResult.groups["to"] ?: throw IllegalArgumentException()
            val number = matchResult.groups["number"] ?: throw IllegalArgumentException()
            return Instruction(from.value.toInt(), to.value.toInt(), number.value.toInt())
        }
    }

    override fun toString(): String {
        return "(${number}x $from->$to)"
    }
}
