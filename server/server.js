const http = require('http');
const url = require('url');
const apiHandler = require('./apiResponses.js');
const htmlHandler = require('./htmlResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

// undefinedOrNull()
const undefinedOrNull = object => (object === undefined || object === null);

// GET URL struct
const urlStructGet = {
  '/': htmlHandler.GetIndexPage,
  '/search': htmlHandler.GetSearchPage,
  '/playlists': htmlHandler.GetPlaylistsPage,
  '/create_playlist': htmlHandler.GetCreatePlaylistPage,
  '/api_guide': htmlHandler.GetApiGuidePage,
  '/index.css': htmlHandler.GetIndexStyle,
  '/list.js': htmlHandler.GetListsJs,
  '/search-song.js': htmlHandler.GetSearchSongsJs,
  '/format.js': htmlHandler.GetFormatJs,
  '/api/': apiHandler.GetSongs,
  notFound: apiHandler.NotFound,
};

// POST URL struct
const urlStructPost = {
  '/api/addlist': apiHandler.PostData,
  notFound: apiHandler.notFound,
};

// GetParams()
const GetParams = (query) => {
  const params = {};
  if (!undefinedOrNull(query)) {
    const paramsList = query.split('&');
    for (let num = 0; num < paramsList.length; num++) {
      paramsList[num] = paramsList[num].split('=');
      params[paramsList[num][0]] = (paramsList[num][1] ? paramsList[num][1] : -1);
    }
  }
  return params;
};

// HandleGET()
const HandleGET = (rq, rp) => {
  const parsedUrl = url.parse(rq.url);
  const params = GetParams(parsedUrl.query);

  if (urlStructGet[parsedUrl.pathname]) {
    urlStructGet[parsedUrl.pathname](rq, rp, params);
  } else {
    urlStructGet.notFound(rq, rp);
  }
};

// HandlePOST()
const HandlePOST = (rq, rp) => {
  const parsedUrl = url.parse(rq.url);

  if (urlStructPost[parsedUrl.pathname]) {
    // Creating the Response copy + a POST body
    const rpCopy = rp;
    const body = [];

    // IF the upload stream gets interrupted...
    rq.on('error', (err) => {
      console.dir(err);
      rpCopy.statusCode = 400;
      rpCopy.end();
    });

    // WHEN new data from the upload stream comes in...
    rq.on('data', (chunk) => {
      body.push(chunk);
    });

    // WHEN the upload stream is done...
    rq.on('end', () => {
      const bodyString = Buffer.concat(body).toString();
      const bodyParams = GetParams(bodyString);
      console.log('- POST success! Retrieved body:');
      console.dir(bodyParams);
      urlStructPost[parsedUrl.pathname](rq, rpCopy, bodyParams);
    });
  } else {
    urlStructPost.notFound(rq, rp);
  }
};

// OnRequest
const OnRequest = (request, response) => {
  console.log(`${request.url} + ${request.method}`);

  if (request.method === 'GET') {
    HandleGET(request, response);
  } else if (request.method === 'POST') {
    HandlePOST(request, response);
  } else {
    urlStructGet.NotFound(request, response);
  }
};

// Running the server
http.createServer(OnRequest).listen(port);
console.log(`Listening on 127.0.0.1:${port}...`);
