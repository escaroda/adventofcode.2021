const fs = require('fs');
const path = require("path");


const easyDigitsLengths = [2, 3, 4, 7] // Unique amount of segments in 1, 4, 7, or 8

fs.readFile(path.resolve(__dirname, './input'), 'utf8', (err, data) => {
  if (err) return console.error(err);

  const entries = data.trim().split('\n').map(line => line.split(' | ').map(digits => digits.split(' ')));

  let easyDigitsCount = 0;
  for (const entry of entries) {
    const outputValue = entry[1];
    for (const digit of outputValue) {
      if (~easyDigitsLengths.indexOf(digit.length)) easyDigitsCount++
    }
  }

  console.log(`There are ${easyDigitsCount} instances of digits (1, 4, 7, or 8) that use a unique number of segments`)

  return
});
