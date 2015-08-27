function addClass (el, c) {
  var i = el.className.indexOf(c);
  if(i > -1) return el;
  else return (el.className = (el.className + ' ' + c.trim()), el);
}

function removeClass (el, c) {
  var i = el.className.indexOf(c);
  if(i < 0) return el;
  else return (el.className = el.className.replace(c.trim(), '')
               .replace('  ', ' '),
               el);
}

function extend(el) {
  function extender(el) {
    el.addClass = function(c) {
      return addClass(el, c);
    }
    el.removeClass = function(c) {
      return removeClass(el, c);
    }
    return el;
  }

  if (el.addClass && el.removeClass) return el;

  if (el instanceof NodeList) {
    [].forEach.call(el, extender);
    return el;
  }

  return extender(el);
}

function qq (str) { return document.querySelectorAll(str) };
