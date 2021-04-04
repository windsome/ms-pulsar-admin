///////////////////////////////////////////////////
// jayson micro service server.
// 见: <https://github.com/tedeh/jayson/blob/master/examples/promise/server.js>
///////////////////////////////////////////////////
require('babel-register');
let packageJson = require('../package.json');
let config = require('./config').default;
let _debug = require('debug');
const debug = _debug('app:index');
let init = require('./init').default;

const jayson = require('jayson/promise');
let createJrpcService = require('./jrpcserver').default;

debug('SOFTWARE VERSION:', packageJson.name, packageJson.version);
debug('CONFIG NAME:', config.name);

init().then(() => {
  const port2 = config.server_port || 3100;
  debug(`JsonRPC Server accessible via tcp://localhost:${port2} `);
  const server2 = jayson.server(createJrpcService());
  server2.tcp().listen(port2);
});
