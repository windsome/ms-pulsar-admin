/**
 * @description
 * 构造敏感词map
 * @private
 * @returns
 */
export const makeSensitiveMap = sensitiveWordList => {
  // 构造根节点
  const result = new Map();
  for (const word of sensitiveWordList) {
    let map = result;
    for (let i = 0; i < word.length; i++) {
      // 依次获取字
      const char = word.charAt(i);
      // 判断是否存在
      if (map.get(char)) {
        // 获取下一层节点
        map = map.get(char);
      } else {
        // 将当前节点设置为非结尾节点
        if (map.get('laster') === true) {
          map.set('laster', false);
        }
        const item = new Map();
        // 新增节点默认为结尾节点
        item.set('laster', true);
        map.set(char, item);
        map = map.get(char);
      }
    }
  }
  return result;
};

/**
 * @description
 * 检查敏感词是否存在
 * @private
 * @param {any} txt
 * @param {any} index
 * @returns
 */
export const checkSensitiveWord = (sensitiveMap, txt, index) => {
  let currentMap = sensitiveMap;
  let flag = false;
  let wordNum = 0; //记录过滤
  let sensitiveWord = ''; //记录过滤出来的敏感词
  for (let i = index; i < txt.length; i++) {
    const word = txt.charAt(i);
    currentMap = currentMap.get(word);
    if (currentMap) {
      wordNum++;
      sensitiveWord += word;
      if (currentMap.get('laster') === true) {
        // 表示已到词的结尾
        flag = true;
        break;
      }
    } else {
      break;
    }
  }
  // 两字成词
  if (wordNum < 2) {
    flag = false;
  }
  return { flag, sensitiveWord };
};

export const forbidReplace = (wordList, text) => {
  var arrMg = ['fuck', 'tmd', '他妈的'];

  // 显示的内容--showContent
  var showContent = inputContent;

  // 正则表达式 \d 匹配数字
  for (let i = 0; i < wordList.length; i++) {
    // 创建一个正则表达式
    var r = new RegExp(arrMg[i], 'ig');
    showContent = showContent.replace(r, '*');
  }
  // 显示的内容--showInput
  showInput.value = showContent;
};
