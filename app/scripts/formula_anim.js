var formulaAnimator = (function () {
  var Self = {}

  Self.formula = extend(qq('.formula')[0])

  Self.punchTicket = function () {
    var formula = Self.formula

    formula.removeClass('persp')

    setTimeout(function () { formula.addClass('punched') }, 500)
    setTimeout(function () { formula.addClass('end') }, 3000)
  }

  Self.tilt = function () {
    var formula = Self.formula
    formula.addClass('persp')
  }

  Self.unTilt = function () {
    var formula = Self.formula
    formula.removeClass('persp')
  }

  Self.reset = function () {
    // NOTE(jordan): if I used timeouts this could animate smoothly
    ['persp', 'end', 'punched', 'shuffle', 'reverse']
      .map(Self.formula.removeClass)
  }

  Self.calculateTimings = function (tArray) {
    var timeTotal = 0
    return tArray.map(function (t) {
      return timeTotal += t
    })
  }

  function pageShuffle(from, to, options) {
    var timings = [500, 100, 500]
    var pre, post

    if (options instanceof Object)
      pre = options.pre, post = options.post

    timings = Self.calculateTimings(timings)

    if (to instanceof Function)
      timings = post, post = pre, pre = to, to = from.nextElementSibling
    else if (pre instanceof Function && !post)
      post = pre, pre = null

    if (!to || to.className.indexOf('page') === -1)
      return

    from.addClass('prev')
    to.addClass('next')

    from.style.opacity = '1'

    Self.reset()
    Self.formula.addClass('shuffle')
    pre && pre()

    setTimeout(function () {
      to.addClass('current')
      from.removeClass('current')
    }, timings[0])

    setTimeout(function () {
      to.removeClass('next')
      from.removeClass('prev')
      Self.formula.removeClass('shuffle')
      post && post()
    }, timings[1])

    setTimeout(function () {
      from.style.opacity = ''
    }, timings[2])
  }

  Self.nextPage = function (currentPage, nextPage, cb) {
    if (nextPage instanceof Function)
      cb = nextPage, nextPage = null

    pageShuffle(currentPage, nextPage, {post: cb})
  }

  Self.previousPage = function (currentPage, prevPage, cb) {
    if (prevPage instanceof Function)
      cb = prevPage, prevPage = null

    var pre = function () {
      Self.formula.addClass('reverse')
    }

    var post = function () {
      Self.formula.removeClass('reverse')
      if (cb instanceof Function) cb()
    }

    pageShuffle(currentPage, prevPage, {pre: pre, post: post})
  }

  return Self
})()
