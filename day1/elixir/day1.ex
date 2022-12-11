case File.read("./input.txt") do
  {:ok, content} ->
    content
    |> String.split("\n")
    |> Enum.reduce([0], fn (curr, acc) ->
      if (String.length(curr) > 0) do
        sum_before = Enum.at(acc, length(acc) - 1)
        {parsed_value, _binary} = Integer.parse(curr)
        List.replace_at(acc, length(acc) - 1, sum_before + parsed_value)
      else
        List.insert_at(acc, -1, 0)
      end
    end)
    |> Enum.max()
    |> IO.puts
  {:error, reason} -> IO.puts("Could not read file " <> Atom.to_string(reason))
end
