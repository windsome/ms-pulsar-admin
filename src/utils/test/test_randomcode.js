require('babel-register');

var randomcode = require('../randomcode');

for (let i = 0; i < 1000; i++) {
  // randomcode.genActivateCode();
  randomcode.genRandomState();
}
