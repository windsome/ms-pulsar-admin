import _debug from 'debug';
const debug = _debug('app:utils:redis');
import redis from 'redis';
import bluebird from 'bluebird';

bluebird.promisifyAll(redis);

export var redisClients = {};
export function initRedis(url, name) {
  if (!name) name = 'default';
  let client = redis.createClient(url);
  redisClients[name] = client;
  if (!redisClients['default']) redisClients['default'] = client;
  debug('initRedis', url, name, Object.getOwnPropertyNames(redisClients));
  return client;
}
export function $r(name) {
  if (!name) name = 'default';
  let client = redisClients[name];
  // debug('$r', name, !!client);
  return client;
}

export default $r;
