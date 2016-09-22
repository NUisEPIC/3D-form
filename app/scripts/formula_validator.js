var formulaDefaultValidators = {
  email: function (i, v) {
    return /\w+@[A-z0-9.\-]+/.test(v)
  },
  password: function (i, v) {
    var specialChars = /[\-!@#$%^&* `~]/
    return v.length > 8
           && /\d+/.test(v)
           && specialChars.test(v)
  },
  textName: function (i, v) {
    var ns = v.split(/\s+/)
    return v.length > 0 && ns.length == 2
                        && ns[0].length > 0
                        && ns[1].length > 0
  },
  tel: function (i, v) {
    var telSegs = v.split(/[-\s.]/)
    console.log(telSegs)
    var areaCode = telSegs[0].replace(/[()]/g, '')
    return (telSegs.length == 3
            && areaCode.length == 3 && !isNaN(parseInt(areaCode))
            && telSegs[1].length == 3 && !isNaN(parseInt(telSegs[1]))
            && telSegs[2].length == 4 && !isNaN(parseInt(telSegs[2])))
           || (/\d{10}/.test(v) && !isNaN(parseInt(v)))
  },
  textYear: function (i, v) {
    return /\d{4}/.test(v) && parseInt(v) >= 2015
  },
  checkbox: function (i, v) {
    var checkBoxGroup = i.parentElement.children
    var valid = false
    ;[].forEach.call(checkBoxGroup, function (c) {
      if (c.checked) valid = true
    })
    return valid
  }
}

var formulaValidators = formulaDefaultValidators

function formulaSetValidators (newValidators) {
  newValidators = newValidators || {}

  // NOTE(jordan): validators = .extend(validators, newValidators)
  for (var validatorName in newValidators)
    formulaValidators[validatorName] = newValidators[validatorName]
}

function formulaValidateInput (i) {
  var inputIsValid = false

  if (!i.required) return true

  // NOTE(jordan): clean up after those dirty, dirty users ;)
  var value = i.value.trim()
    , type  = i.type
    , id    = i.id

  // NOTE(jordan): alias for ease of access
  var validators = formulaValidators

  // NOTE(jordan): perform validation
  if (type in validators) {
    console.log('Validating ' + type + '...')
    console.log('With: ', validators[type])
    inputIsValid = validators[type](i, value)
  } else {
    var typeId = type + '' + id
    if (typeId in validators) {
      console.log('Validating type/id ' + typeId + '...')
      console.log('With: ', validators[typeId])
      inputIsValid = validators[typeId](i, value)
    } else {
      // NOTE(jordan): default
      console.log('Validating ' + type + '...')
      console.log('With: failover validator')
      inputIsValid = value.length > 0
    }
  }

  // NOTE(jordan): i.next...Sibling.text... gets the content of the label
  console.log(i.nextElementSibling && i.nextElementSibling.textContent + " valid? " + inputIsValid)

  inputIsValid ? i.addClass('valid') : i.removeClass('valid')

  return inputIsValid
}

function formulaInputsValid (inputs) {
  function isValid(v) { return v === true; }

  return [].map.call(inputs, formulaValidateInput).every(isValid)
}

function formulaPageIsValid (inputs) {
  // NOTE(jordan): reset timeout every time this is called
  formulaCacheData(inputs)
  //formulaAnimator.tilt()
}

function formulaPageIsInvalid () {
  //formulaAnimator.unTilt()
}

var validateTimer

function formulaValidate (inputs, delay, valid, invalid) {
  if (validateTimer) clearTimeout(validateTimer)

  validateTimer = setTimeout(function () {
    valid    = valid   || formulaPageIsValid
    invalid  = invalid || formulaPageIsInvalid

    if (formulaInputsValid(inputs)) {
      valid(inputs)
    } else {
      invalid()
    }
  }, delay || 500)
}
