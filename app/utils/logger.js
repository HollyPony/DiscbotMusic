/**
 * Created by aagombart on 9/28/16.
 */

(function() {
  "use strict";

  class Logger {

    constructor() {
      this.conf = {
        prefix: undefined
      };
    }

    _configure(params) {
      // console.log('conf', this.conf);
      if (this.conf.prefix) {
        params.splice(0, 0, this.conf.prefix);
      }
      // return params;
    }

    prefix(prefix) {
      this.conf.prefix = prefix;
    }

    trace(...params) {
      this._configure(params);
      console.trace(...params);
    }

    debug(...params) {
      this._configure(params);
      console.log(...params);
    }

    info(...params) {
      this._configure(params);
      console.info(...params);
    }

    warn(...params) {
      this._configure(params);
      console.warn(...params);
    }

    error(...params) {
      this._configure(params);
      console.error(...params);
    }

    assert(...params) {
      this._configure(params);
      console.assert(...params);
    }
  }

    module.exports = new Logger;
})();
