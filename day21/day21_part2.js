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
const uniqueMoves = [...new Set(reducedMoves)];

const getMoveRatio = (moves) => {
  const ratio = {};
  for (const move of moves) {
    if (!ratio[move]) ratio[move] = 0;
    ratio[move] += 1;
  }
  return ratio
}
const moveRatio = getMoveRatio(reducedMoves);

const getCacheKey = ([s1, s2], [p1, p2]) => `${s1}-${s2}-${p1}-${p2}`; // There are ~21*21*10*10 possible game states


fs.readFile(path.resolve(__dirname, './input'), 'utf8', (err, data) => {
  if (err) return console.error(err);

  const positions = data.trim().split('\n').map(line => parseInt(line[line.length -1], 10));

  const cache = {};
  const play = (scores, positions) => {

    if (scores[0] >= WIN_SCORE) return [1, 0];
    if (scores[1] >= WIN_SCORE) return [0, 1];

    const cacheKey = getCacheKey(scores, positions);
    if (cache[cacheKey]) return cache[cacheKey];

    let universes = [0, 0];
    for (const move of uniqueMoves) {
      const cScores = [...scores];
      const cPositions = [...positions];

      // 1st player move
      cPositions[0] = getPosition(cPositions[0], move);
      cScores[0] += cPositions[0];

      const [u1, u2] = play(cScores.reverse(), cPositions.reverse()); // Swap players to make a move for another player
      universes[0] += u2 * moveRatio[move];                           // But swap back the results
      universes[1] += u1 * moveRatio[move];
    }
    cache[cacheKey] = universes;
    return universes
  }
  
  const universes = play([0, 0], positions);

  console.log(`The player win in ${Math.max(...universes)} universes`);

  return
});
