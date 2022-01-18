const fs = require('fs');
const path = require("path");


/**
 * Inspired by Jonathan Paulson's solution https://github.com/jonathanpaulson/AdventOfCode/blob/master/2021/21.py
 */
const WIN_SCORE = 21;
const BOARD_LENGTH = 10;

const getPosition = (position, move) => (position - 1 + move) % BOARD_LENGTH + 1;

const moves = [ // 3^3 = 27
  [1, 1, 1], [1, 1, 2], [1, 1, 3], [1, 2, 1], [1, 2, 2], [1, 2, 3], [1, 3, 1], [1, 3, 2], [1, 3, 3],
  [2, 1, 1], [2, 1, 2], [2, 1, 3], [2, 2, 1], [2, 2, 2], [2, 2, 3], [2, 3, 1], [2, 3, 2], [2, 3, 3],
  [3, 1, 1], [3, 1, 2], [3, 1, 3], [3, 2, 1], [3, 2, 2], [3, 2, 3], [3, 3, 1], [3, 3, 2], [3, 3, 3],
];
const reducedMoves = moves.map(combination => combination.reduce((a, b) => a + b, 0));
const uniqueMoves = [...new Set(reducedMoves)]; // Remove repetitions but take into account a real number of moves using ratio

const getMoveRatio = (moves) => {
  const ratio = {};
  for (const move of moves) {
    if (!ratio[move]) ratio[move] = 0;
    ratio[move] += 1;
  }
  return ratio
}
const moveRatio = getMoveRatio(reducedMoves); // Multiplier for universes since unique moves happens ratio[move] times

const getCacheKey = ([s1, s2], [p1, p2]) => `${s1}-${s2}-${p1}-${p2}`; // There are ~20*20*10*10 possible game states


fs.readFile(path.resolve(__dirname, './input'), 'utf8', (err, data) => {
  if (err) return console.error(err);

  const positions = data.trim().split('\n').map(line => parseInt(line[line.length -1], 10)); // [player1, player2]

  const cache = {};
  const play = (scores, positions) => {

    if (scores[0] >= WIN_SCORE) return [1, 0];
    if (scores[1] >= WIN_SCORE) return [0, 1];

    const cacheKey = getCacheKey(scores, positions);
    if (cache[cacheKey]) return cache[cacheKey]; // Return already calculated result for current scores and positions if exist

    let universes = [0, 0];               // How many win universes for both players
    for (const move of uniqueMoves) {
      const scoresC = [...scores];        // Make a copy of arrays or they will mutate
      const positionsC = [...positions];

      // 'Left' player move
      positionsC[0] = getPosition(positionsC[0], move);
      scoresC[0] += positionsC[0];

      const [ uL, uR ] = play(scoresC.reverse(), positionsC.reverse()); // Swap players to make a move for the other one
      universes[0] += uR * moveRatio[move];                             // But swap back the result
      universes[1] += uL * moveRatio[move];
    }
    cache[cacheKey] = universes; // Save current game sate result
    return universes
  }
  
  const universes = play([0, 0], positions);

  console.log(`The player win in ${Math.max(...universes)} universes`);

  return
});
