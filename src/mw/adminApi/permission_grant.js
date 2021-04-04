import _debug from 'debug';
const debug = _debug('app:adminApi');
import Errcode, { EC } from '../../Errcode';
import _commonFetchWrap from './_commonFetch';
import type from '../../utils/type';

export default function permissions_create(cfg) {
  /**
   * ('msgpush','user_id','user_id', [consume])
   */
  return function(tenant, namespace, role, permissions) {
    let url = `/admin/v2/namespaces/${tenant}/${namespace}/permissions/${role}`;

    let type1 = type(permissions);
    if (type1 == 'string') {
      permissions = [permissions];
    }

    return _commonFetchWrap(cfg)(url, {
      method: 'POST',
      body: JSON.stringify(permissions)
    });
  };
}
