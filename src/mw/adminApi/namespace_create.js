import _debug from 'debug';
const debug = _debug('app:adminApi');
import Errcode, { EC } from '../../Errcode';
import _commonFetchWrap from './_commonFetch';

export default function namespace_create(cfg) {
  /**
   * ('msgpush','user_id')
   */
  return function(tenant, namespace) {
    let url = `/admin/v2/namespaces/${tenant}/${namespace}`;
    return _commonFetchWrap(cfg)(url, {
      method: 'PUT',
      body: ''
    });
  };
}
