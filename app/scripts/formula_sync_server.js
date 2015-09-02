
var formula_sync_url = '/application-session/'
                       + location.hash.substr(1).split(':')[1] || ''

function formula_sync_server (data, then) {
  var xhr = new XMLHttpRequest();

  xhr.open('PUT', formula_sync_url);

  xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');

  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && xhr.status == 200) {
      console.log('synced');
      then && then();
    } else if (xhr.status && xhr.status != 200) {
      console.log('sync seems to have failed');
    }
  }

  xhr.send(JSON.stringify(data));
}

function formula_load_server (then) {
  var xhr = new XMLHttpRequest();

  xhr.open('GET', formula_sync_url);

  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && xhr.status == 200) {
      console.log('loaded from server')
      then && then(JSON.parse(xhr.responseText));
    } else if (xhr.status && xhr.status != 200) {
      console.log('server load fail');
    }
  }

  xhr.send();
}
