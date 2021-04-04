require('babel-register');

let init = require('./tanent').init;
let create = require('./tanent').default;
let cfg = require('../cfg/config.json');

async function main() {
  await init(cfg.pulsar)();
  await create(cfg.pulsar)('11111');
}

main();
