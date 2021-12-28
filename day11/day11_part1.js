const fs = require('fs');
const path = require("path");


const NUMBER_OF_STEPS = 100;
const getAdjacentPoints = (a, b) => [
  [a - 1, b - 1],
  [a    , b - 1], 
  [a + 1, b - 1],
  [a - 1, b    ], 
  [a + 1, b    ],
  [a - 1, b + 1],
  [a    , b + 1],
  [a + 1, b + 1],
];

fs.readFile(path.resolve(__dirname, './input'), 'utf8', (err, data) => {
  if (err) return console.error(err);

  const energyLevels = data.trim().split('\n').map(line => line.split('').map(energyLevel => parseInt(energyLevel, 10)));
  const adjacentStack = [];

  const processEnergyLevel = (i, j) => {
    if (energyLevels[i][j] !== 9) {
      energyLevels[i][j] += 1;
    } else {
      energyLevels[i][j] = 0;
      adjacentStack.push(...getAdjacentPoints(i, j));
    }
  }

  let flashCount = 0;
  let stepsLeft = NUMBER_OF_STEPS;
  while (stepsLeft) {

    // Find initial flashes
    for (let i = 0; i < energyLevels.length; i++) {
      for (let j = 0; j < energyLevels[i].length; j++) {
        processEnergyLevel(i, j);
      }
    }

    // Find adjacent flashes
    while (adjacentStack.length) {
      const [i, j] = adjacentStack.pop();
      if (!energyLevels[i]?.[j]) continue;               // Not exist or already flashed (energyLevel === 0)
      processEnergyLevel(i, j);
    }

    // Count all flashed octopuses
    for (let i = 0; i < energyLevels.length; i++) {
      for (let j = 0; j < energyLevels[i].length; j++) {
        if (energyLevels[i][j] === 0) flashCount += 1;
      }
    }

    stepsLeft--;
  }

  console.log(`There are ${flashCount} total flashes after ${NUMBER_OF_STEPS} steps`)

  return
});
