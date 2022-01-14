const fs = require('fs');
const path = require("path");


/**
 * I'm curious if reduce method should have been implemented using recursion on parsed array tree instead of string manipulation.
 */
const MAX_NESTING_LEVEL = 4;

const getMaxNestingLevel = (num) => {
  let maxLevel = 0;
  let currentLevel = 0;
  for (const char of num) {
    if (char === '[') {
      currentLevel += 1;
      if (currentLevel > maxLevel) maxLevel = currentLevel;
    } else if (char === ']') {
      currentLevel -= 1;
    }
  }
  return maxLevel
}

const reduce = (num) => {
  let hasBeenTouched;

  do {
    hasBeenTouched = false;

    // 1st -> If any pair is nested inside four pairs, the leftmost such pair explodes
    const maxNestingLevel = getMaxNestingLevel(num);
    if (maxNestingLevel > MAX_NESTING_LEVEL) {

      // Find first max nesting pair
      let currentLevel = 0;
      for (let i = 0; i < num.length; i++) {
        const char = num[i];
        if (char === '[') {
          currentLevel += 1;
          if (currentLevel === maxNestingLevel) {

            let leftPart = num.slice(0, i);
            const pairAndRightPart = num.slice(i);
            const pairEndIndex = pairAndRightPart.indexOf(']');
            const pair = pairAndRightPart.slice(0, pairEndIndex + 1).split(/[^0-9]+/).filter(item => item);
            let rightPart = pairAndRightPart.slice(pairEndIndex + 1);

            const leftNumbers = leftPart.split(/[^0-9]+/).filter(item => item);
            const leftNumber = leftNumbers[leftNumbers.length - 1];
            if (leftNumber) {
              const leftNumberIndex = leftPart.lastIndexOf(leftNumber)
              const newLeftNumber = `${parseInt(pair[0], 10) + parseInt(leftNumber, 10)}`;
              leftPart = leftPart.slice(0, leftNumberIndex) + newLeftNumber + leftPart.slice(leftNumberIndex + leftNumber.length);
            }

            const rightNumbers = rightPart.split(/[^0-9]+/).filter(item => item);
            const rightNumber = rightNumbers[0];
            if (rightNumber) {
              const newRightNumber = parseInt(pair[1], 10) + parseInt(rightNumber, 10);
              const rightNumberIndex = rightPart.indexOf(rightNumber);
              rightPart = rightPart.slice(0, rightNumberIndex) + newRightNumber + rightPart.slice(rightNumberIndex + rightNumber.length);
            }

            num = leftPart + '0' + rightPart; // Replace pair with 0
            break;
          }
        } else if (char === ']') {
          currentLevel -= 1;
        }
      }

      hasBeenTouched = true;
      continue; // Skip splits because we can do only 1 modification within step
    }

    // 2nd -> If any regular number is 10 or greater, the leftmost such regular number splits
    const regularNumbers = num.split(/[^0-9]+/);
    for (const regularNumber of regularNumbers) {
      if (regularNumber.length > 1) { // number > 9

        const dividedNumber = parseInt(regularNumber, 10) / 2;
        const splittedNumber = `[${Math.floor(dividedNumber)},${Math.ceil(dividedNumber)}]`;
        num = num.replace(regularNumber, splittedNumber);

        hasBeenTouched = true;
        break;
      }
    }

  } while (hasBeenTouched);
  
  return num
}

const sum = (num1, num2) => {
  return `[${num1},${num2}]`
}

const getMagnitude = (pair) => {
  if (typeof pair === 'number') {
    return pair 
  } else {
    return getMagnitude(pair[0]) * 3 + getMagnitude(pair[1]) * 2
  }
}

fs.readFile(path.resolve(__dirname, './input'), 'utf8', (err, data) => {
  if (err) return console.error(err);
  
  const numbers = data.trim().split('\n');
  const magnitudes = [];

  // Add up two different snailfish numbers, reduce result and save magnitude
  for (let i = 0; i < numbers.length - 1; i++) {
    const num1 = numbers[i];
    for (let j = i + 1; j < numbers.length; j++) {
      const num2 = numbers[j];
      const sum1 = sum(num1, num2);
      const sum2 = sum(num2, num1);
      magnitudes.push(getMagnitude(JSON.parse(reduce(sum1))));
      magnitudes.push(getMagnitude(JSON.parse(reduce(sum2))));  
    }
  }

  // Get the largest magnitude
  magnitudes.sort((a, b) => a - b);
  const largestMagnitude = magnitudes[magnitudes.length - 1]

  console.log(`The largest magnitude of any sum of two different snailfish numbers is ${largestMagnitude}`);

  return
});
