
function formula_cache_init (then) {
  var id    = location.hash.substr(1).split(':')
    , email = id[0]
    , hash  = id[1]
    , cache = { }

  var cache = (store.get('formula_progress') || cache);

  formula_load_server(function (server_cache) {
    if ( !cache['email'] || cache['email'] != email) {
      // NOTE(jordan): data corrupt; wipe it
      cache = { }, cache['email'] = email
    }

    for (var key in server_cache) {
      if (server_cache[key])
        cache[key] = server_cache[key]
    }

    store.set('formula_progress', cache);
    formula_sync_server(cache);
    then();
  })
}

function formula_load_data (inputs) {
  var data = {}, cache = {};
  if (store) {
    cache = (store.get('formula_progress') || cache);
    data.last_cache_time = cache.last_cache_time;
  }
  [].forEach.call(inputs, function (i) {
    var key = i.type == 'radio' ? i.name : ( i.id || i.type );
    var cachedValue   = cache[key];
    if ( i.type == 'checkbox') {
      data[key] = i.checked = cachedValue;
    }
    else if (i.type == 'radio') {
      data[key] = cachedValue;
      i.checked = cachedValue == i.value;
    }
    else if (cachedValue && !i.value.trim()) {
      // NOTE(jordan): if we have a cached version when the input
      // is blank, load the cached version into the form.
      data[key] = i.value = cachedValue;
      i.onchange();
    } else {
      data[key] = i.value;
    }
  });
  return data;
}
function formula_get_data (inputs) {
  var data = {}, cache = {};
  if (store) {
    cache = (store.get('formula_progress') || cache);
    data.last_cache_time = cache.last_cache_time;
  }
  [].forEach.call(inputs, function (i) {
    var key = i.type == 'radio' ? i.name : ( i.id || i.type );
    var cachedValue   = cache[key];
    if ( i.type == 'checkbox') {
      data[key] = i.checked;
    }
    else if (i.type == 'radio') {
      i.checked = cachedValue == i.value;
      if (i.checked)
        data[key] = i.value;
    }
    else {
      data[key] = i.value;
    }
  });
  return data;
}

function formula_cache_set (i) {
  var cache = store.get('formula_progress');

  if (i.type == 'radio') {
    cache[ i.name ] = i.value || i.checked
  } else {
    var v = i.type == 'checkbox' ? i.checked : i.value.trim()
    cache[( i.id || i.type )] = v;
  }

  store.set('formula_progress', cache);
}

function formula_cache_data (inputs) {
  if (! store) return console.warn('localStorage not supported, progress will not be saved.');

  var page_data = formula_get_data(inputs);
  var cache  = (store.get('formula_progress') || {});
  if (Date.now() - cache.last_cache_time < 1000)
    return;

  var changeOccurred = false;
  for (var key in page_data) {
    var cacheValue = cache[key];
    var pageValue  = page_data[key];
    if (cacheValue != pageValue) {
      changeOccurred = true;
      cache[key] = page_data[key];
    }
  }

  if (changeOccurred) {
    cache.last_cache_time = Date.now();
    store.set('formula_progress', cache);

    formula_sync_server(cache, function () {
      if (formula_notify) formula_notify.notify('Changes saved.');
    });
  }
}
