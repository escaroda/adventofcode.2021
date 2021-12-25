const fs = require('fs');
const path = require("path");


fs.readFile(path.resolve(__dirname, './input'), 'utf8', (err, data) => {
  if (err) return console.error(err);

  const positions = data.trim().split(',').map(position => parseInt(position, 10)).sort((a, b) => a - b);
  const largestPosition = positions[positions.length - 1];

  let cheapestFuelOutcome = Number.MAX_SAFE_INTEGER;
  let cheapestFuelPosition = 0;
  for (let i = 0; i < largestPosition; i++) {
    let currentFuelOutcome = 0
    for (const position of positions) {
      let distance = Math.abs(position - i);
      let stepCost = 1;
      while (distance) {
        currentFuelOutcome += stepCost;
        distance--;
        stepCost++;
      }
    }
    if (currentFuelOutcome < cheapestFuelOutcome) {
      cheapestFuelOutcome = currentFuelOutcome;
      cheapestFuelPosition = i;
    }
  }

  console.log(`The cheapest possible outcome is ${cheapestFuelOutcome} fuel (position ${cheapestFuelPosition})`);

  return
});
