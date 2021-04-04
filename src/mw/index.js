import { create } from './tanent';
import config from '../config';

export default {
  createUserToken: create(config.pulsar)
};
