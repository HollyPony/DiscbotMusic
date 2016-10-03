(() => {
  "use strict";

  const fs = require("fs");
  const Discord = require("discord.js");

  const log = new (require("./utils/logger"))("app.js");
  const Bot = require("./Bot");

  let getBotConfFiles = () => {
    let botConfs = [];
    let files = fs.readdirSync("bots");
    files.forEach(file => {
      if (file.endsWith(".json")) {
        botConfs.push(file);
      }
    });
    return botConfs;
  };

  let run = () => {
    log.info("Use discord.js v" + Discord.version);
    getBotConfFiles().forEach(botConfigFile => {
      log.debug("Load conf:", botConfigFile);
      new Bot(require("../bots/" + botConfigFile)).start();
    });
  };

  module.exports = run;
})();
