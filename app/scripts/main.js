// NOTE(jordan): requires: extensions.js, formula_validation.js,
//               formula_submitter.js

// NOTE(jordan): I wish I didn't have to do this in JS
function adjustPadding () {
  var inputGroupElements = qq('.input-group input~*')
    , basePad = 15
    , width = 0
    , padLeft = basePad
    , padRight = basePad;

  [].forEach.call(inputGroupElements, function(p) {
    var siblings  = p.parentElement.children
      , groupSize = siblings.length
      , lastChild = siblings[groupSize - 1]
      , nearestInput = siblings[0];

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

function closeWarning (clickEvent) {
  var p = clickEvent.target.parentElement.parentElement;
  extend(p);
  p.addClass('dismissed');
}

function formula_setup_inputs (inputs) {
  console.log(inputs);

  extend(inputs);

  function input_focus (e) {
    var input = e.target;
    input.value.length === 0 ? input.removeClass('focus')
                             : input.addClass('focus');
  }

  function label_focus (e) {
    var label = e.target;
    label.previousElementSibling.addClass('focus');
    label.previousElementSibling.focus();
  }

  var pages = qq('.page');

  [].forEach.call(pages, function (page) {
    var inputs = page.getElementsByTagName('input');
    var page_validator = function () { formula_validate(inputs) };

    [].forEach.call(inputs, function (i) {
      i.onchange = i.onblur = input_focus;
      i.onkeyup  = page_validator;

      if (i.value.length > 0) i.addClass('focus');

      var label = i.nextElementSibling;
      label.onclick = label_focus;
    });
  });
}

window.onload = function() {
  var formula_inputs = qq('.formula input');

  var nextBtn = qq('.next-btn')[0];

  var current_page_inputs = qq('.formula .page.current input');

  formula_setup_inputs(formula_inputs);

  formula_validate(current_page_inputs);

  // NOTE(jordan): gross gross gross gross gross
  adjustPadding();

  window.onresize = adjustPadding;

  // NOTE(jordan): make mobile warning dismissable
  var closeWarningBtn = qq('a[do*="close-warning"]')[0];

  closeWarningBtn.onclick = closeWarning;
}
