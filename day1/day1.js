function calc() {
    const inputElement = document.getElementById('day1input');
    const outputElement = document.getElementById('day1output');
    const result = elvesCalories(inputElement.value);
    outputElement.innerHTML = result;
}

function elvesCalories(inputValue) {
    let maxCalories = 0;
    let currentCalories = 0;
    inputValue.split('\n').forEach(line => {
        if (line) {
            currentCalories += parseInt(line);
        } else {
            currentCalories = 0;
        }
        maxCalories = Math.max(maxCalories, currentCalories)
    });

    return maxCalories;
}
