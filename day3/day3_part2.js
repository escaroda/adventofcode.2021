fs = require('fs');


const getRating = (numbers, getMostCommon) => {
  const keepIfEqual = getMostCommon ? 1 : 0;
  const numberLength = numbers[0].length;
  const commonBitRates = new Array(numberLength).fill(0);

  let i = 0;
  while (i < numberLength) {

    for (const number of numbers) {
      const bit = number[i];
      commonBitRates[i] += bit === '1' ? 1 : -1;
    }

    if (commonBitRates[i] === 0) {
      commonBitRates[i] = keepIfEqual;
    } else if (getMostCommon) {
      commonBitRates[i] = commonBitRates[i] > 0 ? 1 : 0;
    } else {
      commonBitRates[i] = commonBitRates[i] > 0 ? 0 : 1;
    }
    
    numbers = numbers.filter(number => number[i] == commonBitRates[i]);
    if (numbers.length < 2) {
      return parseInt(numbers[0], 2)
    }

    i++
  }

  throw new Error('Wrong data');
}


fs.readFile('input', 'utf8', function (err, data) {
  if (err) {
    return console.log(err);
  }

  const numbers = data.split('\n');
  numbers.pop();
  
  const oxygenGeneratorRating = getRating(numbers, true);
  const CO2ScrubberRating = getRating(numbers, false);

  console.log("oxygen generator rating: ", oxygenGeneratorRating);
  console.log("CO2 scrubber rating: ", CO2ScrubberRating);
  console.log("life support rating: ", oxygenGeneratorRating * CO2ScrubberRating);

});
