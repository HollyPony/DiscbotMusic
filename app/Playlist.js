(() => {
  "use strict";

  class Playlist {

    constructor(playlistName) {
      this.name = playlistName;
      this.playlist = require("../playlists/" + playlistName + ".json");
    }

    randomIntInc(low, high) {
      return Math.floor(Math.random() * (high - low + 1) + low);
    }

    next() {
      this.current = this.playlist[this.randomIntInc(0, this.playlist.length - 1)];
      return this.current.url;
    }

    getCurrent() {
      return this.current;
    }

    getName() {
      return this.name;
    }
  }

  module.exports = Playlist;
})();
