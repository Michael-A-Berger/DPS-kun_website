const fs = require('fs');

// Getting the web pages and their resources
const indexPage = fs.readFileSync(`${__dirname}/../client/index.html`);
const indexStyle = fs.readFileSync(`${__dirname}/../client/index.css`);

// GetIndexPage()
const getIndexPage = (rq, rp) => {
  rp.writeHead(200, { 'Content-Type': 'text/html' });
  rp.write(indexPage);
  rp.end();
};

// GetIndexStyle()
const getIndexStyle = (rq, rp) => {
  rp.writeHead(200, { 'Content-Type': 'text/css' });
  rp.write(indexStyle);
  rp.end();
};

// Exports
module.exports = {
  getIndexPage,
  getIndexStyle,
};
