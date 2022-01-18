const fs = require('fs');
const path = require("path");


const AREA_RANGE = 50;

const getAreaPoints = ([left, right]) => {
  left = left > -AREA_RANGE ? left : -AREA_RANGE;
  right = right < AREA_RANGE ? right : AREA_RANGE;

  const points = [];
  for (let i = left; i <= right; i++) {
    points.push(i);
  }
  return points
}

const getCubes = ([areaX, areaY, areaZ]) => {
  const cubes = [];
  for (const x of getAreaPoints(areaX)) {
    for (const y of getAreaPoints(areaY)) {
      for (const z of getAreaPoints(areaZ)) {
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
