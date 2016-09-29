(function() {
  "use strict";

  const git = require('git-rev');

  const log = new (require('./app/utils/logger'))("run.js");
  const app = require('./app/app');

  // Init
  log.debug("Node version:", process.versions.node);

  git.tag(function(str) {
    log.debug("App version:", str);
  });

  new app().run();

  // log.trace('trace');
  // log.debug('debug');
  // log.info('info');
  // log.assert('assert');
  // log.warn('warn');
  // log.error('error');

  // app.run();

})();
