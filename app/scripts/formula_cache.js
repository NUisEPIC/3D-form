
function formula_get_data (inputs) {
  var data = {}, cache = {};
  if (store) {
    cache = (store.get('formula_progress') || cache);
    data.last_cache_time = cache.last_cache_time;
  }
  [].forEach.call(inputs, function (i) {
    var key = ( i.id || i.type );
    var cachedValue   = cache[key];
    if ( i.type == 'checkbox' ) {
      data[key] = i.checked = cachedValue;
    }
    else if (cachedValue && !i.value.trim()) {
      // NOTE(jordan): if we have a cached version when the input
      // is blank, load the cached version into the form.
      data[key] = i.value = cachedValue, i.onchange();
    } else {
      data[key] = i.value;
    }
  });
  return data;
}

function formula_cache_set (i) {
  var cache = store.get('formula_progress');
  var v = i.type == 'checkbox' ? i.checked : i.value.trim();
  cache[( i.id || i.type )] = v;
  store.set('formula_progress', cache);
}

function formula_cache_data (inputs) {
  if (! store) return console.warn('localStorage not supported, progress will not be saved.');

  var page_data = formula_get_data(inputs);
  var cache  = (store.get('formula_progress') || {});
  var changeOccurred = false;
  // Only update the cache at most once every 10s
  if ((Date.now() - cache.last_cache_time) < 5000)
    return;
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

    if (formula_notify) formula_notify.notify('Changes saved.');
  }
}
