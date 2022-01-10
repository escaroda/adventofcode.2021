const fs = require('fs');
const path = require("path");


const BINARY_DATA_BIT_LENGTH = 4;

fs.readFile(path.resolve(__dirname, './input'), 'utf8', (err, data) => {
  if (err) return console.error(err);

  const transmission = data.trim().split('');

  // Get bits from hex
  let bits = '';
  for (const hex of transmission) {
    bits += parseInt(hex, 16).toString(2).padStart(BINARY_DATA_BIT_LENGTH, '0');
  }

  // Parse bits
  const state = { pointer: 0 }
  parseBits = (length = 3) => parseInt(bits.slice(state.pointer, state.pointer += length), 2);

  let versionSum = 0;

  getPacket = () => {
    const packet = {};
    packet.version = parseBits();
    packet.id = parseBits();
    
    versionSum += packet.version;

    if (packet.id !== 4) { // operator
      packet.subPackets = [];
      
      const lengthTypeID = parseBits(1);
      if (lengthTypeID) {
        let numberOfSubPackets = parseBits(11);
        while (numberOfSubPackets) {
          packet.subPackets.push(getPacket())
          numberOfSubPackets--;
        }
      } else {
        const lengthOfSubPackets = parseBits(15);
        const endPoint = state.pointer + lengthOfSubPackets;
        while (state.pointer < endPoint) {
          packet.subPackets.push(getPacket())
        }
      }
    } else { // literal value
      let binaryNumber = '';
      while (parseBits(1)) { // check if not the last group
        binaryNumber += bits.slice(state.pointer, state.pointer += 4);
      }
      binaryNumber += bits.slice(state.pointer, state.pointer += 4);
      packet.value = parseInt(binaryNumber, 2);
    }
    return packet;
  }

  getPacket()

  console.log(`The sum of all version numbers is ${versionSum}`);

  return
});
