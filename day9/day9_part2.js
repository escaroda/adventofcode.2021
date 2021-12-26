const fs = require('fs');
const path = require("path");


const isLessOrEqual = (a, b) => (a || a === 0) && a <= b;

fs.readFile(path.resolve(__dirname, './input'), 'utf8', (err, data) => {
  if (err) return console.error(err);

  const heightmap = data.trim().split('\n').map(line => line.split('').map(height => parseInt(height, 10)));
  const lowPoints = [];

  
  return
});
