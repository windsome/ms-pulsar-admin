require('babel-register');
let token_create = require('../jwt').default;

let result = token_create(
  'test-user',
  '4hVFTHInIEwS4b545UpVWghv6njne1FsqMJRo4FG5O8='
);
console.log('result=' + result);
