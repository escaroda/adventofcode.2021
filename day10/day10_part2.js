const fs = require('fs');
const path = require("path");


const legalCharacters = ['(', '[', '{', '<', ')', ']', '}', '>']; // First half - opening; Second - closing
const autocompleteScores = [1, 2, 3, 4];
const SCORE_MULTIPLIER = 5;

if (autocompleteScores.length !== legalCharacters.length / 2) throw new Error('Not enough autocomplete scores for each pair of characters');

const characterPairs = {};
const openingCharacters = [];
const characterAutocompleteScore = {};

for (let i = 0; i < legalCharacters.length / 2; i++) {
  const openingCharacter = legalCharacters[i];
  const closingCharacter = legalCharacters[i + legalCharacters.length / 2];

  characterPairs[openingCharacter] = closingCharacter;
  openingCharacters[i] = openingCharacter;
  characterAutocompleteScore[closingCharacter] = autocompleteScores[i];
}


fs.readFile(path.resolve(__dirname, './input'), 'utf8', (err, data) => {
  if (err) return console.error(err);

  const lines = data.trim().split('\n');
  const scores = [];

  nextLine:
  for (const line of lines) {
    const closingStack = [];
    for (const character of line) {
      if (~openingCharacters.indexOf(character)) {      // Opening
        closingStack.push(characterPairs[character]);
      } else {                                          // Closing
        const expectedCharacter = closingStack.pop();
        if (expectedCharacter !== character) {          // Discard the corrupted lines
          continue nextLine;
        }
      }
    }

    let lineScore = 0;                                  // This line is incomplete because there are no syntax errors
    while (closingStack.length) {
      const closingCharacter = closingStack.pop();
      lineScore *= SCORE_MULTIPLIER;
      lineScore += characterAutocompleteScore[closingCharacter]
    }
    scores.push(lineScore);
  }

  scores.sort((a, b) => a - b);
  const middleIndex = Math.floor(scores.length / 2);

  console.log(`The middle score is ${scores[middleIndex]}`);

  return
});
