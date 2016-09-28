(function() {
  "use strict";

  const Discord = require("discord.js");
  const client = new Discord.Client();

  const log = require('./utils/logger');

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

      client.on("voiceJoin", (voiceChannel, user) => {
        log.debug('voiceJoin', voiceChannel.name, user.name);
      });

      client.login('MjMwNjYzNTI0NTY3ODc1NTg1.Cs1UNA.oSJnw2mR1GJf1MWc8JbVpcGcd8Y');
    }
  }

  module.exports = App;
})();
