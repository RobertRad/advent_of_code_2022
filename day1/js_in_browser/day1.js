function calc() {
    const inputElement = document.getElementById('day1input');
    const outputElement = document.getElementById('day1output');
    const result = elvesCalories(inputElement.value);
    outputElement.innerHTML = result;
}

function elvesCalories(inputValue) {
    const imperativeResult = imperativeApproach(inputValue);
    const reducerResult = reducerApproach(inputValue);
    if (imperativeResult != reducerResult) {
        return `[Error] imperativeResult: ${imperativeResult} != reducerResult: ${reducerResult}`;
    }
    return imperativeResult;
}

function imperativeApproach(inputValue) {
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

function reducerApproach(inputValue) {
    const elvesCalories = inputValue.split('\n').reduce((acc, curr) => {
        if (curr) {
            acc[acc.length-1] += parseInt(curr);
        } else {
            acc.push(0);
        }
        return acc;
    }, [0]);
    return Math.max(...elvesCalories);
}
