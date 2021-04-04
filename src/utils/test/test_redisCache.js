require('babel-register');
let {
  keysAsync,
  delAsync,
  setAsync,
  getAsync,
  hmsetAsync,
  hgetallAsync,
  setJsonAsync,
  getJsonAsync
} = require('../redisCache');

const test = async (key, obj) => {
  const res1 = await hmsetAsync('seckill:1', { id: 1, name: '1' });
  const res2 = await hmsetAsync('seckill:2', { id: 2, name: '1' });
  const res3 = await hmsetAsync('seckill:3', { id: 3, name: '1' });
  console.log('set1:', res1, res2, res3);

  let str = JSON.stringify({ id: 1, productId: 1, start: new Date() });
  res1 = await hmsetAsync('mysql:seckill:1', str);
  str = JSON.stringify({ id: 2, productId: 2, start: new Date() });
  res2 = await hmsetAsync('mysql:seckill:2', str);
  console.log('set2:', res1, res2);
  let ret1 = await keysAsync('mysql:seckill:*');

  const res = await hgetallAsync('mysql:seckill:1');
  console.log('res:', JSON.parse(res));
  return res;
};

const testSetGet = async () => {
  let items = [
    { id: 1, productId: 1, start: new Date() },
    { id: 2, productId: 2, start: new Date() },
    { id: 3, productId: 3, start: new Date() },
    { id: 4, productId: 4, start: new Date() },
    { id: 11, productId: 4, start: new Date() },
    { id: 12, productId: 4, start: new Date() },
    { id: 13, productId: 4, start: new Date() }
  ];
  for (let i = 0; i < items.length; i++) {
    let item = items[i];
    let id = item.id;
    let str1 = JSON.stringify(item);
    const res1 = await setAsync('mysql1:seckill:' + id, str1);
    console.log('res' + id + ':', res1);
  }

  const ores1 = await getAsync('mysql1:seckill:1');
  console.log('ores1:', JSON.parse(ores1));

  const keys = await keysAsync('mysql1:seckill:*');
  console.log('keys:', keys);

  const ores2 = await getAsync('mysql1:seckill:14');
  if (!ores2) {
    console.log('error: ores2=null!');
  }
  console.log(
    'ores2:',
    ores2,
    ', parsed:',
    JSON.parse(ores2),
    ', type=',
    typeof ores2
  );
};

const testSetGetJson = async () => {
  let items = [
    { id: 1, productId: 1, start: new Date() },
    { id: 2, productId: 2, start: new Date() },
    { id: 3, productId: 3, start: new Date() },
    { id: 4, productId: 4, start: new Date() },
    { id: 11, productId: 4, start: new Date() },
    { id: 12, productId: 4, start: new Date() },
    { id: 13, productId: 4, start: new Date() }
  ];
  for (let i = 0; i < items.length; i++) {
    let item = items[i];
    let id = item.id;
    const res1 = await setJsonAsync('mysql1:seckill:' + id, item);
    console.log('res' + id + ':', res1);
  }

  const ores1 = await getJsonAsync('mysql1:seckill:1');
  console.log('ores1:', ores1);

  const keys = await keysAsync('mysql1:seckill:*');
  console.log('keys:', keys);

  const ores2 = await getJsonAsync('mysql1:seckill:14');
  if (!ores2) {
    console.log('error: ores2=null!');
  }

  const ores3 = await setJsonAsync('mysql1:seckill:15', null);
  console.log('ores3:', ores3);
};

testSetGetJson().then(ret => {});
//testSetGet().then(ret => {});
//test().then(ret=>{console.log('ret:', ret)});
