const dummySearch = false;

// SearchDatabase()
const SearchDatabase = (originalXhr, phrase, returnFunc) => {
  const xhr = originalXhr;
  xhr.onload = () => {
    if (xhr.readyState === 4) {
      let parsedJSON = {};
      if (xhr.response) {
        parsedJSON = JSON.parse(xhr.response);
        returnFunc(parsedJSON);
      }
    }
  };
  xhr.open('GET', `/api/?search=${phrase}`, true);
  xhr.setRequestHeader('Accept', 'application/json');
  xhr.send();
};

// GetRandomSong()
const GetRandomSong = (originalXhr, returnFunc) => {
  const xhr = originalXhr;
  xhr.onload = () => {
    if (xhr.readyState === 4) {
      let parsedJSON = {};
      if (xhr.response) {
        parsedJSON = JSON.parse(xhr.response);
        returnFunc(parsedJSON);
      }
    }
  };
  xhr.open('GET', '/api/?random', true);
  xhr.setRequestHeader('Accept', 'application/json');
  xhr.send();
};

// Dummy method so ESLint doesn't squawk at me
const testSearch = () => {
  if (dummySearch) {
    SearchDatabase(null, null, null);
    GetRandomSong(null, null);
  }
};

// Firing the dummySearch method
testSearch();
