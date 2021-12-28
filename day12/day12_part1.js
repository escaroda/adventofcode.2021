const fs = require('fs');
const path = require("path");


fs.readFile(path.resolve(__dirname, './input'), 'utf8', (err, data) => {
  if (err) return console.error(err);

  const energyLevels = data.trim().split('\n');
  
  console.log(``)

  return
});
