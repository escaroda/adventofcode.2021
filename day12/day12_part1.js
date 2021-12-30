const fs = require('fs');
const path = require("path");


fs.readFile(path.resolve(__dirname, './input'), 'utf8', (err, data) => {
  if (err) return console.error(err);

  const connections = data.trim().split('\n').map(connection => connection.split('-'));
    
  // Gather all connections for each cave
  const children = {};
  for (const connection of connections) {
    const [cave1, cave2] = connection;

    if (cave2 !== 'start' && cave1 !== 'end') {
      if (!children[cave1]) {
        children[cave1] = [cave2];
      } else {
        children[cave1].push(cave2);
      }
    }

    if (cave1 !== 'start' && cave2 !== 'end') {
      if (!children[cave2]) {
        children[cave2] = [cave1];
      } else {
        children[cave2].push(cave1);
      }
    }
  }

  let numberOfPaths = 0;

  const start = (cave = 'start', smallCaves = []) => {
    if (cave.length === 2 && cave === cave.toLowerCase()) { // This is small cave
      if (~smallCaves.indexOf(cave)) return;                // Terminate current route since this small cave was already visited
      smallCaves.push(cave)
    }

    if (cave === 'end') {
      numberOfPaths += 1;
    } else if (children[cave]) {
      for (const childCave of children[cave]) {
        start(childCave, [...smallCaves]);
      }
    }
  }

  start();
  
  console.log(`There are ${numberOfPaths} paths through this cave system that visit small caves at most once`);

  return
});
