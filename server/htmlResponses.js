const fs = require('fs');

// Getting the web pages and their resources
const indexPage = fs.readFileSync(`${__dirname}/../client/index.html`);
const searchPage = fs.readFileSync(`${__dirname}/../client/search.html`);
const playlistsPage = fs.readFileSync(`${__dirname}/../client/playlists.html`);
const createPlaylistPage = fs.readFileSync(`${__dirname}/../client/create_playlist.html`);
const apiGuidePage = fs.readFileSync(`${__dirname}/../client/api_guide.html`);
const indexStyle = fs.readFileSync(`${__dirname}/../client/index.css`);
const listJs = fs.readFileSync(`${__dirname}/../client/list.js`);
const searchSongJs = fs.readFileSync(`${__dirname}/../client/search-song.js`);
const formatJs = fs.readFileSync(`${__dirname}/../client/format.js`);

// ReturnWebResource()
const ReturnWebResource = (rq, rp, contentType, resource) => {
  rp.writeHead(200, { 'Content-Type': contentType });
  rp.write(resource);
  rp.end();
};

// GetIndexPage()
const GetIndexPage = (rq, rp) => {
  ReturnWebResource(rq, rp, 'text/html', indexPage);
};

// GetSearchPage()
const GetSearchPage = (rq, rp) => {
  ReturnWebResource(rq, rp, 'text/html', searchPage);
};

// GetPlaylistsPage()
const GetPlaylistsPage = (rq, rp) => {
  ReturnWebResource(rq, rp, 'text/html', playlistsPage);
};

// GetCreatePlaylistPage()
const GetCreatePlaylistPage = (rq, rp) => {
  ReturnWebResource(rq, rp, 'text/html', createPlaylistPage);
};

// GetApiGuidePage()
const GetApiGuidePage = (rq, rp) => {
  ReturnWebResource(rq, rp, 'text/html', apiGuidePage);
};

// GetIndexStyle()
const GetIndexStyle = (rq, rp) => {
  ReturnWebResource(rq, rp, 'text/css', indexStyle);
};

// GetListsJs()
const GetListsJs = (rq, rp) => {
  ReturnWebResource(rq, rp, 'application/json', listJs);
};

// GetSearchSongJs()
const GetSearchSongsJs = (rq, rp) => {
  ReturnWebResource(rq, rp, 'application/json', searchSongJs);
};

// GetFormatJs()
const GetFormatJs = (rq, rp) => {
  ReturnWebResource(rq, rp, 'application/json', formatJs);
};

// Exports
module.exports = {
  GetIndexPage,
  GetSearchPage,
  GetPlaylistsPage,
  GetCreatePlaylistPage,
  GetApiGuidePage,
  GetIndexStyle,
  GetListsJs,
  GetSearchSongsJs,
  GetFormatJs,
};
