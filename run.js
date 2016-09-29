(function() {
  "use strict";

  const pckg = require("./package.json");
  const log = new (require("./app/utils/logger"))("run.js");
  const app = require("./app/app");

  // Init
  log.debug("App version:", pckg.version);
  log.debug("Node version:", process.versions.node);

  app();
})();
