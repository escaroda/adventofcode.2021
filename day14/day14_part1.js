const fs = require('fs');
const path = require("path");


const NUMBER_OF_STEPS = 10;

fs.readFile(path.resolve(__dirname, './input'), 'utf8', (err, data) => {
  if (err) return console.error(err);

  let [polymerTemplate, insertionRules] = data.trim().split('\n\n');

  polymerTemplate = polymerTemplate.split('');
  insertionRules = insertionRules.split('\n').map(line => line.split(' -> '));

  // Insert elements
  let stepsLeft = NUMBER_OF_STEPS;
  while (stepsLeft) {
    const newPolymerTemplate = [];
    for (let i = 0; i < polymerTemplate.length - 1; i++) {
      const pair = polymerTemplate[i] + polymerTemplate[i + 1];
      const ruleIndex = insertionRules.findIndex(rule => rule[0] === pair);
      if (~ruleIndex) {
        const insertElement = insertionRules[ruleIndex][1];
        newPolymerTemplate.push(polymerTemplate[i], insertElement);
      }
    }
    newPolymerTemplate.push(polymerTemplate[polymerTemplate.length - 1]);
    polymerTemplate = newPolymerTemplate;
    stepsLeft--;
  }

  // Get quantity for each element
  const quantities = {};
  for (const element of polymerTemplate) {
    if (!quantities[element]) {
      quantities[element] = 1
    } else {
      quantities[element] += 1
    }
  }

  // Sort results
  const elementQuantityMap = []; // [[element, quantity]]
  for (const element in quantities) {
    const quantity = quantities[element];
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
