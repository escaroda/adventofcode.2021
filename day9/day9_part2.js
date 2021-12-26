const fs = require('fs');
const path = require("path");


const MULTIPLY_TOGETHER = 3;

const isLessOrEqual = (a, b) => (a || a === 0) && a <= b;
const getAdjacentPoints = (a, b) => [[a, b - 1], [a, b + 1], [a - 1, b], [a + 1, b]];

fs.readFile(path.resolve(__dirname, './input'), 'utf8', (err, data) => {
  if (err) return console.error(err);

  const heightmap = data.trim().split('\n').map(line => line.split('').map(height => parseInt(height, 10)));
  const lowPointCoordinates = [];
  const basinSizes = [];

  // Find low points
  for (let i = 0; i < heightmap.length; i++) {
    const line = heightmap[i];
    for (let j = 0; j < line.length; j++) {
      const height = line[j]; // At point (x=j, y=i)

      if (height === 9) continue; // 9 is a max height and can't be a low point

      // Check adjacent points
      const left = line[j - 1];
      if (isLessOrEqual(left, height)) continue;

      const right = line[j + 1];
      if (isLessOrEqual(right, height)) continue;

      const up = heightmap[i - 1]?.[j];
      if (isLessOrEqual(up, height)) continue;

      const down = heightmap[i + 1]?.[j];
      if (isLessOrEqual(down, height)) continue;

      lowPointCoordinates.push([i, j]);
      j++; // skip next point because it can't be lower than this one
    }
  }

  // Calculate basins
  for (const point of lowPointCoordinates) {
    let currentBasinSize = 1;
    const [i, j] = point;
    const lowestHeight = heightmap[i][j];
    const stack = getAdjacentPoints(i, j);

    while (stack.length) {
      const [y, x] = stack.pop();
      const adjacentHeight = heightmap[y]?.[x];

      // Not sure about adjacentHeight === lowestHeight case, but with current input data result is the same
      if (!adjacentHeight || adjacentHeight === 9 || adjacentHeight < lowestHeight) continue;

      // Current point is part of basin -> add adjacent points to stack and prevent further appearance of the current point
      stack.push(...getAdjacentPoints(y, x));
      heightmap[y][x] = null;
      currentBasinSize++;
    }
    basinSizes.push(currentBasinSize);
  }
  basinSizes.sort((a, b) => a - b);

  let largestBasinsMultiplied = 1;
  for (let i = basinSizes.length - MULTIPLY_TOGETHER; i < basinSizes.length; i++) {
    largestBasinsMultiplied *= basinSizes[i];
  }

  console.log(`The size of the ${MULTIPLY_TOGETHER} largest basins multiplied together is ${largestBasinsMultiplied}`)
  
  return
});
