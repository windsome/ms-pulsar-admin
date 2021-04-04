const jayson = require('jayson/promise');

export default class Client {
  /**
   * 构造函数
   * @param {array} ops 操作列表
   * @param {json} cfg 配置{protocol:'tcp/http',host:'localhost',port} protocol默认为tcp,host默认为localhost
   */
  constructor(ops, cfg) {
    this.cfg = cfg;
    let client = null;
    switch (cfg.protocol) {
      case 'http':
        client = jayson.client.http({
          port: cfg.port,
          host: cfg.host || 'localhost'
        });
        break;
      case 'tcp':
      default:
        client = jayson.client.tcp({
          port: cfg.port,
          host: cfg.host || 'localhost'
        });
        break;
    }
    this.client = client;

    for (let i = 0; i < ops.length; i++) {
      let opname = ops[i];
      this[opname] = async function() {
        let ret = null;
        try {
          ret = await client.request(
            opname,
            Array.prototype.slice.apply(arguments)
          );
          // ret = await client.request(opname, arguments)
        } catch (e) {
          console.error('jaysonClient error:', e);
          throw { errcode: -1, message: e.message };
        }
        let result = ret && ret.result;
        if (result && result.errcode) {
          throw result;
        }
        return result;
      }.bind(this);
    }
  }
}

// 供初始化jayson 客户端.
let clients = {};

/**
 * 初始化微服务列表
 * @param {json} cfgs {iotdevice: {ops, protocol, port, host}}
 */
export function init(cfgs) {
  let names = Object.getOwnPropertyNames(cfgs);
  for (let i = 0; i < names.length; i++) {
    let name = names[i];
    let cfg = cfgs[name];
    clients[name] = new Client(cfg.ops, {
      protocol: cfg.protocol,
      port: cfg.port,
      host: cfg.host
    });
  }
  return clients;
}

export function $rpc(name) {
  return clients[name];
}
