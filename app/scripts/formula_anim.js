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
    setTimeout(function () { formula.addClass('persp'); }, 500);
  }

  _self.unTilt = function () {
    var formula = _self.formula;
    setTimeout(function () { formula.removeClass('persp') }, 500);
  }

  _self.reset = function () {
    // NOTE(jordan): if I used timeouts this could animate smoothly
    _self.formula.removeClass('persp')
                 .removeClass('end')
                 .removeClass('punched');
  }

  _self.nextPage = function () {
    var current_page = extend(qq('.page.current')[0])
      , next_page    = extend(current_page.nextElementSibling);

    if (!next_page || next_page.className.indexOf('page') === -1)
      return;

    current_page.addClass('prev');
    next_page.addClass('next');

    _self.formula.removeClass('persp').addClass('shuffle');
    setTimeout(function () {
      next_page.addClass('current');
      current_page.removeClass('current');
      setTimeout(function () {
        next_page.removeClass('next');
        current_page.removeClass('prev');
        _self.formula.removeClass('shuffle');
      }, 100);
    }, 500);
  }

  _self.previousPage = function () {
    var current_page = extend(qq('.page.current')[0])
      , prev_page    = extend(current_page.previousElementSibling);

    if (!prev_page || prev_page.className.indexOf('page') === -1)
      return;

    current_page.addClass('prev');
    prev_page.addClass('next');

    _self.formula.addClass('shuffle').addClass('reverse');
    setTimeout(function () {
      prev_page.addClass('current');
      current_page.removeClass('current');
      setTimeout(function () {
        prev_page.removeClass('next');
        current_page.removeClass('prev');
        _self.formula.removeClass('shuffle')
                     .removeClass('reverse');
      }, 100);
    }, 500);
  }

  return _self;
})();
