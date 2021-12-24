const fs = require('fs');
const path = require("path");


const NUMBER_OF_DAYS = 256;
const RESET_TIME = 6;
const NEW_FISH_TIME = 8;

fs.readFile(path.resolve(__dirname, './input'), 'utf8', (err, data) => {
  if (err) return console.error(err);

  const generation = data.trim().split(',');

  const generationTree = new Array(NEW_FISH_TIME > RESET_TIME ? NEW_FISH_TIME + 1 : RESET_TIME + 1).fill(0);
  for (const fishTimer of generation) {
    generationTree[fishTimer] += 1;
  }

  let days = NUMBER_OF_DAYS;
  while (days) {
    const newFish = generationTree[0];
    for (let i = 0; i < generationTree.length; i++) {
      generationTree[i] = generationTree[i + 1] || 0;
    }
    generationTree[RESET_TIME] += newFish;
    generationTree[NEW_FISH_TIME] += newFish;
    days--;
  }

  let total = 0;
  for (const fish of generationTree) {
    total += fish;
  }

  console.log(`After ${NUMBER_OF_DAYS} days, there would be a total of ${total} fish`);

  return
});
