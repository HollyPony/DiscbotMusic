(function() {
  "use strict";

  const ytdl = require("ytdl-core");
  const Discord = require("discord.js");
  const client = new Discord.Client();

  const log = new (require("./utils/logger"))("Bot.js");

  class Bot {
    constructor(config) {
      let vm = this;

      this.config = config;
      this.streamDispather = undefined;
      this.voiceBot = undefined;

      log.prefix(config.botName);

      client.on("ready", () => vm.onReady(config));
      client.on("message", (message) => vm.onMessage(message));
      client.on("voiceStateUpdate", vm.onVoiceStateUpdate);
    }

    start() {
      return client.login(this.config.discordToken);
    }

    stop() {
      return client.destroy();
    }

    playYoutube(url) {
      try {
        let stream = ytdl(url);

        // TODO: Add error if not connected to a voice Channel
        if (this.voiceBot) {
          this.voiceBot.playStream(stream);
        }
      } catch(e){ throw e; }
    }

    // ----------------------------------------------------------------------------------------------------------------
    // EVENTS
    // ----------------------------------------------------------------------------------------------------------------
    onReady(config) {
      log.debug("Started");
      client.user.setUsername(config.botName);

      let musicChannel = client.channels.find(function(channel) {
        return channel.name === config.channelStream && channel.type === "voice"
      });
      musicChannel.join().then((voiceConnection) =>
        this.channelStreamJoined(voiceConnection)
      );
    }

    onMessage(message) {
      if (client.user.id === message.author.id) return;

      if (message.content.startsWith(""))

      if (message.content.startsWith("yt")) {
        this.playYoutube(message.content.split(" ")[1]);
      }

      if (message.content === "Hello") {
        message.channel.sendMessage("Hello !");
      }
      if (message.content === "ping") {
        message.reply("pong");
      }
    }

    onVoiceStateUpdate(oldMemeber, newMember) {
      if (newMember.user.id === client.user.id && newMember.mute) {
        newMember.setMute(false);
      }
    }

    channelStreamJoined(voiceConnection) {
      this.voiceBot = voiceConnection;
      log.debug("Connected on channel", "\"" + voiceConnection.channel.name + "\"");
    }
  }

  module.exports = Bot;
})();
