const dummyList = false;

// GetUserLists()
const GetUserLists = (originalXhr, returnFunc) => {
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
  xhr.open('GET', '/api/?playlists', true);
  xhr.setRequestHeader('Accept', 'application/json');
  xhr.send();
};

// AddList()
const AddList = (originalXhr, playlistString, returnFunc) => {
  const xhr = originalXhr;
  xhr.open('POST', '/api/addlist');
  xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  xhr.setRequestHeader('Accept', 'application/json');
  xhr.onload = () => {
    if (xhr.readyState === 4) {
      let parsedJSON = {};
      if (xhr.response) {
        parsedJSON = JSON.parse(xhr.response);
        returnFunc(parsedJSON);
      }
    }
  };
  xhr.send(playlistString);
};

// Dummy method so ESLint doesn't squawk at me
const testList = () => {
  if (dummyList) {
    AddList(null, null, null);
    GetUserLists(null, null);
  }
};

// Firing the dummyList method
testList();