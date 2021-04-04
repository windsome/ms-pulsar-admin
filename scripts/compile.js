import webpackCompiler from './webpack-compiler'
import webpackServerConfig from './webpack.config'
import _ from 'lodash'
import _debug from 'debug'
const debug = _debug('app:bin:compile')

const compiler_fail_on_warning = false;

(async function () {
  try {
    let startTime = new Date().getTime() / 1000;
    debug('Start server compile at ', startTime)
    const stats2 = await webpackCompiler(webpackServerConfig)
    if (stats2.warnings.length && compiler_fail_on_warning) {
      debug('Config set to fail on warning, exiting with status code "1".')
      process.exit(1)
    }
    let endTime = new Date().getTime() / 1000;
    debug ('Finish compile at ', endTime, ', time elapse ', _.round(endTime - startTime, 3));
  } catch (e) {
    debug('Compiler encountered an error.', e)
    process.exit(1)
  }
})()
