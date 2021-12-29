const fs = require('fs');
const path = require("path");


fs.readFile(path.resolve(__dirname, './input'), 'utf8', (err, data) => {
  if (err) return console.error(err);

  const connections = data.trim().split('\n').map(connection => connection.split('-'));
    
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

  const start = (cave = 'start', smallCaves = [], smallCaveVisitedTwice) => {
    if (cave.length === 2 && cave === cave.toLowerCase()) {
      if (~smallCaves.indexOf(cave)) {                        // This is small cave and it was visited before
        if (smallCaveVisitedTwice) return;                    // Terminate current route because we visited same or another small cave twice already
        smallCaveVisitedTwice = cave;                         // Remember this small cave was visited twice on current route
      }
      smallCaves.push(cave)                                   // Remember that this small cave was visited once
    }

    if (cave === 'end') {
      numberOfPaths += 1;
    } else if (children[cave]) {
      for (const childrenCave of children[cave]) {
        start(childrenCave, [...smallCaves], smallCaveVisitedTwice);
      }
    }
  }


  start();

  console.log(`There are ${numberOfPaths} paths through this cave system, given new rules`);

  return
});
