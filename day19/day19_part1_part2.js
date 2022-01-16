const fs = require('fs');
const path = require("path");


const getAtLeastOverlapDistances = (numOfPoints) => {
  let distancesToOverlap = 0;
  for (let i = 0; i < numOfPoints - 1; i++) {
    for (let j = i + 1; j < numOfPoints; j++) {
      distancesToOverlap += 1;
    }
  }
  return distancesToOverlap;
};

const AT_LEAST_OVERLAP_POINTS = 12;
const AT_LEAST_OVERLAP_DISTANCES = getAtLeastOverlapDistances(AT_LEAST_OVERLAP_POINTS);

const orientations = [
  (point) => point, // [x, y, z]
  ([x, y, z]) => [x, z, -y],
  ([x, y, z]) => [x, -y, -z],
  ([x, y, z]) => [x, -z, y],

  ([x, y, z]) => [-x, -y, z],
  ([x, y, z]) => [-x, z, y],
  ([x, y, z]) => [-x, y, -z],
  ([x, y, z]) => [-x, -z, -y],
  
  ([x, y, z]) => [y, z, x],
  ([x, y, z]) => [y, x, -z],
  ([x, y, z]) => [y, -z, -x],
  ([x, y, z]) => [y, -x, z],
  
  ([x, y, z]) => [-y, -z, x],
  ([x, y, z]) => [-y, x, z],
  ([x, y, z]) => [-y, z, -x],
  ([x, y, z]) => [-y, -x, -z],
  
  ([x, y, z]) => [z, x, y],
  ([x, y, z]) => [z, y, -x],
  ([x, y, z]) => [z, -x, -y],
  ([x, y, z]) => [z, -y, x],
  
  ([x, y, z]) => [-z, -x, y],
  ([x, y, z]) => [-z, y, x],
  ([x, y, z]) => [-z, x, -y],
  ([x, y, z]) => [-z, -y, -x],
];

const applyPositionForAllPoints = (scan, shiftX, shiftY, shiftZ) => {
  return scan.map(point => {
    point[0] += shiftX;
    point[1] += shiftY;
    point[2] += shiftZ;
    return point
  })
};

const getDistanceBetweenTwoPoints = ([x1, y1, z1], [x2, y2, z2]) => Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2) + Math.pow(z2 - z1, 2));

const mergeSets = (...sets) => { // Immutable
  const mergedSet = new Set();
  for (const set of sets) {
    for (const item of set) {
      mergedSet.add(item);
    }
  }
  return mergedSet
};

const getSetOfDistancesBetweenPoints = (points) => {
  const distances = new Set();
  for (let i = 0; i < points.length - 1; i++) {
    const point1 = points[i];
    for (let j = i + 1; j < points.length; j++) {
      const point2 = points[j];
      distances.add(getDistanceBetweenTwoPoints(point1, point2));
    }
  }
  return distances;
};

const getPossibleOverlapScanIndices = (baseSet, setsOfDistances) => {
  const overlapScans = [];
  for (let i = 0; i < setsOfDistances.length; i++) {
    const currentSet = setsOfDistances[i];
    const sizeBeforeMerge = baseSet.size + currentSet.size;

    const mergedSet = mergeSets(baseSet, currentSet);
    const distancesOverlap = sizeBeforeMerge - mergedSet.size;
    if (distancesOverlap >= AT_LEAST_OVERLAP_DISTANCES) overlapScans.push(i)
  }
  return overlapScans;
};

const checkIfTwoBeaconsOverlap = ([ x1, y1, z1 ], [ x2, y2, z2 ]) => x1 === x2 && y1 === y2 && z1 === z2;

const getAnchoredShiftsToAlignScan = (baseScan, comparedScan) => { // Get position shifts where at least one point is aligned
  const shifts = [];
  for (const basePoint of baseScan) {
    for (const comparedPoint of comparedScan) {
      const shiftX = basePoint[0] - comparedPoint[0];
      const shiftY = basePoint[1] - comparedPoint[1];
      const shiftZ = basePoint[2] - comparedPoint[2];
      shifts.push([shiftX, shiftY, shiftZ]);
    }
  }
  return shifts
};

