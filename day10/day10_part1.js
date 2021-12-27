const fs = require('fs');
const path = require("path");


const legalCharacters = ['(', '[', '{', '<', ')', ']', '}', '>']; // First half - opening; Second - closing
const errorScores = [3, 57, 1197, 25137];

if (errorScores.length !== legalCharacters.length / 2) throw new Error('Not enough error scores for each pair of characters');

const characterPairs = {};
const openingCharacters = [];
const characterErrorScore = {};
const incorrectCharacterCounter = {};

for (let i = 0; i < legalCharacters.length / 2; i++) {
  const openingCharacter = legalCharacters[i];
  const closingCharacter = legalCharacters[i + legalCharacters.length / 2];

  characterPairs[openingCharacter] = closingCharacter;
  openingCharacters[i] = openingCharacter;
  characterErrorScore[closingCharacter] = errorScores[i];
  incorrectCharacterCounter[closingCharacter] = 0;  
}


fs.readFile(path.resolve(__dirname, './input'), 'utf8', (err, data) => {
  if (err) return console.error(err);

  const lines = data.trim().split('\n');

  nextLine:
  for (const line of lines) {
    const closingStack = [];
    for (const character of line) {
      if (~openingCharacters.indexOf(character)) {      // Opening
        closingStack.push(characterPairs[character]);
      } else {                                          // Closing
        const expectedCharacter = closingStack.pop();
        if (expectedCharacter !== character) {          // Found error
          incorrectCharacterCounter[character] += 1;    // Assume input data doesn't contain illegal characters
          continue nextLine;                            // We need the first illegal character in each corrupted line only
        }
      }
    }
  }

  let totalErrorScore = 0;
  for (const character in incorrectCharacterCounter) {
    const count = incorrectCharacterCounter[character];
    totalErrorScore += count * characterErrorScore[character];
  }

  console.log(`Total score for the first illegal character in each corrupted line is ${totalErrorScore}`);

  return
});
