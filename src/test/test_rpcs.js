'use strict';
require('babel-register');
let jaysonClient = require('../utils/jaysonClient');
let init = jaysonClient.init;
let $rpc = jaysonClient.$rpc;
let config = require('../config').default;
const port = config.server_port || 3000;

async function test1() {
  let tenant = '5ffd331a2222222222000003';
  let token = await $rpc('pulsarAdmin').createUserToken(tenant);
  console.log(`创建tenant:${tenant}, token=${token}`);
}

async function main() {
  try {
    init({
      pulsarAdmin: {
        ops: ['createUserToken'],
        port
      }
    });
    await test1();
  } catch (error) {
    console.error('get error:', error);
  }
}

main();
