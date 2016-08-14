var formulaOne = location.origin.indexOf('localhost') > -1 ? 'http://localhost:3000/recruitment/application' : 'https://formula-one.herokuapp.com/recruitment/application'

var formulaGoogleEndpoint = 'https://docs.google.com/forms/d/15cZJhCpDrF9caF6-96BDtaUoxB1emT5uhW0snOnnGzE/formResponse'

// NOTE(jordan): this is currently unused
// TODO(jordan): dynamically set input[name] to googleFormMappings
//               if input[name] is not already set.

function basicXhrLogging (x) {
  if (x.status == 200) {
    console.log('Awesomesauce')
    console.log(x.responseText)
  } else {
    console.log('Not so awesomesauce. :(')
    console.log(x.status)
    console.log(x.responseText)
  }
}

function formulaOneSendData(d) {
  var x = new XMLHttpRequest()
  x.open('POST', formulaOne)
  x.setRequestHeader('Content-Type', 'application/json;charset=UTF-8')

  x.onreadystatechange = basicXhrLogging

  x.send(JSON.stringify(d))
}

function formulaGetPills (i) {
  var parent = i.parentElement
    , lPill = parent.getElementsByClassName('pill-left')[0]
    , rPill = parent.getElementsByClassName('pill-right')[0]
    , pills  = [lPill, rPill]

  function isFalsy (v) { return !v }

  return pills.every(isFalsy) ? false : pills
}

function formulaValueWithPills (i) {
  var pills = formulaGetPills(i)
    , v      = i.value.trim()

  if (!pills)
    return v

  var lText = pills[0] && pills[0].children[0].textContent
    , rText = pills[1] && pills[1].children[0].textContent

  if (lText && v.indexOf(lText) != 0) {
    v = lText + v
  }
  if (rText && v.indexOf(rText) != v.length - rText.length) {
    v = v + rText
  }

  return v.trim()
}

function formulaFormSetupGoogleSubmit (form) {
  form.action = formulaGoogleEndpoint
  form.target = 'dupe-frame'
  form.onsubmit = function (e) {
    // NOTE(jordan): Stop the page from reloading
    e.preventDefault()
    e.stopPropagation()
  }
}

function formulaSubmit () {
  var formulaForm   = qq('.formula form')[0]
    , formulaInputs = qq('.formula form input, .formula form textarea')

  var data = formulaGetData(formulaInputs)
  ;[].forEach.call(formulaInputs, function (i) {
    if (formulaGetPills(i)) {
      var key   = ( i.id || i.type )
      var cval  = data[key]
      data[key] = formulaValueWithPills(i)
    }
  })

  console.log(data)
  console.log(JSON.stringify(data))

  formulaOneSendData(data)
  // NOTE(jordan): use the callback here in case later we want to
  // do anything after successful submission, like resetting the form.
  formulaFormSetupGoogleSubmit(formulaForm)
  formulaForm.submit()

  formulaAnimator.punchTicket()
}
