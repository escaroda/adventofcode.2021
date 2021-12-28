const fs = require('fs');
const path = require("path");


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

  let amountOfOctopuses = 0;
  const energyLevels = data.trim().split('\n').map(line => line.split('').map(energyLevel => { amountOfOctopuses += 1; return parseInt(energyLevel, 10) }));
  const adjacentStack = [];
  
  const processEnergyLevel = (i, j) => {
    if (energyLevels[i][j] !== 9) {
      energyLevels[i][j] += 1;
    } else {
      energyLevels[i][j] = 0;
      adjacentStack.push(...getAdjacentPoints(i, j));
    }
  }

  let amountOfFlashes = 0;
  let step = 0;
  while (amountOfFlashes !== amountOfOctopuses) {
    step++;

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
    amountOfFlashes = 0;
    for (let i = 0; i < energyLevels.length; i++) {
      for (let j = 0; j < energyLevels[i].length; j++) {
        if (energyLevels[i][j] === 0) amountOfFlashes += 1;
      }
    }
  }

  console.log(`The first step during which all octopuses flash is ${step}`)

  return
});
