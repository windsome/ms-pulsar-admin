require('babel-register');

let result = 0;

let arr = [];

function method1() {
  for (let i = 0; i < 50; i++) {
    arr.push(0);
  }

  for (let i = 0; i < 100; i++) {
    let n = parseFloat((100 / 100) * i);
    arr.push(n);
  }

  for (let i = 0; i < 50; i++) {
    arr.push(100);
  }
}

function method2() {
  let maxSpeed = 100;
  for (let i = 0; i < 150; i++) {
    let n = parseFloat((maxSpeed / 150) * i);
    arr.push(n);
  }
}

function method3() {
  for (let i = 0; i < 50; i++) {
    arr.push(0);
  }

  for (let i = 0; i < 50; i++) {
    let n = parseFloat((100 / 50) * i);
    arr.push(n);
  }

  for (let i = 0; i < 50; i++) {
    arr.push(100);
  }
}

method3();
let t1 = new Date().getTime();
let fullspeed = 0;
for (let i = 0; i < arr.length; i++) {
  fullspeed += arr[i];
}
let avspeed = fullspeed / arr.length;

for (let i = 0; i < arr.length; i++) {
  result += (avspeed - arr[i]) * (avspeed - arr[i]);
}
let t2 = new Date().getTime();
console.log('result:', t2 - t1, result, Math.pow(result, 0.5));

// result: { result: 125011.1111111111, result1: 124966, result2: 125050 }
