require('babel-register');
let JobQueue = require('../jobQueue').default;
let sleep = require('../sleep').default;

const test = async obj => {
  let { id, count } = obj;
  console.log('test:' + id + ', count:', count);
  for (let i = 0; i < count; i++) {
    await sleep(1000);
    console.log('id:' + id + ', sleep:' + i);
  }
};

const testAnother = async obj => {
  let { id, count } = obj;
  console.log('testAnother:' + id + ', count:', count);
  for (let i = 0; i < count; i++) {
    await sleep(1000);
    console.log('id:' + id + ', sleep:' + i);
  }
};

/**
 * 传参数的方式
 */
const main = async () => {
  console.log('main start');
  try {
    JobQueue.addActions(['testsleep']);

    for (let j = 0; j < 10; j++) {
      console.log('job:' + j);
      await sleep(500);
      let job = await JobQueue.addJob('testsleep', test, { id: j, count: 10 });
    }
    sleep(100 * 1000);
  } catch (error) {
    console.log('main: error: ', error);
  }
};

/**
 * 封装async函数，不用带参数的调用方式
 */
const main2 = async () => {
  console.log('main start');
  try {
    JobQueue.addActions(['testsleep']);

    for (let j = 0; j < 10; j++) {
      console.log('job:' + j);
      await sleep(500);
      let func = async () => test({ id: j, count: 10 });
      if (j % 3) func = async () => await testAnother({ id: j, count: 10 });
      let job = await JobQueue.addJob('testsleep', func);
    }
    sleep(100 * 1000);
  } catch (error) {
    console.log('main: error: ', error);
  }
};

main2().then(ret => {});
