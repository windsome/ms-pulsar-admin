import _debug from 'debug';
const debug = _debug('app:config');
import fs from 'fs';
export function getCfgPath() {
  return process.env.CFG_PATH || __dirname + '/cfg';
}

// const {resolve} = require('path')
// console.log('__dirname : ' + __dirname)
// console.log('resolve   : ' + resolve('./'))
// console.log('cwd       : ' + process.cwd())

// const base_cfg_folder = '/data/locker-apis/config/';
const base_cfg_folder = getCfgPath();
console.log('cfg folder:', base_cfg_folder);

const cfg_file_path = base_cfg_folder + '/config.json';
// init config.json
let config = null;
try {
  config = JSON.parse(fs.readFileSync(cfg_file_path));
} catch (error) {
  debug('error!', error);
}
if (!config) {
  debug('fatal error! no config!');
}

export const getConfig = key => {
  if (!key) return null;
  let attrArr = key.split('.');

  let data = null;
  let subitem = config;
  for (let i = 0; i < attrArr.length; i++) {
    let attr = attrArr[i];
    if (i == attrArr.length - 1) {
      data = subitem && subitem[attr];
      break;
    }
    subitem = subitem && subitem[attr];
  }
  return data;
};

export default config;
