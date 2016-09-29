(function() {
  "use strict";

  const Bot = require("./bot");

  let config = require("./config");

  class App {
    constructor() {}

    run() {
      new Bot(config).start();
    }
  }

  module.exports = App;
})();
