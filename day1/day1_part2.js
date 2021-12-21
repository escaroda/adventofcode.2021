fs = require('fs');

fs.readFile('input', 'utf8', function (err, data) {
  if (err) {
    return console.log(err);
  }
  
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
