require('babel-register');
let MqttClient = require('../mqttClient').default;
let sleep = require('../sleep').default;

const receive = (topic, message) => {
  console.log('receive:', topic, message);
};

/**
 * 封装async函数，不用带参数的调用方式
 */
const main2 = async () => {
  console.log('main start');
  try {
    let mc = new MqttClient({
      url: 'mqtt://localhost',
      topic: 'server/#',
      messageCallback: receive
    });
    mc.start();

    for (let j = 0; j < 10; j++) {
      console.log('job:' + j);
      await sleep(500);
      mc.publishJson('server/' + j, { j });
    }
    await sleep(2000);
    mc.end();
    console.log('main end');
  } catch (error) {
    console.log('main: error: ', error);
  }
};

main2().then(ret => {});
