import fs from 'fs/promises';

function findStrength (handInfo) {
    const keys = Object.keys(handInfo);
    const values = Object.values(handInfo);
    const jokerCount = handInfo['J'] || 0;
    const noJokerValues = Object.keys(handInfo).filter(key => key !== 'J').map(key => handInfo[key]);

    if (
        //five of a kind
        keys.length === 1 ||
        keys.length === 2 && (
            jokerCount === 1 && noJokerValues.includes(4) ||
            jokerCount === 2 && noJokerValues.includes(3) ||
            jokerCount === 3 && noJokerValues.includes(2) ||
            jokerCount === 4 && noJokerValues.includes(1)
        )
    ) {
        return { strength: 1, handRank: 'FIVE' };
    } else if (
        //four of a kind
        keys.length === 2 && values.includes(4) && values.includes(1) ||
        keys.length === 3 && (
            jokerCount === 1 && noJokerValues.includes(3) ||
            jokerCount === 2 && noJokerValues.includes(2) ||
            jokerCount === 3 && noJokerValues.includes(1)
        )
    ) {
        return { strength: 2, handRank: 'FOUR' };
    } else if (
        //full house
        keys.length === 2 && values.includes(3) && values.includes(2) ||
        keys.length === 3 && (
            jokerCount === 1 && (noJokerValues.includes(3) || noJokerValues.includes(2)) ||
            jokerCount === 2 && noJokerValues.includes(1)
        )
    ) {
        return { strength: 3, handRank: 'FULL' };
    } else if (
        //three of a kind
        keys.length === 3 && values.includes(3) && values.includes(1) ||
        keys.length === 4 && (
            jokerCount === 1 && noJokerValues.includes(2) ||
            jokerCount === 2 && noJokerValues.includes(1)
        )
    ) {
        return { strength: 4, handRank: 'THRE' };
    } else if (
        //two pair
        keys.length === 3 && values.includes(2) && values.includes(1) ||
        keys.length === 4 && (
            jokerCount === 1 && noJokerValues.includes(1)
        )
    ) {
        return { strength: 5, handRank: 'TWOP' };
    } else if (
        //one pair
        keys.length === 4 && values.includes(2) ||
        keys.length === 5 && (
            jokerCount === 1 && noJokerValues.includes(1)
        )
    ) {
        return { strength: 6, handRank: 'ONEP' };
    } else if (
        //high card
        keys.length === 5
    ) {
        return { strength: 7, handRank: 'HIGH' };
    }
}

function findStrongestCard (firstCard, secondCard) {
    const rankOrder = ['J', '2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'];
    for (let i = 0; i < 5; i++) {
        const rank_1 = rankOrder.indexOf(firstCard.cardString.split('')[i]);
        const rank_2 = rankOrder.indexOf(secondCard.cardString.split('')[i]);

        if (rank_1 !== rank_2) {
            return rank_1 > rank_2 ? 1 : -1;
        }
    }
};

export default async function () {
    //read input data
    const inputData = (await fs.readFile('./solutions/day-7/input.txt', 'UTF-8')).split('\n');

    //initialise card store and rank array
    const cardStore = [];

    //initialise result and output string
    let result = 0;
    let outputString = '';

    //parse card info
    inputData.forEach(line => {
        const [cardString, bid] = line.split(' ');
        const cardInfo = { cardString, bid: +bid };
        const cards = cardString.split('');
        const handInfo = {};

        cards.forEach(card => {
            if (!Object.hasOwnProperty(handInfo, card)) {
                handInfo[card] = (cardString.match(new RegExp(card, 'g')) || []).length;
            }
        })

        const strengthInfo = findStrength(handInfo)
        cardInfo.strength = strengthInfo.strength;
        cardInfo.handRank = strengthInfo.handRank;
        cardStore.push(cardInfo);
    });

    //sort by rank and calculate winnings
    result = cardStore.sort((firstCard, secondCard) => {
        if (firstCard.strength === secondCard.strength) {
            return findStrongestCard(firstCard, secondCard);
        }
        return secondCard.strength - firstCard.strength
    }).reduce((sum, cardInfo, index) => {
        cardInfo.rank = ++index;
        sum += cardInfo.bid * cardInfo.rank;
        outputString += `cards: ${cardInfo.cardString} | ${cardInfo.handRank} | rank: ${cardInfo.rank}\n`;
        return sum;
    }, 0);

    //write output to file
    await fs.writeFile('./solutions/day-7/output.txt', outputString, 'UTF-8');

    //return result
    return result;
}
