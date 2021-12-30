const fs = require('fs');
const path = require("path");


const NUMBER_OF_STEPS = 40;

fs.readFile(path.resolve(__dirname, './input'), 'utf8', (err, data) => {
  if (err) return console.error(err);

  let [polymerTemplate, insertionRules] = data.trim().split('\n\n');

  polymerTemplate = polymerTemplate.split('');
  insertionRules = insertionRules.split('\n').map(line => line.split(' -> '));


  // Change data structure
  const elementQuantities = {}; // { element: quantity }
  const pairQuantities = {};    // { pair: quantity }

  for (let i = 0; i < polymerTemplate.length - 1; i++) {
    const leftElement = polymerTemplate[i];
    const rightElement = polymerTemplate[i + 1];
    const pair = leftElement + rightElement;

    if (!elementQuantities[leftElement]) elementQuantities[leftElement] = 0;
    elementQuantities[leftElement] += 1;
    // Add rightElement (lastElement) outside of for loop. Otherwise, it would overlap

    if (!pairQuantities[pair]) pairQuantities[pair] = 0;
    pairQuantities[pair] += 1;
  }
  const lastElement = polymerTemplate[polymerTemplate.length - 1];
  if (!elementQuantities[lastElement]) elementQuantities[lastElement] = 0;
  elementQuantities[lastElement] += 1;


  // Insert
  let stepsLeft = NUMBER_OF_STEPS;
  while (stepsLeft) {
    const changeInQuantity = {};
    for (const pair in pairQuantities) {
      const pairQuantity = pairQuantities[pair];
      if (pairQuantity) { // Skip pairs with 0 quantity
        const ruleIndex = insertionRules.findIndex(rule => rule[0] === pair);
        if (~ruleIndex) {

           // Insert element for each existed pair
          const insertElement = insertionRules[ruleIndex][1];
          if (!elementQuantities[insertElement]) elementQuantities[insertElement] = 0;
          elementQuantities[insertElement] += pairQuantity;

          // Each insertion breaks one pair and creates two more
          const leftPair = pair[0] + insertElement;
          const rightPair = insertElement + pair[1];

          if (!changeInQuantity[pair]) changeInQuantity[pair] = 0;
          changeInQuantity[pair] -= pairQuantity;

          if (!changeInQuantity[leftPair]) changeInQuantity[leftPair] = 0;
          changeInQuantity[leftPair] += pairQuantity;

          if (!changeInQuantity[rightPair]) changeInQuantity[rightPair] = 0;
          changeInQuantity[rightPair] += pairQuantity;
        }
      }
    }

    for (const pair in changeInQuantity) {
      const change = changeInQuantity[pair];
      if (!pairQuantities[pair]) pairQuantities[pair] = 0;
      pairQuantities[pair] += change;
    }
    stepsLeft--;
  }

  // Change data structure and sort results
  const elementQuantityMap = []; // [[element, quantity]]
  for (const element in elementQuantities) {
    const quantity = elementQuantities[element];
    elementQuantityMap.push([element, quantity])
  }
  elementQuantityMap.sort((a, b) => a[1] - b[1]);

  // Get least and most common elements
  const leastCommon = elementQuantityMap[0];
  const mostCommon = elementQuantityMap[elementQuantityMap.length - 1];
  const differenceInQuantity = mostCommon[1] - leastCommon[1];

  console.log(`Difference in quantity between the most common element and the least common element after ${NUMBER_OF_STEPS} steps is ${differenceInQuantity}`)

  return
});
