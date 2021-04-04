import 'isomorphic-fetch';
import _debug from 'debug';
const debug = _debug('app:adminApi:_commonFetch');
import Errcode, { EC } from '../../Errcode';
/**
  cfg: {
    "url": "http://pulsar:8080",
    "tokenSecretKeyBase64": "4hVFTHInIEwS4b545UpVWghv6njne1FsqMJRo4FG5O8=",
    "adminRole": "test-user",
    "adminJwt": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0ZXN0LXVzZXIifQ.KCepkApIwUV3rDgnI7hqKk6Xv3I3rRBZCwtKWkQSIGw"
  }
 * @param {*} cfg 
 * @returns 
 */
export function _commonFetchWrap(cfg) {
  return async function _commonFetch(url, options) {
    // {device, content: {[属性名]:[属性值]}}
    // 判断参数
    let { method, headers } = options || {};
    if (!method) {
      throw new Errcode(`没有method参数`, EC.ERR_PARAM_ERROR);
    }
    if (!headers) {
      headers = {};
    }

    let baseUrl = cfg.url;
    let adminJwt = cfg.adminJwt;

    headers = {
      ...headers,
      'User-Agent': 'node/12.13.0',
      'Content-Type': `application/json`,
      Accept: `application/json`,
      Authorization: 'Bearer ' + adminJwt
    };

    let opts = {
      ...(options || {}),
      headers
    };
    return fetch(baseUrl + url, opts)
      .catch(error => {
        debug('error', url, opts, error);
        throw new Errcode(
          `网络请求失败!url=${url},error=${error.message}`,
          EC.ERR_PULSAR_NETWORK_FAIL
        );
      })
      .then(response => {
        if (!response.ok) {
          debug('error', url, response.status, response.statusText);
          if (response.status == 409) {
            throw new Errcode(
              `请求失败!url=${url},code=${response.status},error=${response.statusText}`,
              EC.ERR_PULSAR_OP_CONFLICT
            );
          }
          throw new Errcode(
            `请求失败!url=${url},code=${response.status},error=${response.statusText}`,
            EC.ERR_PULSAR_NETWORK_FAIL
          );
        }

        if (response.status == 204) {
          return null;
        }

        const contentType = response.headers.get(`content-type`);
        if (!contentType.includes('application/json')) {
          return { _response: response };
        }
        return response.json();
      });
  };
}

export default _commonFetchWrap;
