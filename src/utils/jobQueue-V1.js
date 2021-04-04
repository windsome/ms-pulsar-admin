import kue from 'kue';
import _debug from 'debug';
const debug = _debug('app:jobQueue-V1');

/**
 * 事务队列，将事务按顺序执行
 */
export class JobQueue {
  constructor() {
    this.defActionFunction = this.defActionFunction.bind(this);
    this.addActions = this.addActions.bind(this);
    this.addJob = this.addJob.bind(this);
    this.init();
  }

  async defActionFunction(job, done) {
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
  }

  init() {
    debug('init start');
    this.actionMap = {};
    this.jobMap = {};

    this.queue = kue.createQueue();
    this.queue.on('error', err => {
      debug('Oops... ', err);
    });
    process.once('SIGTERM', sig => {
      this.queue.shutdown(1000, err => {
        debug('Kue shutdown: ', err);
      });
    });
    debug('init end');
  }

  /**
   * add actions need to process.
   * @param {array} actions
   */
  addActions(actions) {
    let actionCount = (actions && actions.length) || 0;
    for (let i = 0; i < actionCount; i++) {
      let actionName = actions[i];
      let oldActionInMap = this.actionMap[actionName];
      if (!oldActionInMap) {
        this.queue.process(actionName, this.defActionFunction);
        this.actionMap[actionName] = true;
      } else {
        debug('warning! action already exist! action=' + actionName);
      }
    }
    debug('updated actionMap:', this.actionMap);
    return this.actionMap;
  }

  /**
   * add one job.
   * @param {string} actionName
   * @param {function} actionFunc
   * @param {json} data
   */
  addJob(actionName, actionFunc, data) {
    return new Promise((resolve, reject) => {
      if (!actionName || !actionFunc) {
        reject(
          new Error(
            'error! parameter missing! actionName=' +
              actionName +
              ', actionFunc=' +
              actionFunc +
              ', data=' +
              data
          )
        );
      }
      let msDelay = (data && data.delay) || 0;
      let job = this.queue
        .create(actionName, data)
        .delay(msDelay)
        .removeOnComplete(true)
        .save(err => {
          if (!err) {
            debug('create ' + actionName + ', job.id=' + job.id);
            this.jobMap[job.id] = actionFunc;
            debug('updated jobMap:', this.jobMap);
            resolve(job);
          } else {
            debug(
              'error! create fail! actionName=' + actionName + ', data=',
              data
            );
            reject(error);
          }
        });
    });
  }
}

export default new JobQueue();
