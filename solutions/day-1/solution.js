import fs from 'fs/promises';

//form digit mappings and word index
const digits = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
const digitMap = {};
const wordIndex = {}
digits.forEach((digit, index) => digitMap[digit] = index + 1);

export default async function () {
    //read input data
    const inputData = (await fs.readFile('./solutions/day-1/input.txt', 'UTF-8')).split('\n');

    //initialise output string
    let outputString = '';

    const result = inputData.reduce((sum, currentString) => {
        //find first and last digits and their indices
        let parsedString = currentString.split('').map(val => parseInt(val));
        let filterNumbers = number => !isNaN(number);

        let firstDigit = (parsedString.find(filterNumbers))?.toString();
        let firstDigitIndex = parsedString.findIndex(filterNumbers);
        let lastDigit = (parsedString?.findLast(filterNumbers))?.toString();
        let lastDigitIndex = parsedString?.findLastIndex(filterNumbers);

        //find first and last words and their indices
        let sortWordIndices = () => Object.values(wordIndex).sort((a, b) => a - b).filter(val => val !== -1);

        //calculate word indices from left to right
        digits.forEach(digit => wordIndex[digit] = currentString.indexOf(digit));
        let firstWordIndex = sortWordIndices().at() ?? 9999;
        let firstWord = Object.keys(wordIndex).find(key => wordIndex[key] === firstWordIndex);

        //calculate word indices from right to left
        digits.forEach(digit => wordIndex[digit] = currentString.lastIndexOf(digit));
        let lastWordIndex = sortWordIndices().at(-1) ?? -1;
        let lastWord = Object.keys(wordIndex).find(key => wordIndex[key] === lastWordIndex);

        //find preferred first and last digit
        let firstConsideredDigit = (firstDigitIndex !== -1 && firstDigitIndex < firstWordIndex ? firstDigit : digitMap[firstWord]).toString();
        let lastConsideredDigit = (lastDigitIndex !== -1 && lastDigitIndex > lastWordIndex ? lastDigit : digitMap[lastWord]).toString();

        //find sum, add to output string
        sum += parseInt(firstConsideredDigit + lastConsideredDigit);
        outputString += `${currentString} : ${firstConsideredDigit + lastConsideredDigit}\n`;

        return sum;
    }, 0);

    //write output to file
    outputString += `\n---\nSum: ${result}`;
    await fs.writeFile('./solutions/day-1/output.txt', outputString, 'UTF-8');

    //return result
    return result;
}
