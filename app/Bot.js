(function() {
  "use strict";

  const Discord = require("discord.js");
  const client = new Discord.Client();

  const log = new (require("./utils/logger"))("Bot.js");

  class Bot {
    constructor(config){
      this.conf = config;

      log.prefix(config.botName);

      client.on("ready", function() {
        log.debug("Started");
        client.user.setUsername(config.botName);

        let musicChannel = client.channels.find(channel => channel.name === config.channelStream && channel.type === "voice");

        // Voice channel
        musicChannel.join().then(
          function connectedToChannel(response) {
            log.debug("Connected on channel", response.channel.name);

            const dispatcher = response.playFile("/home/liomka/music/japan.mp3");

            dispatcher.on("start", function() {
              log.debug("Start playing");
            });

            dispatcher.on("end", function() {
              log.debug("End playing");
            });
          }
        );
      });

      client.on("message", message => {
        if (client.user.id === message.author.id) return;

        if (message.content === "Hello") {
          message.channel.sendMessage("Hello !");
        }
        if (message.content === "ping") {
          message.reply("pong");
        }
      });

      client.on("voiceStateUpdate", (oldMemeber, newMember) => {
        if (newMember.user.id === client.user.id && newMember.mute) {
          newMember.setMute(false);
        }
      });
    }

    start() {
      return client.login(this.conf.discordToken);
    }

    stop() {
      return client.destroy();
    }
  }

  module.exports = Bot;
})();
