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
  var v = i.value.trim();
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

function adjustPadding() {
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
}

closeWarningBtn = qq('a[do*="close-warning"]')[0];

closeWarningBtn.onclick = function (e) {
  var p = e.target.parentElement.parentElement;
  extend(p);
  p.addClass('dismissed');
}

nextBtn = qq('.next-btn')[0];
var formula_one = location.origin.indexOf('localhost') > -1 ? 'http://localhost:3000/recruitment/signup' : 'http://formula-one.herokuapp.com/recruitment/signup';

function sendData(d) {
  var x = new XMLHttpRequest();
  x.open('POST', formula_one);
  x.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
  x.onreadystatechange = function (x) {
    if (x.status == 200) {
      console.log('Awesomesauce');
      console.log(x.responseText);
    } else {
      console.log('Not so awesomesauce. :(');
      console.log(x.status);
      console.log(x.responseText);
    }
  }
  x.send(JSON.stringify(d));
}

nextBtn.onclick = function () {
  var data = {};
  [].forEach.call(formula_form.elements,
                  function(i) {
                    var v = i.value;
                    if (i.type == 'email') v = v.indexOf('.edu') > -1 && v.indexOf('.edu') === v.length - 4 ? v : v + '.edu';
                    data[(i.id || i.type)] = v.trim()
  });

  console.log(data);
  console.log(JSON.stringify(data));

  sendData(data);
  var googleFormEndpoint = 'https://docs.google.com/forms/d/1-oSLlkRTzro4FN51bySlMfbGVWGhQrmxFnhU4r-HwA4/formResponse';
  var googleFormMappings = {
    name: 'entry_2104495372',
    email: 'entry_1061169608',
    hearsay: 'entry_1597876375'
  }

  formula_form.action = googleFormEndpoint;
  formula_form.target = 'dupe-frame';
  formula_form.onsubmit = function(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  formula_form.submit();

  formula.removeClass('persp');
  var delay = 3000;
  setTimeout(function () { formula.addClass('punched') }, 500);
  setTimeout(function () { formula.addClass('end') }, delay);
}

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

  // NOTE(jordan): gross gross gross gross gross
  adjustPadding();

  window.onresize = adjustPadding;
}
