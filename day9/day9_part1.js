const fs = require('fs');
const path = require("path");


fs.readFile(path.resolve(__dirname, './input'), 'utf8', (err, data) => {
  if (err) return console.error(err);

  const heightmap = data.trim().split('\n').map(line => line.split('').map(height => parseInt(height, 10)));
  const lowPoints = [];

  for (let i = 0; i < heightmap.length; i++) {
    const line = heightmap[i];
    for (let j = 0; j < line.length; j++) {
      const height = line[j]; // At point (j, i)

      if (height === 9) continue;
      
      // Check adjacent locations
      const left = line[j - 1];
      if ((left || left === 0) && left <= height) continue;

      const right = line[j + 1];
      if ((right || right === 0) && right <= height) continue;

      const up = heightmap[i - 1]?.[j];
      if ((up || up === 0) && up <= height) continue;

      const down = heightmap[i + 1]?.[j];
      if ((down || down === 0) && down <= height) continue;

      lowPoints.push(height);
    }
  }

  const riskLevelSum = lowPoints.reduce((previousValue, currentValue) => previousValue + currentValue) + lowPoints.length;

  console.log(`The sum of the risk levels of all low points in the heightmap is ${riskLevelSum}`)

  return
});
