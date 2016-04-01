var formula_default_validators = {
  email: function (i, v) {
    return /\w+@[A-z0-9.\-]+/.test(v)
  },
  password: function (i, v) {
    var special_chars = /[_\-!@#$%^&* `~]/;
    return v.length > 8
           && /\d+/.test(v)
           && special_chars.test(v);
  },
  text_name: function (i, v) {
    var ns = v.split(/\s+/);
    return v.length > 0 && ns.length == 2
                        && ns[0].length > 0
                        && ns[1].length > 0;
  },
  tel: function (i, v) {
    var telSegs = v.split(/[-\s.]/);
    console.log(telSegs);
    var areaCode = telSegs[0].replace(/[()]/g, '');
    return (telSegs.length == 3
            && areaCode.length == 3 && !isNaN(parseInt(areaCode))
            && telSegs[1].length == 3 && !isNaN(parseInt(telSegs[1]))
            && telSegs[2].length == 4 && !isNaN(parseInt(telSegs[2])))
           || (/\d{10}/.test(v) && !isNaN(parseInt(v)));
  },
  text_year: function (i, v) {
    return /\d{4}/.test(v) && parseInt(v) >= 2015;
  },
  checkbox: function (i, v) {
    var checkBoxGroup = i.parentElement.children;
    var valid = false;
    [].forEach.call(checkBoxGroup, function (c) {
      if (c.checked) valid = true;
    });
    return valid;
  },
  radio: function (i, v) {
    return [].some.call(i.parentElement.getElementsByTagName('input'),
      function (radio) {
        return radio.checked
    })
  }
}

var formula_validators = formula_default_validators;

function formula_validate_input (i) {
  var inputIsValid = false;

  // NOTE(jordan): clean up after those dirty, dirty users ;)
  var value = i.value.trim()
    , type  = i.type
    , id    = i.id;

  // NOTE(jordan): alias for ease of access
  var validators = formula_validators;

  // NOTE(jordan): perform validation
  if (type in validators) {
    console.log('Validating ' + type + '...');
    console.log('With: ', validators[type]);
    inputIsValid = validators[type](i, value);
  } else {
    var type_id = type + '_' + id;
    if (type_id in validators) {
      console.log('Validating type/id ' + type_id + '...');
      console.log('With: ', validators[type_id]);
      inputIsValid = validators[type_id](i, value);
    } else {
      // NOTE(jordan): default
      console.log('Validating ' + type + '...');
      console.log('With: failover validator');
      inputIsValid = !i.required || value.length > 0;
    }
  }

  // NOTE(jordan): i.next...Sibling.text... gets the content of the label
  console.log(i.nextElementSibling && i.nextElementSibling.textContent + " valid? " + inputIsValid);

  inputIsValid ? i.addClass('valid') : i.removeClass('valid');

  return i.required ? inputIsValid : true;
}

function formula_inputs_valid (inputs) {
  function isValid(v) { return v === true; }

  return [].map.call(inputs, formula_validate_input).every(isValid);
}

function formula_page_is_valid (inputs) {
  // NOTE(jordan): reset timeout every time this is called
  formula_cache_data(inputs);
  formula_animator.tilt();
}

function formula_page_is_invalid () {
  formula_animator.unTilt();
}

function formula_validate (inputs, delay, valid, invalid) {
  if (this.go) (clearTimeout(this.go), delete this.go);

  this.go = setTimeout(function () {
    valid    = valid   || formula_page_is_valid;
    invalid  = invalid || formula_page_is_invalid;

    if (formula_inputs_valid(inputs)) {
      valid(inputs);
    } else {
      invalid();
    }
  }, delay || 500);
}
