import fs from 'fs/promises';

function toNumbers (arrayString) {
    return arrayString.split(' ').map(seed => +seed).filter(Number);
};

export default async function () {
    //read input data
    const inputSheet = (await fs.readFile('./solutions/day-6/input.txt', 'UTF-8')).split('\n');

    //initialise result
    let result = 0;

    //parse time and distance
    let timeData = toNumbers(inputSheet[0].match(/Time:\s+([\d\s]+)/)[0]);
    let distanceData = toNumbers(inputSheet[1].match(/Distance:\s+([\d\s]+)/)[0]);

    //start with the middle element and work your way till the distance is not beaten
    result = timeData.reduce((result, availableTime, index) => {
        const distanceToBeat = distanceData[index];
        const isEvenTime = availableTime % 2 !== 0;
        const middle = Math.ceil(availableTime / 2);
        let numberOfOptions = 0;

        for (let i = middle, j = isEvenTime ? middle - 1 : middle; i <= availableTime; i++, j--) {
            numberOfOptions = i * j > distanceToBeat ? numberOfOptions + 1 : numberOfOptions * 2;
            if (i * j <= distanceToBeat) break;
        }

        numberOfOptions = !isEvenTime ? numberOfOptions - 1 : numberOfOptions;
        result *= numberOfOptions;
        return result;
    }, 1);

    //return result
    return result;
}
