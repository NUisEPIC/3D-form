addClass = function(el, c) {
  var i = el.className.indexOf(c);
  if(i > -1) return el;
  else return (el.className = (el.className + ' ' + c.trim()).trimLeft(), el); 
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
var formula         = extend(qq('.formula')[0]);

[].forEach.call(formula_inputs, function(input) {
  console.log(input.value);
  input.onchange = input.onblur = function() {
    if(input.value.length === 0) {
      input.removeClass('focus');
    } else { input.addClass('focus'); }
  }
  input.onkeyup = function() { 
    if ([].map.call(formula_inputs, validateInput).every(isTrue)) {
      formIsValid();
    } else {
      formIsInvalid();
    }
  }
});

[].forEach.call(formula_labels, function(label) {
  console.log(label.textContent);
  label.onclick = function(e) {
    label.previousElementSibling.addClass('focus');
    label.previousElementSibling.focus();
    label.parentElement.focus();
  }
});

[].forEach.call(formula_inputs, extend);

function isTrue(i) {
  return i === true;
}

var inputIsValid;

function validateInput(i) {
  console.log(i.type);
  inputIsValid = false;
  switch(i.type) {
      case "email": 
        inputIsValid = /\w+@[A-z0-9.]+/.test(i.value);
        break;
      case "password": 
        var v = i.value;
        inputIsValid = v.length > 8 && 
                       /\d+/.test(v) &&
                       /[_\-!@#$%^&* `~]/.test(v);
        console.log(v.length > 8);
        console.log(/\d+/.test(v));
        console.log(/[_\-!@#$%^&* `~]/.test(v));
        break;
      default: 
        inputIsValid = i.value.length > 0;
  }
  console.log(i.nextElementSibling.textContent + " isvalid? " + inputIsValid);
  inputIsValid ? i.addClass("valid") : i.removeClass("valid");
  return inputIsValid;
}

function formIsValid() {
  if(this.go) (clearTimeout(this.go), delete this.go);
  this.go = setTimeout(function() { formula.addClass('persp'); }, 500);
}

function formIsInvalid() {
  setTimeout(function() { formula.removeClass('persp') }, 500);
}
