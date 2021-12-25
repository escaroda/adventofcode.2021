const fs = require('fs');
const path = require("path");


/**
 * This is optimized version since the cheapest fuel outcome should gravitate toward mean value.
 * Require tweaking depending on input data.
 */
const PRECISION_SPAN = 4;

fs.readFile(path.resolve(__dirname, './input'), 'utf8', (err, data) => {
  if (err) return console.error(err);

  const positions = data.trim().split(',').map(position => parseInt(position, 10)).sort((a, b) => a - b);

  let sum = 0;
  for (position of positions) {
    sum += position;
  }
  const mean = Math.round(sum / positions.length);

  let cheapestFuelOutcome = Number.MAX_SAFE_INTEGER;
  let cheapestFuelPosition = 0;
  for (let i = mean - PRECISION_SPAN; i < mean + PRECISION_SPAN; i++) { // Brute force only around mean
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
