require('babel-register');

let arr = [];

for (let i = 0; i < 5; i++) arr[i] = i;

for (let i = 30; i < 35; i++) arr[i] = i;

console.log('arr.length=' + arr.length, arr);

let arr2 = arr.slice();
console.log('arr2.length=' + arr2.length, arr2);

let sub = arr.slice(30, 35);
console.log('sub:', sub);

let sub2 = arr.slice(20, 25);
console.log('sub2:', sub2);

arr.map(item => {
  console.log('arr.map:', item);
});

console.log('sub2.length=', sub2.length);
sub2.map(item => {
  console.log('sub2.map:', item);
});
