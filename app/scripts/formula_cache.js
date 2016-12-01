function formulaGetData (inputs) {
  var data = {}, cache = {}
  if (store) { // NOTE(jordan): if store.js is available, use it
    cache = (store.get('formula_progress') || cache)
    data.lastCacheTime = cache.lastCacheTime
  }
  ;[].forEach.call(inputs, function (i) {
    var key = ( i.id || i.type )
    var cachedValue   = cache[key]
    if ( i.type == 'checkbox' ) {
      data[key] = i.checked = cachedValue
    }
    else if (!___loaded && cachedValue && !i.value.trim()) {
      // NOTE(jordan): if we have a cached version when the input
      // is blank, load the cached version into the form.
      data[key] = i.value = cachedValue, i.onchange()
    } else {
      data[key] = i.value
    }
  })
  return data
}

function formulaCacheSet (i) {
  var cache = store.get('formula_progress')
  var v = i.type == 'checkbox' ? i.checked : i.value.trim()
  cache[( i.id || i.type )] = v
  store.set('formula_progress', cache)
}

function formulaCacheData (inputs) {
  if (! store) return console.warn('localStorage not supported, progress will not be saved.')

  var pageData = formulaGetData(inputs)
  var cache  = (store.get('formula_progress') || {})
  var changeOccurred = false
  // Only update the cache at most once every 5s
  if ((Date.now() - cache.lastCacheTime) < 5000)
    return
  for (var key in pageData) {
    var cacheValue = cache[key]
    var pageValue  = pageData[key]
    if (cacheValue != pageValue) {
      changeOccurred = true
      cache[key] = pageData[key]
    }
  }
  if (changeOccurred) {
    cache.lastCacheTime = Date.now()
    store.set('formula_progress', cache)

    if (formulaNotify) formulaNotify.notify('Changes saved.')
  }
}
