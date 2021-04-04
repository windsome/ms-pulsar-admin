import _debug from 'debug';
const debug = _debug('app:init');
import config from './config';
// import { init as jaysonClientInit } from './utils/jaysonClient';
import { init as initTanent } from './mw/tanent';
export default async function init() {
  // debug('初始化依赖的微服务');
  // jaysonClientInit(config.ms);

  debug('初始化tanent');
  await initTanent(config.pulsar)();

  debug('初始化完成');
}
