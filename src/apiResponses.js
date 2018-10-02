// Getting the IIDX songs
let iidxSongs = require('./iidx25-songs.json');

iidxSongs = iidxSongs.array;
console.dir(iidxSongs[0]);

// RandomSong()
const RandomSong = () => {
  const songNum = Math.floor(Math.random() * iidxSongs.length);
  return iidxSongs[songNum];
};

// GetSongs()
const GetSongs = (rq, rp, params) => {
  if (params.random /* && params.random > 0 */) {
    const chosenSong = RandomSong();
    rp.writeHead(200, { 'Content-Type': 'application/json' });
    rp.write(JSON.stringify(chosenSong));
    rp.end();
  } else {
    const message = {
      message: 'The only feature implemented ATM is the "random" feature.',
      id: 'notImplemented',
    };
    rp.writeHead(501, { 'Content-Type': 'application/json' });
    rp.write(JSON.stringify(message));
    rp.end();
  }
};

// Exports
module.exports = {
  GetSongs,
};
