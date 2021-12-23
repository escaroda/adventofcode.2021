const fs = require('fs');
const path = require("path");

fs.readFile(path.resolve(__dirname, './input'), 'utf8', (err, data) => {
  if (err) return console.error(err);

  let aim = 0;
  let position = 0;
  let depth = 0;
  const commands = data.split('\n');
  commands.pop();
  console.log(commands.length, ' commands');

  for (const command of commands) {
    const [commandType, commandValue] = command.split(' ');
    const parsedValue = parseInt(commandValue);
    switch (commandType) {
      case 'up':
        aim -= parsedValue;
        break;
      case 'down':
        aim += parsedValue;
        break;
      case 'forward':
        position += parsedValue;
        depth += aim * parsedValue;
        break;
    }
  }

  console.log('depth: ', depth, ', position: ', position, ' sum: ', depth * position);
  return
});
