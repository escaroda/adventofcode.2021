const fs = require('fs');
const path = require("path");


/**
 * I think it should be refactored to be solved with bits and bitwise operators (AND, OR, XOR)
 */
const uniqueDigits = [1, 4, 7, 8];
const digitSegments = ['abcefg', 'cf', 'acdeg', 'acdfg', 'bcdf', 'abdfg', 'abdefg', 'acf', 'abcdefg', 'abcdfg'];
const uniqueDigitLengths = uniqueDigits.map(digit => digitSegments[digit].length);

const getMissingSegment = (a, b) => {
  let differentSegment = '';
  for (const segment of b) {
    if (!~a.indexOf(segment)) differentSegment += segment;
  }
  return differentSegment
}

const getDigits = (uniqueSignalPatterns) => {
  let zero, one, two, three, four, five, six, seven, eight, nine;

  // Find route 1 -> 4 -> 7 -> 8 -> 3 -> 9 -> 2 -> 5 -> 0 -> 6

  // One, Four, Seven, Eight
  for (const pattern of uniqueSignalPatterns) {
    switch (pattern.length) {
      case 2:
        one = pattern;
        break;
      case 4:
        four = pattern;
        break;
      case 3:
        seven = pattern;
        break;
      case 7:
        eight = pattern;
        break;
    }
  }
  uniqueSignalPatterns = uniqueSignalPatterns.filter(pattern => !~uniqueDigitLengths.indexOf(pattern.length));
  
  // Tree
  for (const pattern of uniqueSignalPatterns) {
    if (pattern.length === 5) { // [2, 3, 5] -> 3 should contain 1 -> get 3
      let similarity = 0;
      for (const segment of one) {
        if (~pattern.indexOf(segment)) similarity++;
      }
      if (similarity === one.length) {
        three = pattern;
        break;
      }
    }
  }
  uniqueSignalPatterns = uniqueSignalPatterns.filter(pattern => pattern !== three);

  // Nine
  for (const pattern of uniqueSignalPatterns) {
    if (pattern.length === 6) { // [0, 6, 9] -> 9 different from 3 only by 1 -> get 9
      let difference = 0;
      for (const segment of pattern) {
        if (!~three.indexOf(segment)) difference++;
      }
      if (difference === 1) {
        nine = pattern;
        break;
      }
    }
  }
  uniqueSignalPatterns = uniqueSignalPatterns.filter(pattern => pattern !== nine);

  // Two & Five
  const eSegment = getMissingSegment(nine, digitSegments[8]); // 8 and 9 differ in eSegment
  for (const pattern of uniqueSignalPatterns) {
    if (pattern.length === digitSegments[5].length) { // [2, 5] -> 5 doesn't contain eSegment -> get 2, 5
      if (~pattern.indexOf(eSegment)) {
        two = pattern;
      } else {
        five = pattern;
      }
    }
  }
  uniqueSignalPatterns = uniqueSignalPatterns.filter(pattern => pattern !== two && pattern !== five);

  // Zero & Six
  for (const pattern of uniqueSignalPatterns) {
    if (pattern.length === 6) { // [0, 6] -> 0 contains 1 -> get 0, 6
      let similarity = 0;
      for (const segment of one) {
        if (~pattern.indexOf(segment)) similarity++;
      }
      if (similarity === one.length) {
        zero = pattern;
      } else {
        six = pattern;
      }
    }
  }

  return [zero, one, two, three, four, five, six, seven, eight, nine]
}

const isSameDigits = (digit1, digit2) => {
  if (digit1.length !== digit2.length) return false
  return new Set(digit1).size === new Set(digit1 + digit2).size;
}

fs.readFile(path.resolve(__dirname, './input'), 'utf8', (err, data) => {
  if (err) return console.error(err);

  const entries = data.trim().split('\n').map(line => line.split(' | ').map(digits => digits.split(' ')));

  let totalSum = 0;
  for (const entry of entries) {
    const uniqueSignalPatterns = entry[0];
    const outputValue = entry[1];
    
    const digits = getDigits(uniqueSignalPatterns);

    let decodedValue = '';
    for (const digit of outputValue) {
      for (let i = 0; i < digits.length; i++) {
        if (isSameDigits(digit, digits[i])) {
          decodedValue += i;
          break;
        }
      }
    }
    totalSum += parseInt(decodedValue, 10);
  }

  console.log(`Adding all of the output values produces ${totalSum}`)

  return
});
