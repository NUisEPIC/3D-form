// NOTE(jordan): requires: extensions.js, formula_validation.js,
//               formula_submitter.js

// NOTE(jordan): I wish I didn't have to do this in JS
function adjustPadding () {
  var inputGroupElements = qq('.input-group input~*, .input-group textarea~*')
    , basePad = 15
    , width = 0
    , padLeft = basePad
    , padRight = basePad;

  [].forEach.call(inputGroupElements, function(p) {
    var siblings  = p.parentElement.children
      , groupSize = siblings.length
      , lastChild = siblings[groupSize - 1]
      , nearestInput = siblings[0];

    if (nearestInput.type
        && ['text', 'email', 'tel'].indexOf(nearestInput.type) === -1)
      return;

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

  [].forEach.call(inputs, function (i) {
    var label = i.nextElementSibling;
    if (! label) return;
    label.onclick = label_focus;
    i.onchange = i.onblur = input_focus;

    if (i.value.length > 0) i.addClass('focus');
  });

  var pages = qq('.page');

  [].forEach.call(pages, function (page) {
    var inputs = [].slice.call(page.getElementsByTagName('input'));
    var textareas = [].slice.call(page.getElementsByTagName('textarea'));
    inputs = inputs.concat(textareas);

    var page_validator = function () {
      formula_validate(inputs)
    };

    [].forEach.call(inputs, function (i) {
      i.onclick = page_validator;
      i.onkeyup = function (e) {
        formula_animator.unTilt('fast');
        if (e.keyCode === 8)
          setTimeout(page_validator, 100);
        else page_validator();
      }
    });
  });
}

window.onload = function() {
  var formula_inputs = qq('.formula input, .formula textarea');

  var nextBtn = qq('.next-btn')[0];

  nextBtn.onclick = function () {
    var current_page = extend(qq('.page.current')[0])
      , next_page    = current_page.nextElementSibling;
    if (next_page) {
      var next_page = extend(next_page)
        , next_page_inputs = next_page.getElementsByTagName('input')
        , next_page_textareas = next_page.getElementsByTagName('textarea');
      next_page_inputs = [].slice.call(next_page_inputs)
                           .concat([].slice.call(next_page_textareas));
      formula_animator.nextPage(current_page, next_page);
      setTimeout(function () {
        formula_validate(next_page_inputs);
      }, 600);
    } else if (formula_inputs_valid(formula_inputs)) {
      formula_submit();
    } else {
      alert("Looks like something isn't quite right. Try going back and checking that all the textboxes are filled it, and all answers have little green check marks next to them.");
    }
  }

  var backBtns = qq('.back-btn');

  [].forEach.call(backBtns, function(btn) {
    var btn_page  = extend(btn.parentElement)
      , prev_page = btn_page.previousElementSibling;
    if (prev_page) {
      var prev_page = extend(prev_page)
        , prev_page_inputs = prev_page.getElementsByTagName('input')
        , prev_page_textareas = prev_page.getElementsByTagName('textarea');
      prev_page_inputs = [].slice.call(prev_page_inputs)
                           .concat([].slice.call(prev_page_textareas));
      btn.onclick = function (e) {
        formula_animator.previousPage(btn_page, prev_page);
        setTimeout(function () {
          formula_validate(prev_page_inputs);
        }, 600);
      }
    } else {
      alert("There's nothing to go back to! This is the beginning!");
    }
  })

  formula_setup_inputs(formula_inputs);

  formula_validate(formula_inputs);

  // NOTE(jordan): gross gross gross gross gross
  adjustPadding();

  window.onresize = adjustPadding;

  // NOTE(jordan): make mobile warning dismissable
  var closeWarningBtn = qq('a[do*="close-warning"]')[0];

  closeWarningBtn.onclick = closeWarning;

  var resumeBtn = document.getElementById('resume-btn');

  resumeBtn.onclick = function () {
    filepicker.setKey('AV96DZseeSYOldbUvmYwGz');
    filepicker.pick({
      mimetypes: ['text/plain',
                  'text/richtext',
                  'application/pdf',
                  'text/pdf'],
      container: 'modal',
      services: ['COMPUTER', 'GMAIL', 'BOX'
                 , 'DROPBOX', 'GOOGLE_DRIVE'
                 , 'SKYDRIVE', 'EVERNOTE'
                 , 'CLOUDDRIVE'],
      //debug: true
    },
    function(InkBlob) {
      resumeBtn.nextElementSibling.value = JSON.stringify(InkBlob);
      var current_page_inputs = qq('.page.current input');
      formula_validate(current_page_inputs);
    },
    function(PFError) {
      console.log(PFError.toString());
    });
  }
}
