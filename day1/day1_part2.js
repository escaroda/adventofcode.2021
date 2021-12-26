const fs = require('fs');
const path = require("path");


fs.readFile(path.resolve(__dirname, './input'), 'utf8', (err, data) => {
  if (err) return console.error(err);
  
  let largerThanPreviousCount = 0;
  const arrayOfMeasures = data.split('\n');

  console.debug(arrayOfMeasures.length, ' values');
  
  for (let i = 3; i < arrayOfMeasures.length - 1; i++) {
    const previous = parseInt(arrayOfMeasures[i - 3]) + 
                     parseInt(arrayOfMeasures[i - 2]) +
                     parseInt(arrayOfMeasures[i - 1]);
    const current = parseInt(arrayOfMeasures[i - 2]) +
                    parseInt(arrayOfMeasures[i - 1]) +
                    parseInt(arrayOfMeasures[i - 0]);
    if (current > previous) largerThanPreviousCount++;
  }

  console.info(largerThanPreviousCount, ' larger than the previous value');

  return 
});
