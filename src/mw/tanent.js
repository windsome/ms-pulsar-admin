import _debug from 'debug';
const debug = _debug('app:mw');
import Errcode, { EC } from '../Errcode';
import token_create from './adminApi/jwt';
import permission_create from './adminApi/permission_grant';
import namespace_create from './adminApi/namespace_create';
import tenant_create from './adminApi/tenant_create';

export function init(cfg) {
  return async function() {
    let uid = 'msgpush';
    // 创建tenant=role=msgpush
    let result = null;
    try {
      result = await tenant_create(cfg)(uid);
      debug('create1', result);
    } catch (error) {
      if (error.errcode !== EC.ERR_PULSAR_OP_CONFLICT) {
        debug('error! 非冲突错误,退出!');
        throw error;
      }
      debug('tenant已经存在', uid);
    }
  };
}

export function create(cfg) {
  /**
   * 根据user._id创建在pulsar中相关内容.
   */
  return async function(uid) {
    // 创建tenant=role=uid
    let result = null;
    try {
      result = await tenant_create(cfg)(uid);
      debug('create1', result);
    } catch (error) {
      if (error.errcode !== EC.ERR_PULSAR_OP_CONFLICT) {
        throw error;
      }
      debug('tenant已经存在,继续');
    }

    // 创建namespace
    try {
      result = await namespace_create(cfg)('msgpush', uid);
      debug('create2', result);
    } catch (error) {
      if (error.errcode !== EC.ERR_PULSAR_OP_CONFLICT) {
        throw error;
      }
      debug('namespace已经存在,继续');
    }

    // 关联permission
    result = await permission_create(cfg)('msgpush', uid, uid, ['consume']);
    debug('create3', result);

    // 创建token
    result = token_create(uid, cfg.tokenSecretKeyBase64);
    debug('create4', result);
    return result;
  };
}
