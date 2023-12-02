async function fetchSolution(currentDay) {
  try {
    return await (await import(`./solutions/day-${currentDay}/solution.js`)).default();
  } catch (err) {
    return '👨🏻‍💻';
  }
}

for (let currentDay = 1; currentDay <= 25; currentDay++) {
  console.log(`Day ${currentDay}: ${await fetchSolution(currentDay)}`);
}
