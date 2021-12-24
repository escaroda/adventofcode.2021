const fs = require('fs');
const path = require("path");


const NUMBER_OF_DAYS = 80;
const RESET_TIME = 6;
const NEW_FISH_TIME = 8;

fs.readFile(path.resolve(__dirname, './input'), 'utf8', (err, data) => {
  if (err) return console.error(err);

  const generation = data.trim().split(',').map(fishTimer => parseInt(fishTimer, 10));

  let days = NUMBER_OF_DAYS;
  while (days) {
    const newFish = [];
    for (let i = 0; i < generation.length; i++) {
      if (generation[i]) {
        generation[i]--
      } else {
        generation[i] = RESET_TIME;
        newFish.push(NEW_FISH_TIME);
      }
    }
    console.log(newFish.length);
    generation.push(...newFish);
    days--;
  }

  console.log(`After ${NUMBER_OF_DAYS} days, there would be a total of ${generation.length} fish`);

  return
});
