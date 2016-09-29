(function() {
  "use strict";

  const Discord = require("discord.js");
  const client = new Discord.Client();

  const log = new (require("./utils/logger"))("Bot.js");

  class Bot {
    constructor(config) {
      let vm = this;
      this.conf = config;

      log.prefix(config.botName);

      client.on("ready", function() {
        log.debug("Started");
        client.user.setUsername(config.botName);

        let musicChannel = client.channels.find(function(channel) {
          return channel.name === config.channelStream && channel.type === "voice"
        });
        musicChannel.join().then(vm.channelStreamJoined);
      });

      client.on("message", vm.onMessage);

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

    onMessage(message) {
      if (client.user.id === message.author.id) return;

      if (message.content === "Hello") {
        message.channel.sendMessage("Hello !");
      }
      if (message.content === "ping") {
        message.reply("pong");
      }
    }

    channelStreamJoined(voiceConnection) {
      log.debug("Connected on channel", "\"" + voiceConnection.channel.name + "\"");

      const dispatcher = voiceConnection.playFile("/home/liomka/music/japan.mp3");

      dispatcher.on("start", function() {
        log.debug("Start playing");
        client.user.speaking = true;
      });

      dispatcher.on("end", function() {
        log.debug("End playing");
        client.user.speaking = false;
      });
    }
  }

  module.exports = Bot;
})();
