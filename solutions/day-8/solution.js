import fs from 'fs/promises';

function getLCM (numbers) {
    const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));
    const lcm = (a, b) => (a * b) / gcd(a, b);
    return numbers.reduce((accumulator, currentValue) => lcm(accumulator, currentValue));
};

export default async function () {
    //read input data
    const inputData = (await fs.readFile('./solutions/day-8/input.txt', 'UTF-8')).split('\n');

    //initialise result
    let result = 0;

    //initialise path key and additional variables
    const pathKey = inputData[0];
    const nodeInfo = {};
    let currentNodes = [];

    //extract network info
    inputData.slice(2).forEach((line) => {
        let matches = line.match(/([0-9A-Z]+) = .([0-9A-Z]+), ([0-9A-Z]+)/);
        if (matches[1].endsWith('A')) currentNodes.push(matches[1]);
        nodeInfo[matches[1]] = { L: matches[2], R: matches[3] };
    });

    //traverse and find number of steps
    const paths = pathKey.split('');
    result = getLCM(currentNodes.map(currentNode => {
        let steps = 0;
        while (!currentNode.endsWith('Z')) {
            for (let i = 0; i < paths.length; i++) {
                currentNode = nodeInfo[currentNode][paths[i]];
                steps++;
                if (currentNode.endsWith('Z')) break;
            }
        }
        return steps;
    }));

    //return result
    return result;
}
