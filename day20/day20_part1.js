const fs = require('fs');
const path = require("path");


fs.readFile(path.resolve(__dirname, './input'), 'utf8', (err, data) => {
  if (err) return console.error(err);

  const [ line1, line2 ] = data.trim().split('\n\n');

  console.log(line1);
  console.log(line2);

  return
});
