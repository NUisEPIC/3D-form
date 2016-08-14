var formulaNotify = (function () {
  var Self = {}

  Self.notifyWindow = document.createElement('div')

  extend(Self.notifyWindow)

  Self.notifyWindow.addClass('formula-notify-window')

  Self.notifyWindow.isAppended = false

  Self.notify = function (msg, duration) {
    if (! Self.notifyWindow.isAppended) {
      document.body.appendChild(Self.notifyWindow)
    }

    Self.notifyWindow.textContent = msg

    Self.notifyWindow.style.display = 'block'
    setTimeout(function () {
      Self.notifyWindow.style.opacity = 1
      setTimeout(function () {
        Self.notifyWindow.style.opacity = 0
        setTimeout(function () {
          Self.notifyWindow.style.display = 'none'
        }, 200)
      }, duration || 2000)
    }, 200)
  }

  return Self
})()
