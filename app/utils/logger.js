(function() {
  "use strict";

  class Logger {

    constructor(filename) {
      this.conf = {
        filename: filename,
        prefix: undefined
      };
    }

    _configure(params) {
      let prefix = "";
      // if (Logger._datetime) {
        prefix += new Date().toString() + ":";
      // }
      if (this.conf.filename) {
        prefix += this.conf.filename + ":";
      }
      if (this.conf.prefix) {
        prefix += this.conf.prefix + ":";
      }

      if (prefix.length > 0) {
        params.splice(0, 0, prefix);
      }
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

  module.exports = Logger;
})();
