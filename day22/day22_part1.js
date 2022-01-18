const fs = require('fs');
const path = require("path");


const RANGE_LIMIT = 50;

const getRangePoints = ([left, right]) => {
  left = left > -RANGE_LIMIT ? left : -RANGE_LIMIT;
  right = right < RANGE_LIMIT ? right : RANGE_LIMIT;

  const points = [];
  for (let i = left; i <= right; i++) {
    points.push(i);
  }
  return points
}

const getCubes = ([rangeX, rangeY, rangeZ]) => {
  const cubes = [];
  for (const x of getRangePoints(rangeX)) {
    for (const y of getRangePoints(rangeY)) {
      for (const z of getRangePoints(rangeZ)) {
        cubes.push([x, y, z]);
      }
    }
  }
  return cubes
}


fs.readFile(path.resolve(__dirname, './input'), 'utf8', (err, data) => {
  if (err) return console.error(err);

  const rebootSteps = data.trim().split('\n').map(step => {
    const [mode, params] = step.split(' ');
    return {
      state: mode === 'on' ? 1 : 0,
      cuboid: params.split(',').map(range => range.slice(2).split('..').map(value => parseInt(value, 10))),
    }
  });
  const reactor = {};

  for (const step of rebootSteps) {
    for (const cube of getCubes(step.cuboid)) {
      reactor[cube.toString()] = step.state;
    }
  }

  let isOnCount = 0;
  for (const cube in reactor) {
    if (reactor[cube]) isOnCount++;
  }

  console.log(`There are ${isOnCount} 'on' cubes`);

  return
});
