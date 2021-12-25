const fs = require('fs');
const path = require("path");


fs.readFile(path.resolve(__dirname, './input'), 'utf8', (err, data) => {
  if (err) return console.error(err);

  const positions = data.trim().split(',').map(position => parseInt(position, 10)).sort((a, b) => a - b);

  let median;
  if (positions.length % 2) {
    const middle = Math.floor(positions.length / 2);
    median = positions[middle];
  } else {
    const middle = positions.length / 2;
    median = (positions[middle - 1] + positions[middle]) / 2;
  }

  let fuel = 0;
  for (const position of positions) {
    fuel += Math.abs(position - median);
  }

  console.log(`The cheapest possible outcome is ${fuel} fuel (position ${median})`);

  return
});
