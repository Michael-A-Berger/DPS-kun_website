// Getting the IIDX songs
let iidxSongs = require('./iidx25-songs.json');

iidxSongs = iidxSongs.array;

// Storing the lists
const playlists = [];

// undefinedOrNull()
const undefinedOrNull = object => (object === undefined || object === null);

// ReturnJSON()
const ReturnJSON = (rq, rp, statusCode, object) => {
  rp.writeHead(statusCode, { 'Content-Type': 'application/json' });
  rp.write(JSON.stringify(object));
  rp.end();
};

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

// GetSongList()
const GetSongList = (listString) => {
  // Defining the list
  let list = {};

  // Making sure the list of song IDs is valid...
  const songIds = listString.split(',');
  let canConvert = true;
  for (let num = 0; canConvert && num < songIds.length; num++) {
    const parseNum = parseInt(songIds[num], 10);
    if (Number.isNaN(parseNum)) {
      list.error = `List parameter [ ${songIds[num]} ] is not a number`;
      canConvert = false;
    } else if (parseNum < 0 || parseNum >= iidxSongs.length) {
      list.error = `Song ID [ ${parseNum} ] is not valid (must be number inclusively between 0 and ${iidxSongs.length - 1})`;
      canConvert = false;
    } else songIds[num] = Math.floor(parseNum);
  }

  // IF the song IDs are valid...
  if (canConvert) {
    list = {
      array: [],
    };
    for (let num = 0; num < songIds.length; num++) {
      list.array.push(RetrieveSong(songIds[num]));
    }
  }

  // Returning the list
  return list;
};

// GetSongs()
const GetSongs = (rq, rp, params) => {
  let chosenSong = {
    error: 'Incorrect search/retrieval parameters (see /api-guide.html to learn proper usage)',
  };

  if (params.random) {
    // ::::::::::::::
    // === RANDOM ===
    // ::::::::::::::

    chosenSong = RandomSong();
    ReturnJSON(rq, rp, 200, chosenSong);
  } else if (params.search) {
    // ::::::::::::::
    // === SEARCH ===
    // ::::::::::::::

    // Getting matching search results
    const searchResults = {
      array: [],
    };
    for (let songNum = 0; songNum < iidxSongs.length; songNum++) {
      const currentSong = RetrieveSong(songNum);
      const songKeys = Object.keys(currentSong);
      for (let propNum = 0; propNum < songKeys.length; propNum++) {
        const songProp = songKeys[propNum];
        if ((typeof currentSong[songProp]) === 'string' && currentSong[songProp].toLowerCase().includes(params.search.toLowerCase())) {
          if (undefinedOrNull(searchResults.array[propNum])) searchResults.array[propNum] = [];
          searchResults.array[propNum].push(currentSong);
          propNum = songKeys.length;
        }
      }
    }

    // Ordering the search results by "Property Ranking":
    //    match in 1st property = 1st in array,
    //    match in 2nd property = 2nd in array,
    //    match in 3rd property = 3rd in array, etc...
    const resultsCopy = searchResults.array;
    searchResults.array = [];
    for (let num = 0; num < resultsCopy.length; num++) {
      if (!undefinedOrNull(resultsCopy[num])) searchResults.array.push(...resultsCopy[num]);
    }

    // Making sure results were found...
    if (searchResults.array.length < 1) {
      chosenSong.error = 'No matches were found';
      ReturnJSON(rq, rp, 204, chosenSong);
    } else {
      chosenSong = {
        array: searchResults.array,
      };
      ReturnJSON(rq, rp, 200, chosenSong);
    }
  } else if (params.list && params.list.length > 0) {
    // ::::::::::::
    // === LIST ===
    // ::::::::::::

    chosenSong = GetSongList(params.list);
    if (chosenSong.error) {
      ReturnJSON(rq, rp, 400, chosenSong);
    } else {
      ReturnJSON(rq, rp, 200, chosenSong);
    }
  } else if (params.playlists) {
    // :::::::::::::::::
    // === PLAYLISTS ===
    // :::::::::::::::::

    chosenSong = {
      array: playlists,
    };
    ReturnJSON(rq, rp, 200, chosenSong);
  } else {
    // ::::::::::::::::::
    // === (NO MATCH) ===
    // ::::::::::::::::::

    ReturnJSON(rq, rp, 400, chosenSong);
  }
};

// PostData()
const PostData = (rq, rp, params) => {
  const response = {};

  if (!undefinedOrNull(params.name) && !undefinedOrNull(params.list)
      && typeof params.name === 'string' && typeof params.list === 'string') {
    // List checking
    const listSongs = GetSongList(params.list);
    let uniqueName = true;

    // Checking if the list name is unique
    for (let num = 0; num < playlists.length; num++) {
      if (playlists[num].name === params.name) uniqueName = false;
    }

    if (listSongs.error) {
      // IF the song list could not be created...
      response.error = `SONG LIST ERROR: ${listSongs.error}`;
      ReturnJSON(rq, rp, 400, response);
    } else if (!uniqueName) {
      // IF the name is not unique...
      response.error = 'List name is not unique, try a different name.';
      ReturnJSON(rq, rp, 400, response);
    } else {
      console.log('POST was good!');
      // IF everything is good...
      const listToAdd = {
        name: params.name,
        songs: listSongs.array,
      };
      playlists.push(listToAdd);

      // Sending a return message
      response.success = true;
      ReturnJSON(rq, rp, 201, response);
    }
  } else {
    response.error = 'List POST form must include properties [ name ] and [ list ]';
    ReturnJSON(rq, rp, 400, response);
  }
};

// NotFound()
const NotFound = (rq, rp) => {
  const message = {
    error: 'Page does not exist',
  };
  ReturnJSON(rq, rp, 404, message);
  // rp.writeHead(404, { 'Content-Type': 'application/json' });
  // rp.write(JSON.stringify(message));
  // rp.end();
};

// Exports
module.exports = {
  GetSongs,
  PostData,
  NotFound,
};
