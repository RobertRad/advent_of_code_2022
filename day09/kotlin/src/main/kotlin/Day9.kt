import kotlin.math.abs

fun main() {
    val content = getResource("input.txt")
    val puzzle = parse(content)
    println("puzzle: $puzzle")
    println("Part1: ${part1(puzzle)}")
    println("Part2: ${part2(puzzle)}")
}

fun getResource(fileName: String): String {
    val content = Field::class.java.getResource(fileName)!!.readText(Charsets.UTF_8)
    return content.replace("\r\n", "\n")
}

fun parse(input: String): List<Pair<Direction, Int>> {
    val regex = """(?<direction>[URDL]) (?<steps>\d+)""".toRegex()
    return input.lines().mapNotNull { line ->
        if (line.isBlank()) {
            null
        } else {
            val match = regex.matchEntire(line) ?: throw IllegalArgumentException("Cannot parse line: $line")
            val direction = match.groups["direction"] ?: throw Exception()
            val steps = match.groups["steps"] ?: throw Exception()
            Direction.getByCode(direction.value) to steps.value.toInt()
        }
    }
}

fun part1(input: List<Pair<Direction, Int>>) = solve(input, 1)

fun part2(input: List<Pair<Direction, Int>>) = solve(input, 9)

fun solve(input: List<Pair<Direction, Int>>, knots: Int): Int {
    require(knots >= 1)
    var headField = Field(0, 0)
    val fields = mutableListOf<Field>()
    for (i in 0..<knots) {
        fields.add(Field(0, 0))
    }
    val visitedFields: MutableSet<Field> = mutableSetOf(fields[knots - 1])
    input.forEach { line ->
        val direction = line.first
        val steps = line.second
        for (step in 1..steps) {
            headField = headField.move(direction)
            for (index in 0..<knots) {
                val predecessor = if (index == 0) headField else fields[index - 1]
                val field = fields[index]
                if (!predecessor.nextToEachOther(field)) {
                    fields[index] = predecessor.pullOther(field)
                }
            }
            visitedFields.add(fields[knots - 1])
        }
    }
    return visitedFields.size
}

data class Field(val x: Int, val y: Int) {
    fun move(direction: Direction): Field {
        return when (direction) {
            Direction.UP -> Field(x, y - 1)
            Direction.RIGHT -> Field(x + 1, y)
            Direction.DOWN -> Field(x, y + 1)
            Direction.LEFT -> Field(x - 1, y)
        }
    }

    fun nextToEachOther(other: Field) = nextToEachOtherOnXAxis(other) && nextToEachOtherOnYAxis(other)
    private fun nextToEachOtherOnXAxis(other: Field) = abs(other.x - x) <= 1
    private fun nextToEachOtherOnYAxis(other: Field) = abs(other.y - y) <= 1

    fun pullOther(other: Field): Field {
        val newX = if (x == other.x) other.x else (if (x > other.x) other.x + 1 else other.x - 1)
        val newY = if (y == other.y) other.y else (if (y > other.y) other.y + 1 else other.y - 1)
        return Field(newX, newY)
    }
}

enum class Direction(val code: String) {
    UP("U"),
    RIGHT("R"),
    DOWN("D"),
    LEFT("L");

    companion object {
        fun getByCode(code: String): Direction {
            return Direction.values().find { it.code == code }
                ?: throw java.lang.IllegalArgumentException("Unknown code: $code")
        }

    }
}
