const fs = require('fs');
const path = require("path");


/**
 * This is not an optimized solution because base scanner (where each overlapped scanners merged into) grow a lot and cause much more position shifts to check further
 * Ideal solution would be to go from one scanner to another and construct a tree of aligned scanners
 */

const getAtLeastOverlapDistances = (numOfPoints) => {
  let distancesToOverlap = 0;

  for (let i = 0; i < numOfPoints - 1; i++) {
    for (let j = i + 1; j < numOfPoints; j++) {
      distancesToOverlap += 1;
    }
  }

  return distancesToOverlap;
}

const AT_LEAST_OVERLAP_POINTS = 12;
const AT_LEAST_OVERLAP_DISTANCES = getAtLeastOverlapDistances(AT_LEAST_OVERLAP_POINTS);
const SCANNER_RANGE = 1000; // 1000 units away from the scanner in each of the three axes (x, y, and z)
const NUM_OF_ORIENTATIONS = 24;

const getOrientationsForPoint = ([ x, y, z ]) => {
  return [
    [x, y, z],
    [x, z, -y],
    [x, -y, -z],
    [x, -z, y],

    [-x, -y, z],
    [-x, z, y],
    [-x, y, -z],
    [-x, -z, -y],

    [y, z, x],
    [y, x, -z],
    [y, -z, -x],
    [y, -x, z],

    [-y, -z, x],
    [-y, x, z],
    [-y, z, -x],
    [-y, -x, -z],

    [z, x, y],
    [z, y, -x],
    [z, -x, -y],
    [z, -y, x],

    [-z, -x, y],
    [-z, y, x],
    [-z, x, -y],
    [-z, -y, -x],
  ]
}

const getOrientationsForScan = (scan) => {
  const orientedScans = [];
  for (let i = 0; i < NUM_OF_ORIENTATIONS; i++) {
    orientedScans[i] = [];
  }

  for (const point of scan) {
    const orientedPoints = getOrientationsForPoint(point)
    for (const orientationIndex in orientedPoints) {
      orientedScans[orientationIndex].push(orientedPoints[orientationIndex]);
    }
  }

  return orientedScans  
}

const scannerPositions = [[0, 0, 0]]; // Base scanner at [0, 0, 0]
const applyPositionForAllPoints = (scan, shiftX, shiftY, shiftZ) => {
  scannerPositions.push([shiftX, shiftY, shiftZ])
  return scan.map(point => {
    point[0] += shiftX;
    point[1] += shiftY;
    point[2] += shiftZ;
    return point
  })
}

const getDistanceBetweenTwoPoints = ([x1, y1, z1], [x2, y2, z2]) => {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2) + Math.pow(z2 - z1, 2))
}

const mergeSets = (...sets) => { // Immutable
  const mergedSet = new Set();
  for (const set of sets) {
    for (const item of set) {
      mergedSet.add(item);
    }
  }
  return mergedSet
}

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
}

const getPossibleOverlapScanIndices = (setsOfDistances) => {
  const baseSet = setsOfDistances[0];
  const overlapScans = [];

  for (let i = 1; i < setsOfDistances.length; i++) {
    const currentSet = setsOfDistances[i];
    const sizeBeforeMerge = baseSet.size + currentSet.size;

    const mergedSet = mergeSets(baseSet, currentSet);
    const distancesOverlap = sizeBeforeMerge - mergedSet.size;
    if (distancesOverlap >= AT_LEAST_OVERLAP_DISTANCES) overlapScans.push({ distancesOverlap, index: i })
  }
  overlapScans.sort((a, b) => a.distancesOverlap - b.distancesOverlap);
  return overlapScans.map(item => item.index);
}

const checkIfTwoPointsOverlap = ([ x1, y1, z1 ], [ x2, y2, z2 ]) => {
  return x1 === x2 && y1 === y2 && z1 === z2
}

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
}

const checkIfOverlap = (baseScan, comparedScan) => {
  for (const orientedScan of getOrientationsForScan(comparedScan)) {

    const anchoredShifts = getAnchoredShiftsToAlignScan(baseScan, orientedScan);
    for (const [shiftX, shiftY, shiftZ] of anchoredShifts) {

      let overlapCount = 0;
      for (const comparedPoint of orientedScan) {
        const [x, y, z] = comparedPoint;

        for (const basePoint of baseScan) {
          if (checkIfTwoPointsOverlap(basePoint, [x + shiftX, y + shiftY, z + shiftZ])) {
            overlapCount += 1;
            if (overlapCount === AT_LEAST_OVERLAP_POINTS) {
              return applyPositionForAllPoints(orientedScan, shiftX, shiftY, shiftZ);
            }
          }
        }
      }
    }
  }

  return false
}

const mergeOverlapScanIntoBase = (baseScan, overlapScan) => {
  const pointsToAdd = [];

  for (const newPoint of overlapScan) {
    let hasBeenSeen = false;
    for (const basePoint of baseScan) {
      if (checkIfTwoPointsOverlap(basePoint, newPoint)) hasBeenSeen = true;
    }
    if (!hasBeenSeen) pointsToAdd.push(newPoint);
  }

  baseScan.push(...pointsToAdd);
}

const mergeOverlapDistancesIntoBase = (baseDistances, overlapDistances) => {
  for (const distance of overlapDistances) {
    baseDistances.add(distance);
  }
}


fs.readFile(path.resolve(__dirname, './input'), 'utf8', (err, data) => {
  if (err) return console.error(err);

  const scans = data.trim().split('\n\n').map(scan => {
    const titleEndIndex = scan.indexOf('\n');
    return scan.slice(titleEndIndex + 1).split('\n').map(coordinates => coordinates.split(',').map(num => parseInt(num, 10)))
  });
  const baseScan = scans[0];
 
  const distances = [];
  for (const scan of scans) {
    distances.push(getSetOfDistancesBetweenPoints(scan));
  }
  const baseDistances = distances[0];

  while (scans.length - 1) {
    const scansToRemove = [];
    
    const possibleOverlapScans = getPossibleOverlapScanIndices(distances);

    while (possibleOverlapScans.length) {
      const possibleOverlapScanIndex = possibleOverlapScans.pop();
      const possibleOverlapScan = scans[possibleOverlapScanIndex];

      const overlapScan = checkIfOverlap(baseScan, possibleOverlapScan);

      if (overlapScan) {
        mergeOverlapScanIntoBase(baseScan, overlapScan);
        mergeOverlapDistancesIntoBase(baseDistances, distances[possibleOverlapScanIndex]);
        scansToRemove.push(possibleOverlapScanIndex);
        scans.splice(possibleOverlapScanIndex, 1);
        distances.splice(possibleOverlapScanIndex, 1);
        break;
      }
    }
    console.log('scans left: ', scans.length);
  }

  console.log(`There are ${baseScan.length} beacons`);


  let largestDistanceBetweenScanners = 0;
  for (let i = 0; i < scannerPositions.length - 1; i++) {
    for (let j = i + 1; j < scannerPositions.length; j++) {
      const [ x1, y1, z1 ] = scannerPositions[i];
      const [ x2, y2, z2 ] = scannerPositions[j];
      let currentDistance = 0;
      currentDistance += Math.abs(x1 - x2);
      currentDistance += Math.abs(y1 - y2);
      currentDistance += Math.abs(z1 - z2);
      if (currentDistance > largestDistanceBetweenScanners) largestDistanceBetweenScanners = currentDistance
    }
  }

  console.log(`The largest Manhattan distance between any two scanners is ${largestDistanceBetweenScanners}`);

  return
});
