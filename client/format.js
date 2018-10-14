const dummyFormat = false;

// FormatChartsTable()
const FormatChartsTable = (song, includeNotes) => {
  let chartTable = '';

  // Setting up the charts table rows
  chartTable += '<table>\n<tr>\n<th></th>\n';
  const songCharts = song.charts;
  const chartKeys = Object.keys(song.charts);
  for (let num = 0; num < chartKeys.length; num++) {
    chartTable += `<th>${chartKeys[num].toUpperCase()}</th>\n`;
  }
  chartTable += '</tr>\n<tr>\n<td>Rating</td>\n';
  for (let num = 0; num < chartKeys.length; num++) {
    chartTable += `<td>${songCharts[chartKeys[num]].rating}</td>\n`;
  }

  // IF the table creation should include the notecounts...
  if (includeNotes) {
    // Getting the note types
    const noteTypes = Object.keys(songCharts[chartKeys[0]]);

    // FOR every note type...
    let currentChart = {};
    let currentType = '';
    let typeName = '';
    for (let typeCount = 0; typeCount < noteTypes.length; typeCount++) {
      currentType = noteTypes[typeCount];
      if (currentType !== 'rating') {
        typeName = currentType.charAt(0).toUpperCase() + currentType.slice(1);
        chartTable += `<tr>\n<td>${typeName}</td>\n`;
        for (let num = 0; num < chartKeys.length; num++) {
          currentChart = songCharts[chartKeys[num]];
          chartTable += `<td>${currentChart[currentType]}</td>\n`;
        }
        chartTable += '</tr>\n';
      }
    }
  }

  chartTable += '</tr>\n</table>\n';

  // Returning the charts table
  return chartTable;
};

// FormatDisplaySong()
const FormatDisplaySong = song => {
  let formatted = '<div class="display-song">\n';

  // Setting the header information
  formatted += `<p class="display-id">ID: ${song.id}</p>\n`;
  formatted += `<h1>${song.name}</h1>\n`;
  formatted += `<h2> by ${song.artist}</h2>\n`;

  // Setting the extra information
  const songKeys = Object.keys(song);
  let currentProp = '';
  for (let num = 2; num < songKeys.length; num++) {
    currentProp = songKeys[num];
    if (typeof song[currentProp] === 'string') {
      const propName = currentProp.charAt(0).toUpperCase() + currentProp.slice(1);
      const propValue = song[currentProp];
      formatted += `<p><b>${propName}:</b> ${propValue}</p>\n`;
    }
  }

  // Setting up the chart rows
  formatted += FormatChartsTable(song, true);

  // Finishing the formatted string
  formatted += '</div>';
  return formatted;
};

// FormatPlaylist()
const FormatPlaylist = playlist => {
  let formatted = '<div class="playlist">\n';

  // Adding the name
  formatted += `<h1>${playlist.name}</h1>\n`;

  // Adding the songs
  let currentSong = {};
  for (let num = 0; num < playlist.songs.length; num++) {
    // Setting up the basic song info
    currentSong = playlist.songs[num];
    formatted += '<div class="playlist-song">\n';
    formatted += `<h2>${currentSong.name}</h2>\n`;
    formatted += `<h3>by ${currentSong.artist}</h3>\n`;

    // Setting up the chart rows
    formatted += FormatChartsTable(currentSong, false);

    formatted += '</div>\n';
  }

  // Finishing the formatted string
  formatted += '</div>';
  return formatted;
};

// FormatSearchResults()
const FormatSearchResults = (results, phrase) => {
  let formatted = '';

  // FOR every search result...
  for (let num = 0; num < results.length; num++) {
    formatted += '<div class="search-result">\n';
    formatted += `<h2 class="song-id">ID: ${results[num].id}</h2>\n`;
    formatted += `<h1>${results[num].name}</h1>\n`;
    formatted += `<h2>Artist: ${results[num].artist}</h2>\n`;
    if (!results[num].name.includes(phrase) && !results[num].artist.includes(phrase)) {
      const songKeys = Object.keys(results[num]);
      let currentProp = '';
      for (let propNum = 2; propNum < songKeys.length; propNum++) {
        currentProp = songKeys[propNum];
        if (typeof results[num][currentProp] === 'string' && results[num][currentProp].toLowerCase().includes(phrase)) {
          const propName = currentProp.charAt(0).toUpperCase() + currentProp.slice(1);
          const propValue = results[num][currentProp];
          formatted += `<h2>${propName}: ${propValue}</h2>\n`;
        }
      }
    }
    formatted += '</div>\n';
  }

  // Returning the formatted string
  return formatted;
};

// Dummy method so ESLint doesn't squawk at me
const testFormat = () => {
  if (dummyFormat) {
    FormatSearchResults(null, null);
    FormatDisplaySong(null);
    FormatPlaylist(null);
    FormatChartsTable(null);
  }
};

// Firing the dummyFormat method
testFormat();