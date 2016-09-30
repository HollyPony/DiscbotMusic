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
      try { // https://www.youtube.com/watch?v=GgwPQpE7qO8&
        let stream = ytdl(url);

        // TODO: Add error if not connected to a voice Channel
        if (this.voiceBot) {
          this.voiceBot.playStream(stream);
        }
      } catch(e){ throw e; }
    }

    manageDispatcher(command) {
      if (command === "start") {
        this.streamDispather = this.voiceBot.playFile("/home/liomka/music/japan.mp3");

        this.streamDispather.on("start", function() {
          log.debug("Start playing");
          client.user.speaking = true;
        });

        this.streamDispather.on("end", function() {
          log.debug("End playing");
          client.user.speaking = false;
        });
      }

      if (this.streamDispather) {
        if (command === "play") {
          this.streamDispather.resume();
          client.user.speaking = true;
        } else if (command === "pause") {
          this.streamDispather.pause();
          client.user.speaking = false;
        } else if (command === "stop") {
          this.streamDispather.end();
          client.user.speaking = false;
        } else if (command === "next") {
        } else if (command === "name") {
        }
      }
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

      if (message.content.startsWith(this.config.botPrefix)) {
        this.manageDispatcher(message.content.substr(this.config.botPrefix.length + 1));
        message.delete();
      }

      if (message.content === "what is it ?") {
        message.channel.sendMessage("qsdf");
      }

      // if (message.content.startsWith("yt")) {
      //   this.playYoutube(message.content.substr("yt" + 1));
      // }
    }

    onVoiceStateUpdate(oldMemeber, newMember) {
      if (newMember.user.id === client.user.id && newMember.mute) {
        newMember.setMute(false);
      }
    }

    channelStreamJoined(voiceConnection) {
      this.voiceBot = voiceConnection;
      log.debug("Connected on channel", "\"" + voiceConnection.channel.name + "\"");
      client.user.speaking = false;
    }
  }

  module.exports = Bot;
})();
