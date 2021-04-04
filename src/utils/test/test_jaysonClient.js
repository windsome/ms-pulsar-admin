require('babel-register');

let Client = require('../jaysonClient').default;

let wxmpClient = new Client(
  [
    'getAccessToken',
    'getSignPackage',
    'materialCount',
    'getMedia',
    'getMaterials',
    'createTmpQRCode'
  ],
  { port: 3101 }
);

wxmpClient
  .getAccessToken({ test: 'test1' })
  .then(ret => console.log(ret))
  .then(() => wxmpClient.getSignPackage('http://m.h5ren.com/a', { j: 'json' }))
  .then(ret => console.log(ret));
