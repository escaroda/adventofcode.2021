const fs = require('fs');
const path = require("path");


fs.readFile(path.resolve(__dirname, './input'), 'utf8', (err, data) => {
  if (err) return console.error(err);

  let [coordinates, foldInstructions] = data.trim().split('\n\n');

  coordinates = coordinates.split('\n').map(dot => dot.split(',').map(value => parseInt(value, 10)));

  foldInstructions = foldInstructions.split('\n').map(line => line.split(' ')[2]).map(fold => { 
    fold = fold.split('='); 
    fold[1] = parseInt(fold[1], 10); 
    return fold 
  });
  
  const paper = [];

  for (const dot of coordinates) {
    const [x, y] = dot;
    if (!paper[y]) paper[y] = [];
    paper[y][x] = 1;
  }

  for (const fold of foldInstructions) {
    const [direction, position] = fold;
    if (direction === 'x') {
      for (let y = 0; y < paper.length; y++) {
        const line = paper[y];
        if (line) {
          let oldX = position * 2;
          let newX = 0;
          while (oldX !== newX) {
            if (line[oldX]) line[newX] = line[oldX];
            newX++;
            oldX--;
          }
          line.length = position; // Dispose folded part
        }
      }
    } else {
      let oldY = position * 2;
      let newY = 0;
      while (oldY !== newY) {
        if (paper[oldY]) {
          for (let x = 0; x < paper[oldY].length; x++) {
            if (paper[oldY][x]) {
              if (!paper[newY]) paper[newY] = [];
              paper[newY][x] = paper[oldY][x];
            }
          }
        }
        newY++;
        oldY--;
      }
      paper.length = position; // Dispose folded part
    }
    break; // We need the first fold only
  }

  let numberOfDots = 0;
  for (const line of paper) {
    if (line) {
      for (const dot of line) {
        if (dot) numberOfDots += 1;
      }
    }
  }

  console.log(`There are ${numberOfDots} dots visible after completing just the first fold instruction`)

  return
});
