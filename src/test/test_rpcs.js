'use strict';
require('babel-register');
let jaysonClient = require('../utils/jaysonClient');
let init = jaysonClient.init;
let $rpc = jaysonClient.$rpc;
let config = require('../config').default;
const port = config.server_port || 3000;

async function test1() {
  let ret = null;

  ret = await $rpc('simulator').updateDevice('5ffd331a2222222222000003', {
    desc: {
      deviceName: '报警器1',
      brief: '发送消息给windsome',
      config_1: JSON.stringify({
        phone: '13661989491',
        sms: '13661989491',
        name: 'windsome'
      }),
      content: JSON.stringify({
        phone: '电话通知设备报警',
        sms: '短信通知设备报警',
        weixin: '微信通知报警'
      }),
      interval_1: 60,
      switch_1: true
    }
  });
  console.log('报警器 updateDevice:', ret);

  ret = await $rpc('simulator').updateDevice('5ffd331a2222222222000004', {
    desc: {
      deviceName: '报警器1',
      brief: '发送消息给windsome',
      config_1: JSON.stringify({
        phone: '13661989491',
        sms: '13661989491',
        name: 'windsome'
      }),
      interval_1: 600,
      switch_1: true
    }
  });
  console.log('报警器 updateDevice:', ret);
}

async function test2() {
  let ret = null;

  ret = await $rpc('simulator').createCommand({
    product: '5ffd331a1111111111000002',
    device: '5ffd331a2222222222000003',
    desc: {
      content: {
        dataType: 1,
        payload: {
          config_1: JSON.stringify({
            phone: '13661989491',
            sms: '13661989491',
            name: 'windsome'
          }),
          interval_1: 600,
          switch_1: true
        }
      }
    }
  });
  console.log('报警器 createCommand:', ret);
  ret = await $rpc('simulator').createCommand({
    product: '5ffd331a1111111111000002',
    device: '5ffd331a2222222222000003',
    desc: {
      content: {
        dataType: 1,
        payload: {
          content: JSON.stringify({
            phone: '电话通知设备报警',
            sms: '短信通知设备报警',
            weixin: '微信通知报警'
          })
        }
      }
    }
  });
  console.log('报警器 createCommand:', ret);
}

async function test3() {
  let ret = null;

  ret = await $rpc('simulator').createCommand({
    device: '5ffd331a2222222222000001',
    desc: {
      content: {
        dataType: 1,
        payload: {
          // config_1: JSON.stringify({phone: '13661989491', sms:'13661989491', name:'windsome'}),
          interval_1: 30
          // switch_1: true
        }
      }
    }
  });
  console.log('定时器 createCommand:', ret);
}

async function main() {
  try {
    init({
      simulator: {
        ops: ['createDevice', 'updateDevice', 'removeDevice', 'createCommand'],
        port: 3109
      }
    });
    await test1();
  } catch (error) {
    console.error('get error:', error);
  }
}

main();
