import kue from 'kue';
import _debug from 'debug';
const debug = _debug('app:jobQueue');

/**
 * 事务队列，将事务按顺序执行
 */
export default class JobQueue {
  constructor(opts) {
    this.opts = opts;
    // this.defActionFunction = this.defActionFunction.bind(this);
    // this.addJob = this.addJob.bind(this);
    this.actionName = 'DEFAULT_ACTION';
    this.init();
  }

  defActionFunction = async (job, done) => {
    if (!job || !job.id) {
      debug('error! job should not null!');
      return;
    }
    //debug('process:', job.data);
    try {
      let func = this.jobMap[job.id];
      if (func) {
        let result = await func(job.data);
        delete this.jobMap[job.id];
      } else {
        debug('warning! not get func of job.id=' + job.id);
      }
      done();
    } catch (error) {
      debug('error! queue.process:', error);
      done(error);
    }
  };

  defActionFunctionV2 = async job => {
    if (!job || !job.id) {
      return Promise.reject(new Error('error! job & job.id should not null!'));
    }

    //debug('process:', job.data);
    try {
      let func = this.jobMap[job.id];
      if (func) {
        let result = await func(job.data);
        delete this.jobMap[job.id];
        return await Promise.resolve(result);
      } else {
        return Promise.reject(
          new Error('warning! not get func of job.id=' + job.id)
        );
      }
    } catch (error) {
      debug('defActionFunctionV2: catch error!', error);
      return Promise.reject(error);
    }
  };

  init = () => {
    debug('kue init start');
    this.actionMap = {};
    this.jobMap = {};

    this.queue = kue.createQueue(this.opts);
    this.queue.on('error', err => {
      debug('kue error: ', err);
      // this.init();
    });
    process.once('SIGTERM', sig => {
      this.queue.shutdown(1000, err => {
        debug('kue shutdown: ', err);
      });
    });

    kue.prototype.processAsync = (name, handler) => {
      return this.queue.process(name, (job, done) => {
        return handler(job)
          .then(() => done(null))
          .catch(done);
      });
    };
    this.queue.processAsync(this.actionName, this.defActionFunctionV2);

    debug('kue init end');
  };

  /**
   * add one job.
   * @param {function} actionFunc
   * @param {json} data
   */
  addJob = (actionFunc, data) => {
    return new Promise((resolve, reject) => {
      if (!actionFunc) {
        reject(
          new Error(
            'error! parameter missing! actionFunc=' +
              actionFunc +
              ', data=' +
              data
          )
        );
      }
      let msDelay = (data && data.delay) || 0;
      let job = this.queue
        .create(this.actionName, data)
        .delay(msDelay)
        .removeOnComplete(true)
        .save(err => {
          if (!err) {
            debug('create job.id=' + job.id);
            this.jobMap[job.id] = actionFunc;
            debug('updated jobMap:', this.jobMap);
            resolve(job);
          } else {
            debug('error! create fail! data=', data);
            reject(error);
          }
        });
    });
  };
}
