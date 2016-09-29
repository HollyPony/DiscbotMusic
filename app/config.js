(function() {

  let jsonConf;

  try {
    jsonConf = require("../config.json");
  } catch(e) {}

  let config = {};

  config.discordToken = jsonConf && jsonConf.discordToken || process.env.DBM_DISCORD_BOT_TOKEN || "";

  module.exports = config;
})();
