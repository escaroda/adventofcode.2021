const fs = require('fs');
const path = require("path");


getAdjacentPoints = (i, j) => [[i - 1, j], [i, j + 1], [i + 1, j], [i, j - 1]]; // Up, Right, Down, Left

fs.readFile(path.resolve(__dirname, './input'), 'utf8', (err, data) => {
  if (err) return console.error(err);

  const riskLevels = data.trim().split('\n').map(line => line.split('').map(riskLevel => parseInt(riskLevel, 10)));

  const pointsToVisit = [{ totalRisk: 0, coordinates: [0, 0] }]; // Start with top left point
  const lowestRisk = [[0]]; // Total lowest risk of any path from the top left to each point
  
  while (pointsToVisit.length) {
    const currentPoint = pointsToVisit.pop();

    const adjacentPoints = getAdjacentPoints(...currentPoint.coordinates);

    for (const coordinates of adjacentPoints) {
      const [i, j] = coordinates;
      const riskLevel = riskLevels[i]?.[j];
      if (riskLevel) {
        const totalRisk = riskLevel + currentPoint.totalRisk;
        const lowestTotalRisk = lowestRisk[i]?.[j];
        if (!lowestTotalRisk || lowestTotalRisk > totalRisk) {
          pointsToVisit.push({ totalRisk, coordinates });
          if (!lowestRisk[i]) lowestRisk[i] = [];
          lowestRisk[i][j] = totalRisk;
        }
      }
    }
  }
  
  const lastLine = lowestRisk[lowestRisk.length - 1];
  const lowestTotalRisk = lastLine[lastLine.length - 1];

  console.log(`The lowest total risk of any path from the top left to the bottom right is ${lowestTotalRisk}`);

  return
});
