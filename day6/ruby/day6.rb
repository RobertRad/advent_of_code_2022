
File.foreach("input.txt") {|line|
    m = line.match(/(\w)((?!\1)\w)((?!\1)(?!\2)\w)((?!\1)(?!\2)(?!\3)\w)/)
    puts "Part 1: #{m.end(0)}"
}

File.foreach("input.txt") {|line|
    length = 14
    for i in 0..(line.length - length)
        snippet = line[i..(i + length - 1)]
        if snippet.split('').uniq.size == length
            result = i + length
            puts "Part 2: #{result}"
            break
        end
    end
}