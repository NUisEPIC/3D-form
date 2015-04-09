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

  return _self;
})();
