addClass = function(el, c) {
  var i = el.className.indexOf(c);
  if(i > -1) return el;
  else return (el.className = (el.className + ' ' + c.trim()), el);
}

removeClass = function(el, c) {
  var i = el.className.indexOf(c);
  if(i < 0) return el;
  else return (el.className = el.className.replace(c.trim(), '')
               .replace('  ', ' '),
               el);
}

function extend(el) {
  el.addClass = function(c) {
    addClass(el, c);
  }
  el.removeClass = function(c) {
    removeClass(el, c);
  }

  return el;
}

var qq = function(str) { return document.querySelectorAll(str) };

var formula_labels = qq('.formula label');
var formula_inputs = qq('.formula input');
var formula        = extend(qq('.formula')[0]);
var formula_form   = qq('.formula form')[0];

var current_page_inputs = qq('.formula .page.current input');

[].forEach.call(formula_inputs, extend);

[].forEach.call(formula_inputs, function(input) {
  console.log(input.value);
  input.onchange = input.onblur = function() {
    if(input.value.length === 0) {
      input.removeClass('focus');
    } else { input.addClass('focus'); }
  }
  input.onkeyup = function() {
    if ([].map.call(current_page_inputs, validateInput).every(isValid)) {
      pageIsValid();
    } else {
      pageIsInvalid();
    }
  }
});

function isValid(i) {
  return i === true;
}

var inputIsValid;

function validateInput(i) {
  inputIsValid = false;
  if (!i.required) return true;
  var v = i.value;
  switch(i.type) {
      case "email":
        inputIsValid = /\w+@[A-z0-9.]+/.test(i.value);
        break;
      case "password":
        inputIsValid = v.length > 8 &&
                       /\d+/.test(v) &&
                       /[_\-!@#$%^&* `~]/.test(v);
        break;
      case "text":
        var fallthrough;
        switch(i.id) {
          case "name":
            ns = v.split(' ');
            inputIsValid = v.length > 0 &&
                           ns.length == 2 &&
                           ns[0].length > 0 && ns[1].length > 0;
            break;
          default:
            fallthrough = true;
            break;
        }
        if (! fallthrough) break;
      default:
        inputIsValid = i.value.length > 0;
  }
  console.log(i.nextElementSibling.textContent + " valid? " + inputIsValid);
  inputIsValid ? i.addClass("valid") : i.removeClass("valid");
  return inputIsValid;
}

function pageIsValid() {
  if(this.go) (clearTimeout(this.go), delete this.go);
  this.go = setTimeout(function() { formula.addClass('persp'); }, 500);
}

function pageIsInvalid() {
  setTimeout(function() { formula.removeClass('persp') }, 500);
}

// I wish I didn't have to do this in JS

var inputGroupElements = qq('.input-group input~*')
  , nearestInput       = inputGroupElements[0].previousElementSibling;

var basePad = 15, width = 0;

var padLeft = padRight = basePad;

[].forEach.call(inputGroupElements, function(p) {

  siblings  = p.parentElement.children;
  groupSize = siblings.length;
  lastChild = siblings[groupSize - 1];
  nearestInput = siblings[0];

  if (/pill-left|glance/g.test(p.classList)) {
    padLeft += p.offsetWidth;
  }

  if (/pill-right/g.test(p.classList)) {
    padRight += p.offsetWidth;
  }

  if (p.nodeName === 'LABEL') {
    width = p.offsetWidth;
  }

  if (p === lastChild) {
    console.log("STOP");
    console.log(nearestInput);

    nearestInput.style.paddingLeft  = padLeft + "px";
    nearestInput.style.paddingRight = padRight + "px";
    nearestInput.style.width        = width + "px";

    padLeft = padRight = basePad;
  }

});

//var submitBtn = qq('.submit-btn')[0];
//
//submitBtn.onmousedown = function(e) {
//  formula.removeClass('persp');
//
//  formula.onmouseup = function(e) {
//    // FUCKING. FIREFOX. IS. A. BITCH.
//    var delay = /Chrome/g.test(navigator.userAgent) ? 1950 : 3400;
//    setTimeout(function() { formula.addClass('punched'); }, 450);
//    setTimeout(function() { formula.addClass('end'); }, delay);
//  }
//
//  document.onmouseup = function(e) {
//    formula.onmouseup = "";
//  }
//}

nextBtn = qq('.next-btn')[0];
var formula_one = 'http://formula-one.herokuapp.com/recruitment';

function sendData(d) {
  var x = new XMLHttpRequest();
  x.open('POST', formula_one);
  x.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
  x.send(JSON.stringify(d));
}

nextBtn.onclick = function () {
  var data = {};
  [].forEach.call(formula_form.elements,
                  function(i) { data[(i.id || i.type)] = i.value });

  console.log(data);
  console.log(JSON.stringify(data));

  sendData(data);

  formula.removeClass('persp');
  var delay = /Chrome/g.test(navigator.userAgent) ? 1950 : 3400;
  setTimeout(function () { formula.addClass('punched') }, 500);
  setTimeout(function () { formula.addClass('end') }, delay);
}
//nextBtn.onmousedown = function() {
//  formula.removeClass('persp');
//
//
//}

window.onload = function() {
  if ([].map.call(current_page_inputs, validateInput).every(isValid)) {
    pageIsValid();
  }

  [].forEach.call(formula_labels, function(label) {
    label.onclick = function(e) {
      label.previousElementSibling.addClass('focus');
      label.previousElementSibling.focus();
    }
  });

  [].forEach.call(formula_inputs, function(input) {
    if (input.value.length > 0) {
      input.addClass('focus');
    }
  });
}
