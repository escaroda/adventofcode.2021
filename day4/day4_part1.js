const fs = require('fs');
const path = require("path");


const getWinner = (numbers, boards) => {
  const numberOfRows = boards[0].length;
  const numberOfColumns = boards[0][0].length;

  // Construct
  const scores = new Array(boards.length);
  for (let i = 0; i < boards.length; i++) {
    scores[i] = { 
      rows: [], 
      columns: [] 
    };
  }

  // Find
  for (const randomNumber of numbers) {
  
    for (let i = 0; i < boards.length; i++) {
      const board = boards[i];
      for (let j = 0; j < board.length; j++) {
        const row = board[j];
        for (let k = 0; k < row.length; k++) {
          const boardNumber = row[k];
          const boardScore = scores[i];

          if (boardNumber === randomNumber) {
            if (!boardScore.rows[j]) boardScore.rows[j] = [];
            boardScore.rows[j].push(boardNumber);

            if (!boardScore.columns[k]) boardScore.columns[k] = [];
            boardScore.columns[k].push(boardNumber);

            row[k] = '';
          }

          // Check score
          for (const rowScore of boardScore.rows) {
            if (rowScore && rowScore.length === numberOfRows) return { board, boardNumber }
          }

          for (const columnScore of boardScore.columns) {
            if (columnScore && columnScore.length === numberOfColumns) return { board, boardNumber }
          }
        }
      }
    }
  }

  throw Error('No winners')
}

fs.readFile(path.resolve(__dirname, './input'), 'utf8', (err, data) => {
  if (err) return console.error(err);

  const parsedData = data.trim().split('\n\n');
  const numbers = parsedData.shift().split(',');
  const boards = parsedData.map(board => board.split('\n').map(row => row && row.trim().split(/ +/)));

  const winner = getWinner(numbers, boards);

  const sumOfUnmarked = winner.board.reduce((previousValue, currentValue) => {
    const currentSum = currentValue.reduce((previousValue, currentValue) => {
      if (currentValue) previousValue += parseInt(currentValue)
      return previousValue
    }, 0)
    return previousValue + currentSum
  }, 0);

  const boardNumber = parseInt(winner.boardNumber);

  console.log('boardNumber: ', boardNumber);
  console.log('sumOfUnmarked: ', sumOfUnmarked);
  console.log('final score: ', boardNumber * sumOfUnmarked);

  return
});
