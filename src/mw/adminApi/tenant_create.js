import _debug from 'debug';
const debug = _debug('app:adminApi');
import Errcode, { EC } from '../../Errcode';
import _commonFetchWrap from './_commonFetch';
import type from '../../utils/type';

export default function tenant_create(cfg) {
  return function(tenant, clusters) {
    let url = `/admin/v2/tenants/${tenant}`;
    if (!clusters) {
      clusters = ['standalone'];
    } else {
      let typeclusters = type(clusters);
      if (typeclusters == 'string') {
        clusters = [clusters];
      }
    }
    let body = {
      adminRoles: [tenant],
      allowedClusters: clusters
    };
    return _commonFetchWrap(cfg)(url, {
      method: 'PUT',
      body: JSON.stringify(body)
    });
  };
}
