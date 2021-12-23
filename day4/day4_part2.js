fs = require('fs');


const getBoardScore = (board, boardNumber) => {
  console.log('boardNumber: ', boardNumber)
  const sumOfUnmarked = board.reduce((previousValue, currentValue) => {
    const currentSum = currentValue.reduce((previousValue, currentValue) => {
      if (currentValue) previousValue += parseInt(currentValue, 10)
      return previousValue
    }, 0)
    return previousValue + currentSum
  }, 0);

  boardNumber = parseInt(boardNumber, 10);
  // console.log(sumOfUnmarked, boardNumber)

  return sumOfUnmarked * boardNumber
}

const getLastWinnerScore = (numbers, boards) => {
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

  let lastWinnerScore = 0;

  for (const randomNumber of numbers) {
    if (boards.length === 0) return lastWinnerScore;

    boardsLoop:
    for (let i = 0; i < boards.length; i++) {
      const board = boards[i];
      if (board) {
        for (let j = 0; j < board.length; j++) {
          const row = board[j];
          for (let k = 0; k < row.length; k++) {
            const boardNumber = row[k];
            const boardScore = scores[i];

            if (boardNumber && boardNumber === randomNumber) {
              if (!boardScore.rows[j]) boardScore.rows[j] = [];
              boardScore.rows[j].push(boardNumber);

              if (!boardScore.columns[k]) boardScore.columns[k] = [];
              boardScore.columns[k].push(boardNumber);

              row[k] = null; // remove marked board number

              for (const rowScore of boardScore.rows) {
                if (rowScore && rowScore.length === numberOfRows) {
                  lastWinnerScore = getBoardScore(board, boardNumber);
                  boards[i] = null; // remove board
                  continue boardsLoop;
                }
              }

              for (const columnScore of boardScore.columns) {
                if (columnScore && columnScore.length === numberOfColumns) {
                  lastWinnerScore = getBoardScore(board, boardNumber);
                  boards[i] = null; // remove win board
                  continue boardsLoop;
                }
              }
            }
          }
        }
      }
    }
  }

  return lastWinnerScore
}

fs.readFile('input', 'utf8', function (err, data) {
  if (err) {
    return console.log(err);
  }

  const parsedData = data.trim().split('\n\n');
  const numbers = parsedData.shift().split(',');
  const boards = parsedData.map(board => board.split('\n').map(row => row && row.trim().split(/ +/)));

  console.log('last board\'s final score: ', getLastWinnerScore(numbers, boards));

  return
});
