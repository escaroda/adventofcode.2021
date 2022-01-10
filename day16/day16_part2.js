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

  getPacket = () => {
    const packet = {};
    packet.version = parseBits();
    packet.id = parseBits();

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

  const packet = getPacket();

  const evaluatePacket = (packet) => {
    switch (packet.id) {
      case 0:
        let sum = 0;
        while (packet.subPackets.length) {
          const subPacket = packet.subPackets.pop();
          sum += evaluatePacket(subPacket);
        }
        return sum;
      case 1:
        let product = 1;
        while (packet.subPackets.length) {
          const subPacket = packet.subPackets.pop();
          product *= evaluatePacket(subPacket);
        }
        return product
      case 2:
        let min = Number.POSITIVE_INFINITY;
        while (packet.subPackets.length) {
          const subPacket = packet.subPackets.pop();
          const evaluatedPacket = evaluatePacket(subPacket);
          if (evaluatedPacket < min) min = evaluatedPacket;
        }
        return min
      case 3:
        let max = Number.NEGATIVE_INFINITY;
        while (packet.subPackets.length) {
          const subPacket = packet.subPackets.pop();
          const evaluatedPacket = evaluatePacket(subPacket);
          if (evaluatedPacket > max) max = evaluatedPacket;
        }
        return max
      case 4:
        return packet.value;
      case 5:
        if (packet.subPackets.length !== 2) throw new Error(`Wrong sub-packets length`);
        return evaluatePacket(packet.subPackets[0]) > evaluatePacket(packet.subPackets[1]) ? 1 : 0;
      case 6:
        if (packet.subPackets.length !== 2) throw new Error(`Wrong sub-packets length`);
        return evaluatePacket(packet.subPackets[0]) < evaluatePacket(packet.subPackets[1]) ? 1 : 0;
      case 7:
        if (packet.subPackets.length !== 2) throw new Error(`Wrong sub-packets length`);
        return evaluatePacket(packet.subPackets[0]) === evaluatePacket(packet.subPackets[1]) ? 1 : 0;
      default:
        throw new Error ('Wrong packet ID');
    }
  }

  console.log(`Evaluated expression represented by hexadecimal-encoded BITS transmission is equal to ${evaluatePacket(packet)}`)

  return
});
