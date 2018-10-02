const http = require('http');
const url = require('url');
const query = require('querystring');
const apiHandler = require('./apiResponses.js');
const htmlHandler = require('./htmlResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

// GET URL struct
const urlStructGet = {
  '/': htmlHandler.getIndexPage,
  '/index.css': htmlHandler.getIndexStyle,
  '/api/': apiHandler.GetSongs,
  notFound: apiHandler.NotFound,
};

// HandleGET()
const HandleGET = (rq, rp) => {
  const parsedUrl = url.parse(rq.url);
  const params = query.parse(parsedUrl.query);

  if (urlStructGet[parsedUrl.pathname]) {
    urlStructGet[parsedUrl.pathname](rq, rp, params);
  } else {
    urlStructGet.notFound(rq, rp);
  }
};

// OnRequest
const OnRequest = (request, response) => {
  console.log(`${request.url} + ${request.method}`);

  if (request.method === 'GET') {
    HandleGET(request, response);
  }
};

// Running the server
http.createServer(OnRequest).listen(port);
console.log(`Listening on 127.0.0.1:${port}...`);
