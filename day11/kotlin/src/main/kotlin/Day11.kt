fun main() {
    val content = getResource("input.txt")
    val puzzle = parse(content)
    println("puzzle: $puzzle")
    println("Part1: ${part1(puzzle)}")
//    println("Part2: ${part2(puzzle)}")
}

fun getResource(fileName: String): String {
    val content = Monkey::class.java.getResource(fileName)!!.readText(Charsets.UTF_8)
    return content.replace("\r\n", "\n")
}

fun parse(input: String): List<Monkey> {
    val monkeyDefinitions = input.split("""\r?\n\r?\n""".toRegex())

    fun matchOrThrow(input: String, regex: String, errorMessagePrefix: String): List<String> {
        val match = regex.toRegex().matchEntire(input)
            ?: throw IllegalArgumentException("$errorMessagePrefix: '$input' did not match on '$regex'")
        return match.groupValues
    }
    return monkeyDefinitions.map { monkeyDefinition ->
        val definition = monkeyDefinition.lines()
        val number = matchOrThrow(definition[0], """Monkey (\d+):""", "")[1].toInt()
        val startingItems = definition[1].substring("  Starting items: ".length).split(", ").map { it.toInt() }
        val operationMatch = matchOrThrow(definition[2], """  Operation: new = (old|\d+) (\+|\*) (old|\d+)""", "")

        fun operation(old: Int): Int {
            val operand1 = if (operationMatch[1] == "old") old else operationMatch[1].toInt()
            val operand2 = if (operationMatch[3] == "old") old else operationMatch[3].toInt()
            return when (operationMatch[2]) {
                "+" -> operand1 + operand2
                "*" -> operand1 * operand2
                else -> throw IllegalArgumentException("Unknown operand: ${operationMatch[2]}")
            }
        }

        val operationDescOperand = when (operationMatch[2]) {
            "+" -> "increases by"
            "*" -> "is multiplied by"
            else -> throw IllegalArgumentException("Unknown operand: ${operationMatch[2]}")
        }
        val operationDescValue = if (operationMatch[3] == "old") "itself" else operationMatch[3]
        val operationDesc = "$operationDescOperand $operationDescValue"
        val divisibleBy = definition[3].substring("  Test: divisible by ".length).toInt()
        val ifTrue = definition[4].substring("    If true: throw to monkey ".length).toInt()
        val ifFalse = definition[5].substring("    If false: throw to monkey ".length).toInt()

        Monkey(number, startingItems.toMutableList(), ::operation, operationDesc, divisibleBy, ifTrue, ifFalse)
    }
}

fun part1(monkeys: List<Monkey>): Int {
    for (round in 1..20) {
        fun debugPrintln(msg: String) = if (round == 1) println(msg) else {}
        monkeys.forEachIndexed() { currentMonkeyIndex, monkey ->
            debugPrintln("Monkey ${monkey.number}:")
            monkey.items.forEach { item ->
                debugPrintln("  Monkey inspects an item with a worry level of ${item}.")
                val worryAfterInspection = monkey.operation.invoke(item)
                debugPrintln("    Worry level ${monkey.operationDesc} to $worryAfterInspection.")
                val worryAfterRelief = worryAfterInspection / 3
                debugPrintln("    Monkey gets bored with item. Worry level is divided by 3 to $worryAfterRelief.")
                val division = worryAfterRelief.toDouble().div(monkey.divisibleBy)
                val testResult = division % 1 == 0.0
                debugPrintln("    Current worry level is ${if (testResult) "" else "not"} divisible by ${monkey.divisibleBy}")
                val nextMonkeyIndex = if (testResult) monkey.targetMonkeyIfTrue else monkey.targetMonkeyIfFalse
                debugPrintln("    Item with worry level $worryAfterRelief is thrown to monkey $nextMonkeyIndex.")
                if (currentMonkeyIndex == nextMonkeyIndex) {
                    throw IllegalStateException("Cannot throw item to one self")
                }
                monkeys[nextMonkeyIndex].items.add(worryAfterRelief)
            }
            monkey.numberOfInspections += monkey.items.size
            monkey.items.clear()
        }
        println("After round $round, the monkeys are holding items with these worry levels:")
        monkeys.forEach() { println(it) }
    }
    monkeys.forEach { monkey ->
        println("Monkey ${monkey.number} inspected items ${monkey.numberOfInspections} times.")
    }
    val mostActiveMonkeys = monkeys.sortedByDescending { it.numberOfInspections }.subList(0, 2)
    println("mostActiveMonkeys: " + mostActiveMonkeys.map { "Monkey ${it.number}" })
    return mostActiveMonkeys[0].numberOfInspections * mostActiveMonkeys[1].numberOfInspections
}

class Monkey(
    val number: Int,
    val items: MutableList<Int>,
    val operation: (Int) -> Int,
    val operationDesc: String,
    val divisibleBy: Int,
    val targetMonkeyIfTrue: Int,
    val targetMonkeyIfFalse: Int,
) {

    var numberOfInspections = 0

    override fun toString(): String {
        return "Monkey $number: ${items.joinToString()}"
    }
}
