var formulaOne = 'https://nuisepic.com/api/recruitment/application'

function basicXhrLogging (x) {
  if (x.status == 200) {
    console.log('Good.')
    console.log(x.responseText)
  } else {
    console.log('Not so good. :(')
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

function formulaSubmit () {
  var formulaInputs = qq('.formula form input, .formula form textarea')

  var data = formulaGetData(formulaInputs)
  ;[].forEach.call(formulaInputs, function (i) {
  })

  data.firstName = data.name.split(' ')[0]
  data.lastName = data.name.split(' ').slice(1).join(' ')

  console.log(data)
  console.log(JSON.stringify(data))

  formulaOneSendData(data)
  formulaAnimator.punchTicket()
}
