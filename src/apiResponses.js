// Getting the IIDX songs
let iidxSongs = require('./iidx25-songs.json');

iidxSongs = iidxSongs.array;

// RetrieveSong()
const RetrieveSong = (id) => {
  const song = iidxSongs[id];
  song.id = id;
  return song;
};

// RandomSong()
const RandomSong = () => {
  const randomId = Math.floor(Math.random() * iidxSongs.length);
  return RetrieveSong(randomId);
};

// GetSongs()
const GetSongs = (rq, rp, params) => {
  let responseCode = 400;
  let chosenSong = {
    message: 'Incorrect search/retrieval parameters (see /api-guide.html to learn proper usage)',
  };

  // RANDOM
  if (params.random) {
    chosenSong = RandomSong();
    responseCode = 200;
  }

  // LIST
  if (params.list && params.list.length > 0) {
    const songIds = params.list.split(',');
    let canConvert = true;
    for (let num = 0; canConvert && num < songIds.length; num++) {
      const parseNum = parseInt(songIds[num], 10);
      if (Number.isNaN(parseNum)) {
        chosenSong.message = `List parameter [ ${songIds[num]} ] is not a number`;
        canConvert = false;
      } else if (parseNum < 0 || parseNum >= iidxSongs.length) {
        chosenSong.message = `Song ID [ ${parseNum} ] is not valid (must be number inclusively between 0 and ${iidxSongs.length - 1})`;
        canConvert = false;
      } else songIds[num] = Math.floor(parseNum);
    }
    if (canConvert) {
      chosenSong = {
        array: [],
      };
      for (let num = 0; num < songIds.length; num++) {
        chosenSong.array.push(RetrieveSong(songIds[num]));
      }
      responseCode = 200;
    }
  }

  // Sending back the response
  rp.writeHead(responseCode, { 'Content-Type': 'application/json' });
  rp.write(JSON.stringify(chosenSong));
  rp.end();
};

// NotFound()
const NotFound = (rq, rp) => {
  const message = {
    message: 'Page does not exist',
    id: 'notFound',
  };
  rp.writeHead(404, { 'Content-Type': 'application/json' });
  rp.write(JSON.stringify(message));
  rp.end();
};

// Exports
module.exports = {
  GetSongs,
  NotFound,
};
