const fs = require('fs');
const path = require("path");


fs.readFile(path.resolve(__dirname, './input'), 'utf8', (err, data) => {
  if (err) return console.error(err);

  // Prepare input data
  let [coordinates, foldInstructions] = data.trim().split('\n\n');

  const maxValues = [0, 0]; // Our effective paper area
  coordinates = coordinates.split('\n').map(dot => dot.split(',').map((value, index) => {
    const num = parseInt(value, 10);
    if (num > maxValues[index]) maxValues[index] = num;
    return num;
  }));

  foldInstructions = foldInstructions.split('\n').map(line => line.split(' ')[2]).map(fold => { 
    fold = fold.split('='); 
    fold[1] = parseInt(fold[1], 10); 
    return fold 
  });

  // Create paper
  const paper = [];
  const horizontalLength = maxValues[0] + 1;
  const verticalLength = maxValues[1] + 1;

  for (let i = 0; i < verticalLength; i++) {
    paper[i] = new Array(horizontalLength).fill(0);
  }

  // Draw dots
  for (const dot of coordinates) {
    const [x, y] = dot;
    paper[y][x] = 1;
  }

  // Fold
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
        for (let x = 0; x < paper[oldY].length; x++) {
          if (paper[oldY][x]) paper[newY][x] = paper[oldY][x];
        }
        newY++;
        oldY--;
      }
      paper.length = position;  // Dispose folded part
    }
  }
  
  // Print eight capital letters code
  for (let i = 0; i < paper.length; i++) {
    let line = '';
    for (let j = 0; j < paper[i]?.length; j++) {
      line += paper[i][j] ? '#' : ' ';
    }
    console.log(line);
  }

  return
});
