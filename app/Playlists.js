(() => {
  "use strict";

  const fs = require("fs");

  const log = new (require("./utils/logger"))("Playlists.js");

  const Playlist = require("./Playlist");

  const getPlaylists = () => {
    let playlists = [];
    fs.readdirSync("playlists").forEach(file => {
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

  const getPlaylist = (name) => {
    return new Playlist(name);
  };

  module.exports = {
    getPlaylist: getPlaylist,
    getPlaylists: getPlaylists
  };
})();
