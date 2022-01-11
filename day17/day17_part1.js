const fs = require('fs');
const path = require("path");


/**
 * I've made an assumption that the target area is within IV quadrant (x has positive values, y has negative values)
 * Requires tweaking if it's not the case
 */
fs.readFile(path.resolve(__dirname, './input'), 'utf8', (err, data) => {
  if (err) return console.error(err);

  const line = data.trim().split(': ').pop();
  const [ xRange, yRange ] = line.split(', ').map(expr => expr.slice(2).split('..').map(num => parseInt(num, 10)));

  let highestY = 0;
  
  const simulateProbeLaunch = (xVelocity, yVelocity) => {
    let x = 0;
    let y = 0;
    let currentHighestY = 0;

    while (true) {
      x += xVelocity;
      y += yVelocity;
      if (!yVelocity) currentHighestY = y;

      if (x >= xRange[0] && x <= xRange[1] && y >= yRange[0] && y <= yRange[1]) { // The probe appears to be within the target area
        if (currentHighestY > highestY) highestY = currentHighestY;
        break;
      } else if (x > xRange[1] || y < yRange[0]) { // Assume xRange > 0 and yRange < 0
        break;                                     // Stop the loop because the probe will never be within the target area after this point
      }

      if (xVelocity) xVelocity--;
      yVelocity--;
    }
  }

  let xVelocity = 1;                              // Assume xRange > 0
  while (xVelocity <= xRange[1]) {                // Otherwise the probe would be outside of xRange after 1st step
    let yVelocity = Math.abs(yRange[0]);          // Otherwise the probe will return to y = 0 with yVelocity > yRange[0] and will miss yRange
    while (yVelocity) {                           // No need for negative yVelocity since we are looking for highest y position. Assume y > 0
      simulateProbeLaunch(xVelocity, yVelocity);
      yVelocity--;
    }
    xVelocity++;
  }

  console.log(`The highest y position is ${highestY}`);

  return
});
