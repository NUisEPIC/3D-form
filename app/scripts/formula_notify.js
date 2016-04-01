var formula_notify = (function () {
  var _self = {};

  _self.notifyWindow = extend(document.createElement('div'));

  _self.notifyWindow.addClass('formula-notify-window');

  _self.notifyWindow.isAppended = false;

  _self.notify = function (msg, duration) {
    if (! _self.notifyWindow.isAppended) {
      document.body.appendChild(_self.notifyWindow);
    }

    _self.notifyWindow.textContent = msg;

    _self.notifyWindow.style.display = 'block';
    setTimeout(function () {
      _self.notifyWindow.style.opacity = 1;
      setTimeout(function () {
        _self.notifyWindow.style.opacity = 0;
        setTimeout(function () {
          _self.notifyWindow.style.display = 'none';
        }, 200);
      }, duration || 2000)
    }, 200);
  };

  return _self;
})();
