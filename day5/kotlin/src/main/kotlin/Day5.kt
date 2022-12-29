fun main() {
    val content = getResource("input.txt")
    val puzzle = parse(content)
    println("puzzle: $puzzle")
    println("Part1: ${puzzle.part1()}")
    println("Part1: ${puzzle.part2()}")
}

fun getResource(fileName: String): String {
    val content = Puzzle::class.java.getResource(fileName)!!.readText(Charsets.UTF_8)
    return content.replace("\r\n", "\n")
}