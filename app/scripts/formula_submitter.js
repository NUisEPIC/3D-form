var formula_one = location.origin.indexOf('localhost') > -1 ? 'http://localhost:3000/recruitment/application' : 'https://formula-one.herokuapp.com/recruitment/application';

var formula_google_endpoint = 'https://docs.google.com/forms/d/15cZJhCpDrF9caF6-96BDtaUoxB1emT5uhW0snOnnGzE/formResponse';

// NOTE(jordan): this is currently unused
// TODO(jordan): dynamically set input[name] to google_form_mappings
//               if input[name] is not already set.

function basic_xhr_logging (x) {
  if (x.status == 200) {
    console.log('Awesomesauce');
    console.log(x.responseText);
  } else {
    console.log('Not so awesomesauce. :(');
    console.log(x.status);
    console.log(x.responseText);
  }
}

function formula_one_send_data(d) {
  var x = new XMLHttpRequest();
  x.open('POST', formula_one);
  x.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');

  x.onreadystatechange = basic_xhr_logging;

  x.send(JSON.stringify(d));
}

function formula_get_pills (i) {
  var parent = i.parentElement
    , l_pill = parent.getElementsByClassName('pill-left')[0]
    , r_pill = parent.getElementsByClassName('pill-right')[0]
    , pills  = [l_pill, r_pill];

  function isFalsy (v) { return !v };

  return pills.every(isFalsy) ? false : pills;
}

function formula_value_with_pills (i) {
  var pills = formula_get_pills(i)
    , v      = i.value.trim();

  if (! pills)
    return v;

  var l_text = pills[0] && pills[0].children[0].textContent
    , r_text = pills[1] && pills[1].children[0].textContent;

  if (l_text && v.indexOf(l_text) != 0) {
    v = l_text + v;
  }
  if (r_text && v.indexOf(r_text) != v.length - r_text.length) {
    v = v + r_text;
  }

  return v.trim();
}

function formula_form_setup_google_submit (form) {
  form.action = formula_google_endpoint;
  form.target = 'dupe-frame';
  form.onsubmit = function (e) {
    // NOTE(jordan): Stop the page from reloading
    e.preventDefault();
    e.stopPropagation();
  }
}

function formula_submit () {
  var formula_form   = qq('.formula form')[0]
    , formula_inputs = qq('.formula form input, .formula form textarea');

  var data = formula_get_data(formula_inputs);
  [].forEach.call(formula_inputs, function (i) {
    if (formula_get_pills(i)) {
      var key   = ( i.id || i.type );
      var cval  = data[key];
      data[key] = formula_value_with_pills(i);
    }
  });

  console.log(data);
  console.log(JSON.stringify(data));

  formula_one_send_data(data);
  // NOTE(jordan): use the callback here in case later we want to
  // do anything after successful submission, like resetting the form.
  formula_form_setup_google_submit(formula_form);
  formula_form.submit();

  formula_animator.punchTicket();
}
