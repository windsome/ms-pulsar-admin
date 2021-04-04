/**
 * 生成随机激活码, 10个字符长
 * 算法:
 * 获取以毫秒为单位的时间戳 timestamp = 1544717753370, 目前为13位.
 * 将timestamp转化为字符串,前后各加一个1~9的随机数,得到715447177533708,然后翻转得到807335771744517,并转化为整数
 * 获得字典dict的位数,作为进制转化的进制值,这里是43,可以理解成10进制,16进制的进制.
 * 进制转化获得每一位用字典中字符表示的内容
 * 不足10时,前面用字典的末尾来补充.一般最多补充ty
 * @param {*} timestamp
 */
export const genActivateCode = timestamp => {
  // 在timestamp前后各加一个1~9之间的数字后倒序生成一个整数,保证这个整数不重复.因为timestamp然不一样.
  if (!timestamp) timestamp = new Date().getTime();
  let randCode1 = (parseInt(Math.random() * 100) % 9) + 1;
  let randCode2 = (parseInt(Math.random() * 100) % 9) + 1;
  // let dict = '123456789ABCDEFGHJKMNPRSTUVWXY';
  let dict = '123456789ABCDEFGHJKMNPRSTUVWXYacdefghjmnrty';
  let dictlen = dict.length;
  timestamp = timestamp + '';
  let value = randCode1 + timestamp.substr(-13) + randCode2; // 十进制值字符串,
  value = value
    .split('')
    .reverse()
    .join('');
  value = parseInt(value, 10);

  let result = '';
  let tmpValue = value;
  while (tmpValue > 0) {
    let cindex = tmpValue % dictlen;
    let tchar = dict.charAt(cindex);
    tmpValue = parseInt(tmpValue / dictlen);
    result = tchar + result;
  }
  let finalResult = (dict + result).substr(-10);
  // console.log({finalResult, result, value, timestamp});
  // if (finalResult.length != result.length) {
  //     console.log('diff', finalResult.length-result.length, {finalResult, result, value, timestamp});
  // }
  return finalResult;
};

/**
 * 获取9位随机state,用于oauth认证
 * 算法同上.
 * @param {*} timestamp
 */
export const genRandomState = timestamp => {
  // 在timestamp前后各加一个1~9之间的数字后倒序生成一个整数,保证这个整数不重复.因为timestamp然不一样.
  if (!timestamp) timestamp = new Date().getTime();
  let randCode1 = (parseInt(Math.random() * 100) % 9) + 1;
  // let randCode2 = parseInt(Math.random() * 100)%9+1;
  // let dict = '123456789ABCDEFGHJKMNPRSTUVWXY';
  let dict = '1234567890ABCDEFGHIJKLMNOPRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  let dictlen = dict.length;
  timestamp = timestamp + '';
  let value = randCode1 + timestamp.substr(-13); // 十进制值字符串,
  value = value
    .split('')
    .reverse()
    .join('');
  value = parseInt(value, 10);

  let result = '';
  let tmpValue = value;
  while (tmpValue > 0) {
    let cindex = tmpValue % dictlen;
    let tchar = dict.charAt(cindex);
    tmpValue = parseInt(tmpValue / dictlen);
    result = tchar + result;
  }
  let finalResult = (dict + result).substr(-8);
  // console.log({finalResult, result, value, timestamp});
  // if (finalResult.length != result.length) {
  //     console.log('diff', finalResult.length-result.length, {finalResult, result, value, timestamp});
  // }
  return finalResult;
};
