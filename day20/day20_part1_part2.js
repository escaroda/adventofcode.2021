const fs = require('fs');
const path = require("path");


const SQUARE_PIXEL_LENGTH = 3;
const APPLY_TIMES = 50; // Change this number for Part 1

const mapping = item => item === '#' ? 1 : 0;

const constructImageWithBorder = (input) => {
  const inputWidth = input[0].length;
  const borderLength = SQUARE_PIXEL_LENGTH + APPLY_TIMES;
  const imageWidth = inputWidth + 2 * borderLength;

  const image = [];
  for (let i = 0; i < borderLength; i++) {
    const line = new Array(imageWidth).fill(0);
    image.push(line);
  }
  for (let line of input) {
    const border = new Array(borderLength).fill(0);
    line = [...border, ...line, ...border];
    image.push(line);
  }
  for (let i = 0; i < borderLength; i++) {
    const line = new Array(imageWidth).fill(0);
    image.push(line);
  }

  return image
}

const getSameSizeImage = image => image.map(line => new Array(line.length).fill(0));

const getSquarePixelCoordinates = (i, j) => [ // Around center i, j
  [i - 1, j - 1], [i - 1, j], [i - 1, j + 1],
  [i, j - 1], [i, j], [i, j + 1],
  [i + 1, j - 1], [i + 1, j], [i + 1, j + 1],
];

const evaluateSquarePixel = (image, i, j, enhancement) => { // Returns 0 or 1
  let binaryNumber = '';
  for (const [ii, jj] of getSquarePixelCoordinates(i, j)) {
    binaryNumber += image[ii][jj] ? '1' : '0';
  }
  return enhancement[parseInt(binaryNumber, 2)]
}

const eraseBorderNearEdge = (image) => {
  for (let i = 0; i < image.length; i++) {
    const line = image[i];
    for (let j = 0; j < line.length; j++) {
      if (i < SQUARE_PIXEL_LENGTH || i > image.length - SQUARE_PIXEL_LENGTH - 1 || j < SQUARE_PIXEL_LENGTH || j > line.length - SQUARE_PIXEL_LENGTH - 1) {
        image[i][j] = 0;
      }
    }
  }
}

const getEnhancedImage = (image, enhancement) => {
  let appliedTimes = 1;
  while (appliedTimes <= APPLY_TIMES) {
    const outputImage = getSameSizeImage(image);

    for (let i = 1; i < image.length - 1; i++) {
      const line = image[i];
      for (let j = 1; j < line.length - 1; j++) {
        outputImage[i][j] = evaluateSquarePixel(image, i, j, enhancement);
      }
    }

    image = outputImage;
    if (appliedTimes % 2 === 0) {  // Infinite dark pixels will be inverted after each second enhancement
      eraseBorderNearEdge(image);  // We just need to remove noise on the border caused by fixed image size
    }
    appliedTimes++;
  }
  return image
}

const getPixelsAmount = (image) => {
  let pixelCount = 0;
  for (let i = 0; i < image.length; i++) {
    const line = image[i];
    for (let j = 0; j < line.length; j++) {
      if (line[j]) pixelCount++;
    }
  }
  return pixelCount
}




fs.readFile(path.resolve(__dirname, './input'), 'utf8', (err, data) => {
  if (err) return console.error(err);

  let [ enhancement, input ] = data.trim().split('\n\n');
  enhancement = enhancement.split('').map(mapping);
  input = input.split('\n').map(line => line.split('').map(mapping));

  let image = constructImageWithBorder(input);

  image = getEnhancedImage(image, enhancement);
  
  const pixelCount = getPixelsAmount(image);
  
  console.log(`There are ${pixelCount} pixels lit in the resulting image`);

  return
});
