import _debug from 'debug';
const debug = _debug('app:mqttClient');
import mqtt from 'mqtt';

const DEFAULT_URL = 'mqtt://localhost';
const DEFAULT_TOPIC = 'server/#';

/**
 * mqtt客户端
 */
export default class MqttClient {
  constructor(opts) {
    this.opts = opts;

    this.eventConnect = this.eventConnect.bind(this);
    this.eventMessage = this.eventMessage.bind(this);
    this.eventReconnect = this.eventReconnect.bind(this);
    this.eventClose = this.eventClose.bind(this);
    this.eventOffline = this.eventOffline.bind(this);
    this.eventError = this.eventError.bind(this);
    this.eventEnd = this.eventEnd.bind(this);
    this.eventPacketsend = this.eventPacketsend.bind(this);
    this.eventPacketreceive = this.eventPacketreceive.bind(this);

    this.setOpts = this.setOpts.bind(this);
    this.start = this.start.bind(this);
    this.publishJson = this.publishJson.bind(this);
    this.end = this.end.bind(this);
  }
  setOpts(opts) {
    this.opts = opts;
  }
  start() {
    let url = this.opts.url || DEFAULT_URL;
    debug('mqtt.connect to ' + url);
    this.client = mqtt.connect(url);
    this.client.on('connect', this.eventConnect);
    this.client.on('message', this.eventMessage);
    this.client.on('reconnect', this.eventReconnect);
    this.client.on('close', this.eventClose);
    this.client.on('offline', this.eventOffline);
    this.client.on('error', this.eventError);
    this.client.on('end', this.eventEnd);
    this.client.on('packetsend', this.eventPacketsend);
    this.client.on('packetreceive', this.eventPacketreceive);
  }
  eventConnect() {
    let topic = this.opts.topic;
    if (topic) {
      this.client.subscribe(topic, error => {
        if (!error) {
          debug('subscribe ok! topic=' + topic);
          // this.client.publish('/topic/test', 'Hello mqtt')
        } else {
          debug('subscribe fail!', error);
        }
      });
    }
  }
  eventMessage(topic, message, packet) {
    // message is Buffer
    let strmsg = message.toString();
    // debug('eventMessage', topic, strmsg)
    // client.end()
    if (this.opts.messageCallback) {
      this.opts.messageCallback(topic, strmsg);
    }
  }
  eventReconnect() {
    debug('eventReconnect');
  }
  eventClose() {
    debug('eventClose');
  }
  eventOffline() {
    debug('eventOffline');
  }
  eventError(error) {
    debug('eventError');
    this.client.reconnect();
  }
  eventEnd() {
    debug('eventEnd');
  }
  eventPacketsend(packet) {
    // debug('eventPacketsend');
  }
  eventPacketreceive(packet) {
    // debug('eventPacketreceive');
  }

  publishJson(topic, data) {
    if (!this.client) {
      debug('error! no mqtt client!');
      return false;
    }
    this.client.publish(topic, JSON.stringify(data));
  }
  end() {
    if (!this.client) {
      debug('warning! no mqtt client!');
      return false;
    }
    this.client.end();
    this.client = null;
  }
}

export const instance = new MqttClient();
