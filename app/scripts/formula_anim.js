var formula_animator = (function () {
  var _self = {};

  _self.formula = extend(qq('.formula')[0]);

  _self.punchTicket = function () {
    var formula = _self.formula;

    formula.removeClass('persp');

    setTimeout(function () { formula.addClass('punched') }, 500);
    setTimeout(function () { formula.addClass('end') }, 3000);
  }

  _self.tilt = function () {
    var formula = _self.formula;
    formula.addClass('persp');
  }

  _self.unTilt = function () {
    var formula = _self.formula;
    formula.removeClass('persp');
  }

  _self.reset = function () {
    // NOTE(jordan): if I used timeouts this could animate smoothly
    ['persp', 'end', 'punched', 'shuffle', 'reverse']
      .map(_self.formula.removeClass)
  }

  _self.calculateTimings = function (t_array) {
    var time_total = 0;
    return t_array.map(function (t) {
      return time_total += t;
    });
  }

  function page_shuffle(from, to, options) {
    var timings = [500, 100, 500];
    var pre, post;

    if (options instanceof Object)
      pre = options.pre, post = options.post;

    timings = _self.calculateTimings(timings);

    if (!to || to.className.indexOf('page') === -1)
      return;

    from.addClass('prev');
    to.addClass('next');

    from.style.opacity = '1';

    _self.reset();
    _self.formula.addClass('shuffle');
    pre && pre();

    setTimeout(function () {
      to.addClass('current');
      from.removeClass('current');
    }, timings[0]);

    setTimeout(function () {
      to.removeClass('next');
      from.removeClass('prev');
      _self.formula.removeClass('shuffle');
      post && post();
    }, timings[1]);

    setTimeout(function () {
      from.style.opacity = '';
    }, timings[2]);
  }

  _self.nextPage = function (current_page, next_page, cb) {
    if (next_page instanceof Function)
      cb = next_page, next_page = null;

    page_shuffle(current_page, next_page, {post: cb});
  }

  _self.previousPage = function (current_page, prev_page, cb) {
    if (prev_page instanceof Function)
      cb = prev_page, prev_page = null;

    var pre = function () {
      _self.formula.addClass('reverse');
    }

    var post = function () {
      _self.formula.removeClass('reverse');
      if (cb instanceof Function) cb();
    }

    page_shuffle(current_page, prev_page, {pre: pre, post: post});
  }

  return _self;
})();
