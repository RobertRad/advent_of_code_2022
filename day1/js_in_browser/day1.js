function calc() {
    const inputElement = document.getElementById('day1input');
    const outputElement = document.getElementById('day1output');
    const result = elvesCalories(inputElement.value);
    outputElement.innerHTML = result;
}

function elvesCalories(inputValue) {
    const elvesCalories = inputValue.split('\n').reduce((acc, curr) => {
        if (curr) {
            acc[acc.length-1] += parseInt(curr);
        } else {
            acc.push(0);
        }
        return acc;
    }, [0]);
    const part1 = Math.max(...elvesCalories);
    [a, b, c] = elvesCalories.sort((a, b) => b - a);
    return `Part1: ${part1}\nPart2: ${a + b + c}`;
}
