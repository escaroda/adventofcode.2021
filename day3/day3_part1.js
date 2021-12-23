const fs = require('fs');
const path = require("path");

fs.readFile(path.resolve(__dirname, './input'), 'utf8', (err, data) => {
  if (err) return console.error(err);

  const numbers = data.split('\n');
  numbers.pop();

  const numberLength = numbers[0].length;
  const commonBitRates = new Array(numberLength).fill(0);

  for (const number of numbers) {
    for (let i = 0; i < number.length; i++) {
      const bit = number[i];
      commonBitRates[i] += bit === '1' ? 1 : -1;
    }
  }

  const gammaRateBits = commonBitRates.map((rate) => rate > 0 ? 1 : 0).join('');
  const epsilonRateBits = [...gammaRateBits].map((bit) => bit === '1' ? '0' : '1').join('');
  const gammaRate = parseInt(gammaRateBits, 2);
  const epsilonRate = parseInt(epsilonRateBits, 2);

  console.log(gammaRateBits, gammaRate, epsilonRateBits, epsilonRate);
  const powerConsumption = gammaRate * epsilonRate;
  console.log('powerConsumption: ', powerConsumption);

  return
});
