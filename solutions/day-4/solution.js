import fs from 'fs/promises';

function extractNumbers (numberString) {
    return numberString.split(' ').reduce((numbers, currentValue) => {
        if (!isNaN(parseInt(currentValue))) numbers.push(parseInt(currentValue));
        return numbers;
    }, []);
}

export default async function () {
    //read input data
    const inputData = (await fs.readFile('./solutions/day-4/input.txt', 'UTF-8')).split('\n');

    //initialise result and card count map
    let result = 0;
    let cardCountMap = {};

    inputData.forEach((scratchCard, index) => {
        //extract winning numbers, in-hand numbers
        let cardMatches = scratchCard.match(/Card\s+\d+: (\d*\s*.*)\| (\d*\s*.+)/);
        let winningNumbers = extractNumbers(cardMatches[1]);
        let numbersInHand = extractNumbers(cardMatches[2]);

        //find points per card
        let matchingCardCount = numbersInHand.reduce((count, currentNumber) => {
            if (winningNumbers.includes(currentNumber)) count++
            return count;
        }, 0);
        let pointsPerCard = matchingCardCount ? Math.pow(2, matchingCardCount - 1) : 0;

        //update current card count
        if (!cardCountMap[index]) cardCountMap[index] = { count: 1 };
        else cardCountMap[index].count++;
        cardCountMap[index].matchingCards = matchingCardCount;

        //update matching card count
        for (let i = index + 1, count = 1; count <= matchingCardCount; i++) {
            if (!cardCountMap[i]) cardCountMap[i] = { count: cardCountMap[index].count };
            else cardCountMap[i].count += cardCountMap[index].count;
            count++;
        }

        //Part 1 - add all card points
        result += pointsPerCard;
    });

    //Part 2 - find the total number of cards
    result = Object.values(cardCountMap).reduce((sum, cardCountInfo) => sum += cardCountInfo.count, 0);

    //return result
    return result;
}
