import _debug from 'debug';
const debug = _debug('app:jrpcserver');
import 'isomorphic-fetch';
import { EM } from './Errcode';
import { default as ops } from './mw';

function wrapOps() {
  let result = {};
  let names = Object.getOwnPropertyNames(ops);
  for (let i = 0; i < names.length; i++) {
    let name = names[i];
    let func = ops[name];
    result[name] = async function(args) {
      try {
        debug(`run ${name}:`, JSON.stringify(args));
        return await func(...args);
      } catch (e) {
        let errcode = e.errcode || -1;
        let message = '';
        let xOrigMsg = '';
        if (e.xOrigMsg) {
          // 表示之前的错误消息已经做过转换,不需要再转换.
          message = e.message;
          xOrigMsg = e.xOrigMsg;
        } else {
          message = EM[errcode] || e.message || '未知错误';
          xOrigMsg = e.xOrigMsg || e.message;
        }
        debug(
          `error ${name}:`,
          JSON.stringify({ errcode, message, xOrigMsg }),
          e
        );
        return { errcode, message, xOrigMsg };
      }
    };
  }
  return result;
}

// 创建services
export default function createService() {
  return wrapOps();
}
