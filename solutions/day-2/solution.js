import fs from 'fs/promises';

function parseGameData (gameString) {
    return {
        id: parseInt(gameString.match(/(\d+):/g)[0]?.slice(0, -1)),
        ...parseColorInfo(gameString.split(';'))
    };
}

function parseColorInfo (gameSets) {
    const colorInfo = { red: 0, green: 0, blue: 0 };

    gameSets.forEach(gameSet => {
        gameSet.match(/(\d+ blue)|(\d+ red)|(\d+ green)/g).forEach(colorString => {
            let colorParts = colorString.split(' ');
            let colorValue = parseInt(colorParts[0]);
            let colorName = colorParts[1];

            colorInfo[colorName] = colorValue >= colorInfo[colorName] ? colorValue : colorInfo[colorName];
        });
    });

    return colorInfo;
}

export default async function () {
    //read input data
    const inputData = (await fs.readFile('./solutions/day-2/input.txt', 'UTF-8')).split('\n');

    //initialise output string
    let outputString = '';
    let result = 0;

    //prepare game data
    const gameData = [];
    inputData.forEach(gameString => {
        let parsedGameData = parseGameData(gameString);
        gameData.push(parsedGameData)
        outputString += `${gameString} | red: ${parsedGameData.red}, green: ${parsedGameData.green}, blue: ${parsedGameData.blue}\n`
    });

    // // Part 1 Solution
    // result = gameData
    //     .filter(game => {
    //         return game.red <= 12 && game.green <= 13 && game.blue <= 14
    //     })
    //     .reduce((sum, game) => sum += game.id, 0);

    //Part 2 Solution
    result = gameData.reduce((sum, game) => sum += (game.red * game.green * game.blue), 0);

    //write output to file
    outputString += `\n---\nSum: ${result}`;
    await fs.writeFile('./solutions/day-2/output.txt', outputString, 'UTF-8');

    //return result
    return result;
}
