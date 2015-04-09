var formula_one = location.origin.indexOf('localhost') > -1 ? 'http://localhost:3000/recruitment/application' : 'http://formula-one.herokuapp.com/recruitment/application';

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

function formula_value_with_pills (i) {
  var parent = i.parentElement
    , l_pill = parent.getElementsByClassName('pill-left')[0]
    , r_pill = parent.getElementsByClassName('pill-right')[0]
    // NOTE(jordan): pills should have 1 child, a span containing text
    , l_text = l_pill ? l_pill.children[0].innerText : ''
    , r_text = r_pill ? r_pill.children[0].innerText : ''
    , v      = i.value.trim();

  if (l_pill && v.indexOf(l_text) != 0) {
    v = l_text + v;
  }
  if (r_pill && v.indexOf(r_text) != v.length - r_text.length) {
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

  function get_form_data (inputs) {
    var data = {};
    [].forEach.call(inputs, function (i) {
      data[( i.id || i.type )] = formula_value_with_pills(i);
    });
    return data;
  }

  var data = get_form_data(formula_inputs);

  console.log(data);
  console.log(JSON.stringify(data));

  formula_one_send_data(data);
  // NOTE(jordan): use the callback here in case later we want to
  // do anything after successful submission, like resetting the form.
  formula_form_setup_google_submit(formula_form);
  formula_form.submit();

  formula_animator.punchTicket();
}
