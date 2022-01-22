const fs = require('fs');
const path = require("path");


EAST = '>';
SOUTH = 'v';
EMPTY = '.';

const implementMoves = (lines, moves, entity) => {
  for (const [from, to] of moves) {
    const [i, j] = from;
    const [ii, jj] = to;
    lines[i][j] = EMPTY;
    lines[ii][jj] = entity;
  }
}

fs.readFile(path.resolve(__dirname, './input'), 'utf8', (err, data) => {
  if (err) return console.error(err);

  const lines = data.trim().split('\n').map(line => line.split(''));

  let steps = 0;
  let hasBeenMoved = false;
  do {
    steps++;
    hasBeenMoved = false;

    const eastMoves = [];   // [[from], [to]]
    const southMoves = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      for (let j = 0; j < line.length; j++) {
        const point = line[j];

        if (point === EAST) {
          if (lines[i][j + 1]) {
            if (lines[i][j + 1] === EMPTY) eastMoves.push([[i, j], [i, j + 1]]);
          } else {
            if (lines[i][0] === EMPTY) eastMoves.push([[i, j], [i, 0]]); // Move off the right edge of the map appear on the left edge
          }
        }
      }
    }

    if (eastMoves.length) {
      hasBeenMoved = true;
      implementMoves(lines, eastMoves, EAST);
    }

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      for (let j = 0; j < line.length; j++) {
        const point = line[j];

        if (point === SOUTH) {
          if (lines[i + 1]?.[j]) {
            if (lines[i + 1][j] === EMPTY) southMoves.push([[i, j], [i + 1, j]]);
          } else {
            if (lines[0][j] === EMPTY) southMoves.push([[i, j], [0, j]]); // Move off the bottom edge of the map appear on the top edge
          }
        }
      }
    }

    if (southMoves.length) {
      hasBeenMoved = true;
      implementMoves(lines, southMoves, SOUTH); 
    }
  
  } while (hasBeenMoved);

  console.log(`The first step on which no sea cucumbers move is ${steps}`);

  return
});
