(function() {
  "use strict";

  const Discord = require("discord.js");
  const client = new Discord.Client();

  const log = require('./utils/logger');

  let config = require('./config');

  class App {
    constructor() {}

    run() {
      client.on('ready', function() {
        log.debug('Client ready');
        log.debug('Discord.js v', Discord.version);

        log.debug('ChannelList', client.channels.map(function(channel) {
          return { id: channel.id, name: channel.name, type: channel.type };
        }));

        // Voice channel
        client.channels.get("230706907470495746").join().then(
          function connectedToChannel(response) {
            log.debug('connectionSuccess to', response.channel.name);
            // log.debug(client.voiceConnection);
            response.playFile("/home/liomka/music/japan.mp3",
              {
                seek: 0,
                volume: 1
              },
              function(response) {
                log.debug("playback started", response);
              },
              function() {
                log.debug("playback failed");
              }
            );
          }
        );
      });

      client.on('message', message => {
        if (client.user.id === message.author.id) return;

        if (message.content === 'Hello') {
          message.channel.sendMessage('Hello !');
        }
        if (message.content === 'ping') {
          message.reply('pong');
        }
      });

      client.on("voiceStateUpdate", (oldMemeber, newMember) => {
        if (newMember.user.id === client.user.id && newMember.mute) {
          newMember.setMute(false);
        }
      });

      client.login(config.discordToken);
    }
  }

  module.exports = App;
})();
