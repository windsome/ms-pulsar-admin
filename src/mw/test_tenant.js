require('babel-register');

let init = require('./tanent').init;
let create = require('./tanent').create;
let cfg = require('../cfg/config.json');

async function main() {
  await init(cfg.pulsar)();
  await create(cfg.pulsar)('20210404001');
}

main();
