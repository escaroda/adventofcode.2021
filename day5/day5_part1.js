fs = require('fs');


const ensureOrderOfNumbers = (smaller, larger) => {
  if (larger < smaller) {
    const _larger = larger;
    larger = smaller;
    smaller = _larger;
  }
  return [smaller, larger]
}

fs.readFile('input', 'utf8', function (err, data) {
  if (err) {
    return console.log(err);
  }

  const lines = data.trim().split('\n').map(line => line.split(' -> ').map(coordinates => coordinates.split(',')));

  const diagram = []; // diagram[row][column]

  for (const line of lines) {
    let x1 = parseInt(line[0][0], 10);
    let x2 = parseInt(line[1][0], 10);
    let y1 = parseInt(line[0][1], 10);
    let y2 = parseInt(line[1][1], 10);

    if (x1 === x2) { // vertical line
      
      [y1, y2] = ensureOrderOfNumbers(y1, y2); // make sure y2 is always larger

      for (let i = y1; i <= y2; i++) { // merge into diagram at column x1
        if (!diagram[i]) {
          const arr = [];
          arr[x1] = 1;
          diagram[i] = arr;
        } else {
          if (!diagram[i][x1]) {
            diagram[i][x1] = 1
          } else {
            diagram[i][x1] += 1
          }
        };
      }

    } else if (y1 === y2) { // horizontal line

      [x1, x2] = ensureOrderOfNumbers(x1, x2); // make sure x2 is always larger

      if (!diagram[y1]) diagram[y1] = []

      for (let j = x1; j <= x2; j++) { // merge into diagram at row y1
        if (!diagram[y1][j]) {
          diagram[y1][j] = 1;
        } else {
          diagram[y1][j] += 1;
        }
      }
    }
  }

  let points = 0;

  for (const row of diagram) {
    if (row) {
      for (const column of row) {
        if (column && column > 1) points += 1
      }
    }
  }

  console.log('the number of points where at least two lines overlap: ', points);

  return
});
