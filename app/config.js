(function() {

  let jsonConf;

  try {
    jsonConf = require("../config.json");
  } catch(e) {}

  let config = {};

  config.botName = jsonConf && jsonConf.botName || "DiscordbotMusic";
  config.botPrefix = jsonConf && jsonConf.botPrefix;
  config.channelStream = jsonConf && jsonConf.channelStream;
  config.channelAdmin = jsonConf && jsonConf.channelAdmin;
  config.channelBlindTest = jsonConf && jsonConf.channelBlindTest;
  config.discordToken = jsonConf && jsonConf.discordToken;

  module.exports = config;
})();
