(() => {
  "use strict";

  const fs = require("fs");

  const log = new (require("./utils/logger"))("Playlists.js");

  const Playlist = require("./Playlist");

  const getPlaylists = function() {
    let playlists = [];
    fs.readdirSync("playlists").forEach(function (file) {
      if (file.endsWith(".json")) {
        playlists.push(file);
      }
    });
    log.debug("getPlaylists");
    playlists.forEach(name => {
      log.debug("\t->", name);
    });
    return playlists;
  };

  const getPlaylist = function(name) {
    return new Playlist(name);
  };

  module.exports = {
    getPlaylist: getPlaylist,
    getPlaylists: getPlaylists
  };
})();