const checkIfOverlap = (baseScan, comparedScan) => {
  for (const orientation of orientations) {
    const orientedScan = comparedScan.map(orientation);

    const anchoredShifts = getAnchoredShiftsToAlignScan(baseScan, orientedScan);
    for (const [shiftX, shiftY, shiftZ] of anchoredShifts) {

      let overlapCount = 0;
      for (const comparedPoint of orientedScan) {
        const [x, y, z] = comparedPoint;

        for (const basePoint of baseScan) {
          if (checkIfTwoBeaconsOverlap(basePoint, [x + shiftX, y + shiftY, z + shiftZ])) {
            overlapCount += 1;
            if (overlapCount === AT_LEAST_OVERLAP_POINTS) {
              return { 
                beacons: applyPositionForAllPoints(orientedScan, shiftX, shiftY, shiftZ),
                scannerPosition: [shiftX, shiftY, shiftZ], // relative to the first scanner
              };
            }
          }
        }
      }
    }
  }

  return false
};

const mergeBeacons = (beacons, newBeacons) => {
  const beaconsToAdd = [];
  nextBeacon:
  for (const newBeacon of newBeacons) {
    for (const beacon of beacons) {
      if (checkIfTwoBeaconsOverlap(beacon, newBeacon)) continue nextBeacon;
    }
    beaconsToAdd.push(newBeacon);
  }
  beacons.push(...beaconsToAdd);
};


fs.readFile(path.resolve(__dirname, './input'), 'utf8', (err, data) => {
  if (err) return console.error(err);

  const scanners = [[0, 0, 0]]; // Base reference scanner at [0, 0, 0]
  const beacons = [];

  const scans = data.trim().split('\n\n').map(scan => {
    const titleEndIndex = scan.indexOf('\n');
    return scan.slice(titleEndIndex + 1).split('\n').map(coordinates => coordinates.split(',').map(num => parseInt(num, 10)))
  });
 
  const distances = [];
  for (const scan of scans) {
    distances.push(getSetOfDistancesBetweenPoints(scan));
  }

  const scansToRemove = [];
  const stack = [{ baseScan: scans[0], baseDistances: distances[0] }];
  while (stack.length) {
    const { baseScan, baseDistances } = stack.pop();
    const possibleOverlapScanIndices = getPossibleOverlapScanIndices(baseDistances, distances);

    while (possibleOverlapScanIndices.length) {
      const possibleOverlapScanIndex = possibleOverlapScanIndices.pop();
      const overlapScan = checkIfOverlap(baseScan, scans[possibleOverlapScanIndex]);

      if (overlapScan) {
        mergeBeacons(beacons, overlapScan.beacons); // Gather new beacons
        scanners.push(overlapScan.scannerPosition); // Save camera position relative to the first scanner
        stack.push({ baseScan: overlapScan.beacons, baseDistances: distances[possibleOverlapScanIndex] });
        scansToRemove.push(possibleOverlapScanIndex);
      }
    }

    if (scansToRemove.length) {
      scansToRemove.sort((a, b) => a - b); // Remove larger index first to preserve order
      while (scansToRemove.length) {
        const nextScanIndex = scansToRemove.pop();
        scans.splice(nextScanIndex, 1);
        distances.splice(nextScanIndex, 1);
      }
    }
  }

  console.log(`There are ${beacons.length} beacons`);


  // Part 2
  let largestDistance = 0; // The largest Manhattan distance between any two scanners
  for (let i = 0; i < scanners.length - 1; i++) {
    for (let j = i + 1; j < scanners.length; j++) {
      const [x1, y1, z1] = scanners[i];
      const [x2, y2, z2] = scanners[j];
      let distance = 0;
      distance += Math.abs(x1 - x2);
      distance += Math.abs(y1 - y2);
      distance += Math.abs(z1 - z2);
      if (distance > largestDistance) largestDistance = distance
    }
  }

  console.log(`The largest Manhattan distance between any two scanners is ${largestDistance}`);

  return
});
