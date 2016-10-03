(() => {
  "use strict";

  const ytdl = require("ytdl-core");
  const Discord = require("discord.js");
  const client = new Discord.Client();

  const log = new (require("./utils/logger"))("Bot.js");

  const Playlists = require("./Playlists");

  class Bot {
    constructor(config) {
      let vm = this;

      this.config = config;
      this.streamDispather = undefined;
      this.voiceBot = undefined;
      this.currentPlaylist = undefined;

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
      let stream = ytdl(url);
      if (this.voiceBot) {
        this.voiceBot.playStream(stream);
      }
    }

    manageDispatcher(message) {
      let command = message.content.substr(this.config.botPrefix.length + 1);

      if (command.startsWith("help")) {
        message.channel.sendMessage("TODO Write help");

      } else if (command.startsWith("playlist")) {
        let subCmd = command.substr("playlist".length + 1);
        if (subCmd.startsWith("ls")) {
          let playlists = "";
          Playlists.getPlaylists().forEach(playlist => {
            playlists += "- " + playlist.slice(0, -4) + "\n";
          });
          playlists = playlists.slice(0, -2);
          message.channel.sendMessage("Playlist available :");
          message.channel.sendMessage(playlists);
        } else if (subCmd.startsWith("select")) {
          let playlist = subCmd.substr("select".length + 1);
          try {
            this.currentPlaylist = Playlists.getPlaylist(playlist);
            message.channel.sendMessage("Current playlist switched to **" + this.currentPlaylist.getName() + "**");
          } catch (e) {
            message.channel.sendMessage("Playlist **" + playlist + "** not found");
          }
        } else if (subCmd.startsWith("current")) {
          message.channel.sendMessage("Current playlist is " + this.currentPlaylist.getName());
        } else {
          message.channel.sendMessage("" +
            "- **playlist ls**: List available playlists\n" +
            "- **playlist select [NAME]**: Select a playlist as current\n" +
            "- **playlist help**: Display this help");
        }

      } else if (command.startsWith("yt")) {
        let youtubeUrl = command.substr("yt" + 1);
        try {
          this.playYoutube(youtubeUrl);
        } catch (e) {
          message.reply("Cannot open youtube link: " + youtubeUrl);
          log.debug(e);
        }

      } else if (this.currentPlaylist) {

        if (command === "start") {
          this.streamDispather = this.voiceBot.playFile(this.currentPlaylist.next());

          this.streamDispather.on("start", () => {
            log.debug("Start playing");
            client.user.speaking = true;
          });

          this.streamDispather.on("end", () => {
            log.debug("End playing");
            client.user.speaking = false;
          });
        }

        if (this.streamDispather) {
          if (command === "play") {
            log.debug("Resume sound");
            this.streamDispather.resume();
            client.user.speaking = true;
          } else if (command === "pause") {
            log.debug("Pause sound");
            this.streamDispather.pause();
            client.user.speaking = false;
          } else if (command === "stop") {
            log.debug("Stop sound");
            this.streamDispather.end();
            client.user.speaking = false;
          } else if (command === "next") {
            log.debug("Next sound");
            this.streamDispather = this.voiceBot.playFile(this.currentPlaylist.next());
          } else if (command === "name") {
            message.reply(this.currentPlaylist.getCurrent().name);
          } else if (command === "infos") {
            message.reply(JSON.stringify(this.currentPlaylist.getCurrent()));
          }
        }
      } else {
        message.reply("There is no selected playlist. Type " + this.config.botPrefix + " playlist help");
      }
    }

    // ----------------------------------------------------------------------------------------------------------------
    // EVENTS
    // ----------------------------------------------------------------------------------------------------------------
    onReady(config) {
      log.debug("Bot ready");
      client.user.setUsername(config.botName);

      let musicChannel = client.channels.find(channel => {
        return channel.name === config.channelStream && channel.type === "voice"
      });
      musicChannel.join().then((voiceConnection) =>
        this.channelStreamJoined(voiceConnection)
      );
    }

    onMessage(message) {
      if (client.user.id === message.author.id) return;

      if (message.content.startsWith(this.config.botPrefix)) {
        this.manageDispatcher(message);
        message.delete();
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
      client.user.speaking = false;
    }
  }

  module.exports = Bot;
})();
