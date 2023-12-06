import fs from 'fs/promises';

function toNumberArray (arrayString) {
    return arrayString.split(' ').map(seed => parseInt(seed));
};

export default async function () {
    //read input data, prepare map store
    const alamanc = (await fs.readFile('./solutions/day-5/input.txt', 'UTF-8'));
    const mapStore = {};

    //update mappings
    function updateMap (category, listing) {
        let numbers = toNumberArray(listing);
        let destinationStart = numbers[0];
        let sourceStart = numbers[1];
        let rangeLength = numbers[2];
        let rangeKey = sourceStart.toString() + '-' + (sourceStart + rangeLength - 1).toString()
        let map = {};
        map[rangeKey] = destinationStart;

        mapStore[category] = {...mapStore[category], ...map};
    };

    //extract listings
    function extractListings (listings) {
        return listings[1].split('\n').reduce((filteredListings, listing) => {
            if (listing.length) filteredListings.push(listing);
            return filteredListings;
        }, []);
    };

    //extract ranges
    function findRanges(keyString) {
        return keyString.split('-').map(key => parseInt(key));
    };

    //figure location from ranges
    function findLocation (seed) {
        let location = seed;
        [
            'seed-to-soil',
            'soil-to-fertilizer',
            'fertilizer-to-water',
            'water-to-light',
            'light-to-temperature',
            'temperature-to-humidity',
            'humidity-to-location'
        ].forEach(category => {
            let rangeKey = Object.keys(mapStore[category]).find(keyString => {
                let ranges = findRanges(keyString);
                return location >= ranges[0] && location <= ranges[1];
            });

            if (rangeKey) {
                let ranges = findRanges(rangeKey);
                let offset = location - ranges[0];
                location = mapStore[category][rangeKey] + offset;
            }
        });

        return location;
    };

    //initialise result and card count map
    let result;

    //fetch seeds and form maps
    let seeds = toNumberArray(alamanc.match(/seeds: (\d+\s+.*)/)[1]);

    //form category mappings
    [
        'seed-to-soil',
        'soil-to-fertilizer',
        'fertilizer-to-water',
        'water-to-light',
        'light-to-temperature',
        'temperature-to-humidity',
        'humidity-to-location'
    ].forEach(category => {
        let categoryListings = alamanc.match(new RegExp(`${category} map:\n((\\d*\\s*)*)\n*`));
        extractListings(categoryListings).forEach(listing => updateMap(category, listing));
    });

    function findLowestLocation (seed) {
        let currentSeedLocation = findLocation(seed)
        result = result || currentSeedLocation;
        result = currentSeedLocation < result ? currentSeedLocation : result;
    }

    //find location
    mapStore['seed-to-location'] = {};
    seeds.forEach((seed, index) => {
        if (index %2 !== 0) {
            for (let count = 1; count <= seed - 1; count++) {
                findLowestLocation(seeds[index - 1] + count);
            }
        } else findLowestLocation(seed)
    });

    //return result
    return result;
}
