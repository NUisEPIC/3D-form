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

function formula_setup_inputs (inputs, formula_next_page) {
  console.log(inputs);

  extend(inputs);

  function input_change (e) {
    var input = this;
    input.value.length === 0 ? input.removeClass('focus')
                             : input.addClass('focus');
  }

  function label_focus (e) {
    var label = this;
    label.previousElementSibling.addClass('focus');
    label.previousElementSibling.focus();
  }

  [].forEach.call(inputs, function (i) {
    var label = i.nextElementSibling;
    if (! label) return;
    label.onclick = label_focus;
    i.onchange = i.onblur = input_change;

    if (i.value.length > 0) i.addClass('focus');
  });

  var pages = qq('.page');

  [].forEach.call(pages, function (page) {
    var inputs    = [].slice.call(page.getElementsByTagName('input'));
    var textareas = [].slice.call(page.getElementsByTagName('textarea'));
    inputs = inputs.concat(textareas);

    var validate_page = function () {
      formula_validate(inputs, 200);
    };

    var input_click = function () {
      if (/checkbox|radio/.test(this.type)) formula_cache_set(this);
      validate_page();
    };

    [].forEach.call(inputs, function (i) {
      i.onclick = input_click;
      i.onkeydown = function (e) {
        if (e.keyCode === 13) {
          e.preventDefault();
          e.stopPropagation();
          return false;
        } else {
          formula_animator.unTilt();
          if (this.timeout) clearTimeout(this.timeout) && delete this.timeout;
          this.timeout = setTimeout(function () {
            validate_page();
          }, 500);
        }
      }
    });
  });
}

window.onload = function() {
  var formula_inputs = qq('.formula input, .formula textarea');

  var nextBtn = qq('.next-btn')[0];

  function formula_next_page (current_page, next_page) {
    // NOTE(jordan): I don't know why this happens
    var endpage = ~current_page.className.indexOf('end')

    if (endpage) {
      formula_submit();
    } else if (next_page) {
      var next_page = extend(next_page)
        , next_page_inputs = next_page.getElementsByTagName('input')
        , next_page_textareas = next_page.getElementsByTagName('textarea');
      next_page_inputs = [].slice.call(next_page_inputs)
                           .concat([].slice.call(next_page_textareas));
      formula_animator.nextPage(current_page, next_page, function () {
        formula_validate(next_page_inputs);
        next_page_inputs[0].focus();
      });
    } else {
      alert("Looks like something isn't quite right. Try going back and checking that all the textboxes are filled it, and all answers have little green check marks next to them.");
    }
  }

  nextBtn.onclick = function () {
    var current_page = extend(qq('.page.current')[0])
      , next_page    = current_page.nextElementSibling
      , branch       = current_page.id === 'branch'
      , applyingFor  = store.get('formula_progress')['applying-for']

    if (branch && applyingFor === 'EPIC Teams')
      formula_next_page(current_page, next_page.nextElementSibling)
    else
      formula_next_page(current_page, next_page)
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
        formula_animator.previousPage(btn_page, prev_page, function () {
          prev_page_inputs[0].focus();
          formula_validate(prev_page_inputs);
        });
      }
    } else {
      alert("There's nothing to go back to! This is the beginning!");
    }
  })

  formula_setup_inputs(formula_inputs, formula_next_page);

  formula_get_data(formula_inputs, true);

  var current_page_inputs = qq('.page.current input');

  formula_validate(current_page_inputs);

  // NOTE(jordan): gross gross gross gross gross
  adjustPadding();

  window.onresize = adjustPadding;

  // NOTE(jordan): make mobile warning dismissable
  var closeWarningBtn = qq('a[do*="close-warning"]')[0];

  closeWarningBtn.onclick = closeWarning;

  filepicker.setKey('AwcwduAoSOC9x7Qoi9y4Az');

  function makeFileInput (targetEl, extensions) {
    targetEl.onclick = function () {
      filepicker.pick({
        extensions: extensions,
        container: 'window',
        services: ['COMPUTER', 'GMAIL', 'BOX'
                   , 'DROPBOX', 'GOOGLE_DRIVE'
                   , 'SKYDRIVE'
                   , 'CLOUDDRIVE'],
        //debug: true
      },
      function(InkBlob) {
        var current_page_inputs = qq('.page.current input');
        targetEl.previousElementSibling.value = JSON.stringify(InkBlob);
        formula_validate(current_page_inputs);
      },
      function(PFError) {
        console.log(PFError.toString());
      });
    }
  }

  var thank = qq('.thanks')[0]
  thank.onclick = function (e) {
    // NOTE(jordan): fixes a dumb glitch where things flicker if there's uncovered content on the back of the page element
    e.preventDefault()
    e.stopPropagation()
    return false
  }
}
