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

[].forEach.call(formula_inputs, extend);

[].forEach.call(formula_inputs, function(input) {
  console.log(input.value);
  if (input.value.length > 0) {
    input.addClass('focus');
  }
  input.onchange = input.onblur = function() {
    if(input.value.length === 0) {
      input.removeClass('focus');
    } else { input.addClass('focus'); }
  }
  input.onkeyup = function() { 
    if ([].map.call(formula_inputs, validateInput).every(isValid)) {
      formIsValid();
    } else {
      formIsInvalid();
    }
  }
});

if ([].map.call(formula_inputs, validateInput).every(isValid)) {
  formIsValid();
}

[].forEach.call(formula_labels, function(label) {
  label.onclick = function(e) {
    label.previousElementSibling.addClass('focus');
    label.previousElementSibling.focus();
  }
});

function isValid(i) {
  return i === true;
}

var inputIsValid;

function validateInput(i) {
  inputIsValid = false;
  if (!i.required) return true;
  switch(i.type) {
      case "email": 
        inputIsValid = /\w+@[A-z0-9.]+/.test(i.value);
        break;
      case "password": 
        var v = i.value;
        inputIsValid = v.length > 8 && 
                       /\d+/.test(v) &&
                       /[_\-!@#$%^&* `~]/.test(v);
        break;
      default: 
        inputIsValid = i.value.length > 0;
  }
  console.log(i.nextElementSibling.textContent + " valid? " + inputIsValid);
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
