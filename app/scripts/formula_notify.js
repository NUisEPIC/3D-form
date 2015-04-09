var formula_notify = (function () {
  var _self = {};

  _self.notifyWindow = document.createElement('div');

  extend(_self.notifyWindow);

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
      }, duration || 5000)
    }, 200);
  };

  return _self;
})();
