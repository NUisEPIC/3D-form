// NOTE(jordan): this is currently unused
// TODO(jordan): dynamically set input[name] to google_form_mappings
//               if input[name] is not already set.

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
  // NOTE(jordan): Stop the page from reloading
  form.target = 'dupe-frame';
  form.onsubmit = function (e) {
    e.preventDefault();
    e.stopPropagation();
  }
}

function formula_submit () {
  var formula_form   = qq('.formula form')[0]
    , formula_inputs = qq('.formula form input, .formula form textarea, .formula form select');


  var data = formula_get_data(formula_inputs);
  [].forEach.call(formula_inputs, function (i) {
    if (formula_get_pills(i)) {
      var key   = ( i.id || i.type );
      var cval  = data[key];
      data[key] = formula_value_with_pills(i);
    }
  });

  formula_sync_server(data);

  formula_animator.punchTicket();
}
