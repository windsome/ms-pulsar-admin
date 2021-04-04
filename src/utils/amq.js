/**
 * websocket收发服务器,接收来自processor的消息,通过websocket发送给客户端.
 * 监听 im.transceiver.<serverid>
 */
import amqp from 'amqplib';
import _debug from 'debug';
const debug = _debug('app:amq');

export async function createMqReceiver(
  opts = {
    url: 'localhost',
    exchange: '<none_exchange>',
    key: '<none_key>',
    processor: null
  }
) {
  let { url, exchange, key, processor } = opts;
  if (!url || !exchange || !key || !processor) {
    debug('error params!', opts);
    throw new Error('params missing!');
  }
  let conn = await amqp.connect(url);
  conn.on('close', async () => {
    debug('event close!');
  });
  let channel = await conn.createChannel();
  await channel.assertExchange(exchange, 'topic', {
    durable: false
  });
  let queue = await channel.assertQueue('', {
    exclusive: true
  });
  await channel.bindQueue(queue.queue, exchange, key);
  let consumer = await channel.consume(
    queue.queue,
    async msg => {
      let strmsg = msg.content.toString();
      debug('consume:', strmsg);
      if (processor) {
        await processor(strmsg);
      }
      // channel.ack(msg);
    },
    {
      noAck: true
    }
  );
  debug('createMqReceiver ok!', opts, consumer);
  return {
    conn,
    channel,
    consumer
  };
}

export function createMqTransmitter(
  opts = { url: 'localhost', exchange: '<none_exchange>' }
) {
  let conn_channel = null;

  /**
   * 创建发送器,发往MQ.
   * @param {json} opts
   */
  async function createConnChannel(
    opts = { url: 'localhost', exchange: '<none_exchange>' }
  ) {
    let { url, exchange } = opts;
    let conn = await amqp.connect(url);
    conn.on('close', async () => {
      debug('event close! need restart after 10 sencods?');
      conn_channel = null;
    });
    let channel = await conn.createChannel();
    channel.assertExchange(exchange, 'topic', {
      durable: false
    });
    debug('createMqTransmitter ok!', opts);
    return { conn, channel };
  }

  /**
   * 发送msg到key
   * key为'im.processor','im.transceiver.[serverId]'
   */
  return async function send(msg, key) {
    if (!conn_channel) {
      conn_channel = await createConnChannel(opts);
    }
    let strmsg = JSON.stringify(msg);
    let result = await conn_channel.channel.publish(
      opts.exchange,
      key,
      Buffer.from(strmsg)
    );
    debug('+send:', key, strmsg, result);
    return true;
  };
}
