const fs = require('fs');
const path = require("path");


/**
 * Very simple priority queue that is not recommended for production use
 */
class QueueElement {
  constructor(risk, i, j) {
    this.risk = risk;
    this.i = i;
    this.j = j;
  }
}

class PriorityQueue {
  constructor() {
    this.items = [];
  }

  get length() {
    return this.items.length
  }

  push(risk, i, j) {
    const queueElement = new QueueElement(risk, i, j);
    let hasBeenInserted = false;

    for (let i = 0; i < this.items.length - 1; i++) {
      if (this.items[i].risk > queueElement.risk) {
        this.items.splice(i, 0, queueElement);
        break;
      }
    }

    if (!hasBeenInserted) {
      this.items.push(queueElement);
    }
  }

  pop() {
    return this.items.shift(); // Get the lowest risk element and remove it from queue
  }
}

const FULL_MAP_SIZE_FACTOR = 5;

getAdjacentNodeCoordinates = (i, j) => [[i - 1, j], [i, j + 1], [i + 1, j], [i, j - 1]]; // Up, Right, Down, Left

getOneHigher = (num) => num !== 9 ? num + 1 : 1;


fs.readFile(path.resolve(__dirname, './input'), 'utf8', (err, data) => {
  if (err) return console.error(err);

  const riskLevels = data.trim().split('\n').map(line => line.split('').map(riskLevel => parseInt(riskLevel, 10)));
  
  const shortHeight = riskLevels.length;
  const shortWidth = riskLevels[0].length;

  const height = shortHeight * FULL_MAP_SIZE_FACTOR;
  const width = shortWidth * FULL_MAP_SIZE_FACTOR;

  // Get full map
  let n = shortHeight;
  while (n < height) {
    const higherLine = riskLevels[n - shortHeight].map(getOneHigher);
    riskLevels.push(higherLine);
    n++;
  }
  for (const line of riskLevels) {
    let n = shortWidth;
    while (n < width) {
      line.push(getOneHigher(line[n - shortWidth]))
      n++;
    }
  }

  let lowestTotalRisk = Number.POSITIVE_INFINITY;

  // Initialize priority queue
  const priorityQueue = new PriorityQueue();
  priorityQueue.push(0, 0, 0);

  // Traverse
  while (priorityQueue.length) {
    const { risk, i, j } = priorityQueue.pop(); // Get point with current lowest total risk

    if (!riskLevels[i][j]) continue; // Skip if visited already
    riskLevels[i][j] = null;

    if (i === height - 1 && j === width - 1) { // Finish if at the bottom right corner
      lowestTotalRisk = risk;
      break;
    }

    for (const [ii, jj] of getAdjacentNodeCoordinates(i, j)) {
      if (ii < 0 || jj < 0 || ii >= height || jj >= width) continue; // Skip points that outside of a map
      priorityQueue.push(risk + riskLevels[ii][jj], ii, jj)
    }
  }

  console.log(`The lowest total risk of any path from the top left to the bottom right is ${lowestTotalRisk}`);

  return
});
