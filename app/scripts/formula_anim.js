var formula_animator = (function () {
  var _self = {};

  _self.formula = extend(qq('.formula')[0]);

  _self.punchTicket = function () {
    var formula = _self.formula;
    var delay = 3000;

    formula.removeClass('persp');

    setTimeout(function () { formula.addClass('punched') }, 500);
    setTimeout(function () { formula.addClass('end') }, delay);
  }

  _self.tiltToRevealButton = function () {
    var formula = _self.formula;
    formula.addClass('persp');
  }

  _self.unTilt = function () {
    var formula = _self.formula;
    formula.removeClass('persp');
  }

  _self.reset = function () {
    // NOTE(jordan): if I used timeouts this could animate smoothly
    _self.formula.removeClass('persp')
                 .removeClass('end')
                 .removeClass('punched')
                 .removeClass('shuffle')
                 .removeClass('reverse');
  }

  _self.nextPage = function (current_page, next_page, cb) {
    if (!next_page || next_page.className.indexOf('page') === -1)
      return;

    current_page.addClass('prev');
    next_page.addClass('next');

    current_page.style.opacity = '1';

    _self.reset();
    _self.formula.addClass('shuffle');
    setTimeout(function () {
      next_page.addClass('current');
      current_page.removeClass('current');
      setTimeout(function () {
        next_page.removeClass('next');
        current_page.removeClass('prev');
        _self.formula.removeClass('shuffle');
        if (cb instanceof Function) cb();
        setTimeout(function () {
          current_page.style.opacity = '';
        }, 500);
      }, 100);
    }, 500);
  }

  _self.previousPage = function (current_page, prev_page, cb) {
    if (!prev_page || prev_page.className.indexOf('page') === -1)
      return;

    current_page.addClass('prev');
    prev_page.addClass('next');

    current_page.style.opacity = '1';

    var delay = 500;

    if (_self.formula.className.indexOf('persp') !== -1) {
      _self.unTilt();
      setTimeout(function () {
        _self.formula.addClass('shuffle').addClass('reverse');
      }, delay);
      delay += 300;
    } else {
      _self.formula.addClass('shuffle').addClass('reverse');
    }
    setTimeout(function () {
      prev_page.addClass('current');
      current_page.removeClass('current');
      setTimeout(function () {
        prev_page.removeClass('next');
        current_page.removeClass('prev');
        _self.formula.removeClass('shuffle')
                     .removeClass('reverse');
        if (cb instanceof Function) cb();
        setTimeout(function () {
          current_page.style.opacity = '';
        }, 500);
      }, 100);
    }, delay);
  }

  return _self;
})();
