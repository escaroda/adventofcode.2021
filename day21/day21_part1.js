const fs = require('fs');
const path = require("path");


const WIN_SCORE = 1000;
const DICE_RANGE = 100;
const BOARD_LENGTH = 10;
const ROLL_TIMES = 3;

const rollDice = (gameState) => {
  let move = 0;
  for (let i = 0; i < ROLL_TIMES; i++) {
    gameState.rolledTimes++;
    move += (gameState.rolledTimes - 1) % DICE_RANGE + 1;
  }
  return move
}

const getPosition = (position, move) => (position - 1 + move) % BOARD_LENGTH + 1;


fs.readFile(path.resolve(__dirname, './input'), 'utf8', (err, data) => {
  if (err) return console.error(err);

  const positions = data.trim().split('\n').map(line => parseInt(line[line.length -1], 10));
  const scores = [0, 0]; // [player1, player2]

  const gameState = {
    rolledTimes: 0,
  };

  let noWinner = true;
  while (noWinner) {
    for (const player in positions) {
      const position = positions[player];
      const move = rollDice(gameState);
      positions[player] = getPosition(position, move);
      scores[player] += positions[player];

      if (scores[player] >= WIN_SCORE) {
        noWinner = false;
        break;
      }
    }
  }

  const losingScore = Math.min(...scores);
  
  console.log(`Result: ${losingScore * gameState.rolledTimes}`);

  return
});
