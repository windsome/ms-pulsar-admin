// 参考:https://www.jianshu.com/p/1ce154b4bdbe
let forbidMap = {};

export const buildForbidMap = wordList => {
  const result = {};

  wordList = wordList || sensitiveWords;
  for (let i = 0, len = wordList.length; i < len; ++i) {
    let map = result;
    const word = wordList[i];
    for (let j = 0; j < word.length; ++j) {
      const ch = word.charAt(j);
      if (map[ch]) {
        map = map[ch];
        if (map['empty']) {
          break;
        }
      } else {
        if (map['empty']) {
          delete map['empty'];
        }
        map[ch] = { empty: true };
        map = map[ch];
      }
    }
  }
  forbidMap = result;
  return result;
};

export const check = (map, content) => {
  const result = [];
  let stack = [];
  let point = map;
  for (let i = 0, len = content.length; i < len; ++i) {
    const ch = content.charAt(i);
    const item = point[ch];
    if (!item) {
      i = i - stack.length;
      stack = [];
      point = map;
    } else if (item['empty']) {
      stack.push(ch);
      result.push(stack.join(''));
      stack = [];
      point = map;
    } else {
      stack.push(ch);
      point = item;
    }
  }
  return result;
};

function testSensitiveWords(sensitiveWords, content) {
  var map = buildForbidMap(sensitiveWords);
  var begin = new Date();
  var words = check(map, content);
  console.log(new Date() - begin);
  console.log(words);
}

export const forbidReplace = text => {
  let wordMap = forbidMap;
  let result = text;
  let words = check(wordMap, text);
  for (let i = 0; i < words.length; i++) {
    let word = words[i];
    let xxx = [...Array(word.length)].map(() => '*').join('');
    console.log('forbidReplace', word, word.length, xxx, text);
    // 创建一个正则表达式
    let r = new RegExp(word, 'ig');
    result = result.replace(r, xxx);
  }
  return result;
};

const sensitiveWords = [
  '法轮功',
  '杜冷丁',
  '海洛因',
  'heroi',
  'cocai',
  'k粉',
  '冰毒',
  '爱他死',
  '安非他命',
  '吗啡',
  '摇头丸',
  '毛泽东',
  '江泽民',
  '胡锦涛',
  '习近平',
  '周恩来',
  '温家宝',
  '邓小平',
  '藏独',
  '退党',
  '法轮大法',
  '刘少奇',
  '董必武',
  '宋庆龄',
  '李先念',
  '杨尚昆',
  '华国锋',
  '李鹏',
  '朱镕基',
  '朱德',
  '叶剑英',
  '吴邦国',
  '罢免党',
  '罢免党员',
  '爱液',
  '按摩棒',
  '被操',
  '被插',
  '被干',
  '操死',
  '操我',
  '插进',
  '插你',
  '插我',
  'a片',
  '18禁',
  '强奸',
  '奸杀',
  '奸污',
  '奶子',
  '内射',
  '群交',
  '日逼',
  '肉棒',
  '肉洞',
  '肉棍',
  '肉具',
  '肉穴',
  '肉欲',
  '乳交',
  '乳头',
  '骚女',
  '色逼',
  '色b',
  '兽交',
  '爽片',
  '吃精',
  '春药',
  '荡妇',
  '口交',
  '乱交',
  '乱伦',
  '轮暴',
  '轮奸',
  '淫水',
  '舔脚',
  '小穴',
  '迷奸',
  '蜜穴',
  '肛交',
  '鸡巴',
  '鸡奸',
  '妓女',
  '奸情',
  '脚交',
  '精液',
  '菊花洞',
  '巨乳',
  '菊穴',
  '台独',
  '台湾独立',
  '达赖',
  '迷药',
  '南京大屠杀',
  '咖啡因',
  '李克强',
  '张德江',
  '刘云山',
  '王岐山',
  '李长春',
  '胡耀邦',
  '李洪志',
  '明慧网',
  '网银',
  '银行',
  '农行',
  '招行',
  '建行',
  '工行',
  '中行',
  '交行',
  '广发',
  '浦发',
  '账号',
  '卡号',
  '充值',
  '转账',
  '转钱',
  '充话费',
  '支付宝',
  '微信支付',
  '汇款',
  '打款',
  'QQ钱包',
  '百度钱包'
];
