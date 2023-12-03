import fs from 'fs/promises';

function isNumber (character) {
    return !isNaN(parseInt(character));
};

function isSymbol (character) {
    return character !== '.' && !isNumber(character);
};

export default async function () {
    //read input data
    const inputData = (await fs.readFile('./solutions/day-3/input.txt', 'UTF-8')).split('\n');

    //initialise schematic and result
    const schematic = [];
    let result = 0;

    //fetch part number
    function fetchPartNumber (lineIndex, symbolIndex) {
        let number = schematic[lineIndex][symbolIndex];
        let start;
        let end;

        if (isNumber(number)) {
            const scanDirection = (direction) => {
                let index = symbolIndex + direction;
                while (isNumber(schematic[lineIndex][index])) {
                    number = direction === 1 ? number + schematic[lineIndex][index] : schematic[lineIndex][index] + number;
                    index += direction;
                }
                return index -= direction;
            };

            start = scanDirection(-1); // Scan left
            end = scanDirection(1); // Scan right
        }

        return {
            number: parseInt(number),
            lineIndex,
            start,
            end
        };
    }

    //record distinct part number
    const partNumbers = [];
    function recordPartNumbers (lineIndex, symbolIndex, symbol) {
        [
            fetchPartNumber(lineIndex, symbolIndex - 1),         //left
            fetchPartNumber(lineIndex, symbolIndex + 1),         //right
            fetchPartNumber(lineIndex - 1, symbolIndex),         //top
            fetchPartNumber(lineIndex + 1, symbolIndex),         //bottom
            fetchPartNumber(lineIndex - 1, symbolIndex - 1),     //top-left
            fetchPartNumber(lineIndex - 1, symbolIndex + 1),     //top-right
            fetchPartNumber(lineIndex + 1, symbolIndex - 1),     //bottom-left
            fetchPartNumber(lineIndex + 1, symbolIndex + 1)      //bottom-right
        ].forEach(partNumberInfo => {
            if (
                isNumber(partNumberInfo.number) &&
                !partNumbers.find(
                    numberInfo =>
                    numberInfo.lineIndex === partNumberInfo.lineIndex &&
                    numberInfo.start === partNumberInfo.start &&
                    numberInfo.end === partNumberInfo.end
                )
            ) {
                partNumbers.push({ symbol, symbolIndex, symbolLineIndex: lineIndex, ...partNumberInfo });
            }
        })
    };

    //read schematic
    inputData.forEach(schemeLine => schematic.push(schemeLine.split('')));
    schematic.forEach((schemeLine, lineIndex) => {
        schemeLine.forEach((character, characterIndex) => {
            if (isSymbol(character)) {
                recordPartNumbers(lineIndex, characterIndex, character)
            }
        });
    });

    const gearInfo = partNumbers
        .filter(partNumberInfo => partNumberInfo.symbol === '*')
        .reduce((gearInfo, partNumberInfo) => {
            let gearId = `${partNumberInfo.symbolIndex} | ${partNumberInfo.symbolLineIndex}`;
            if (!gearInfo[gearId]) {
                gearInfo[gearId] = {
                    gearCount: 1,
                    gearRatio: partNumberInfo.number
                };
            } else {
                gearInfo[gearId].gearCount++;
                gearInfo[gearId].gearRatio *= partNumberInfo.number;
            }

            return gearInfo;
        }, {});

    // //Part 1 - sum of part numbers
    // result = partNumbers.reduce((sum, numberInfo) => sum += numberInfo.number, 0);

    //Part 2 - sum of gear ratios
    result = Object.values(gearInfo).reduce((sum, gear) => {
        if (gear.gearCount === 2) sum += gear.gearRatio;
        return sum;
    }, 0);

    //return result
    return result;
}
