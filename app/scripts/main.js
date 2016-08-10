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
    var inputs = [].slice.call(page.getElementsByTagName('input'));
    var textareas = [].slice.call(page.getElementsByTagName('textarea'));
    inputs = inputs.concat(textareas);

    var validate_page = function () {
      formula_validate(inputs, 200);
    };

    var input_click = function () {
      if (this.type == 'checkbox') formula_cache_set(this);
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

  var formulaOutline = document.getElementById('formula-outline');
  var windows= qq('.primary-window');
  var windowHeaders = document.getElementsByTagName('h2');

  // Convert to an array so we can use indexOf()
  windows = Array.prototype.slice.call(windows);
  windowHeaders = Array.prototype.slice.call(windowHeaders);


  // Create a progress bar and add it to the page
  var options = {
  	id: 'top-progress-bar',
  	color: '#E00000',
  	height: '4px',
  	duration: 0.4,
  }

  var progressBar = new ToProgress(options);
  var progressBarPercent = 100/windows.length;  // Percentage to increase/decrease progress bar on going to next/previous window

  // Loop through and add each window header to the outline
  for (var i = 0; i < windows.length; i++) {
  	windowHeaders[i] = windowHeaders[i].innerText;  // Remove <h2> tag from each item in windowHeaders

  	var newItem = document.createElement('li');
  	newItem.appendChild(document.createTextNode(windowHeaders[i]));

  	// When clicking on a list item, move to the respective page of the application
  	newItem.onclick = function() {
  		var currentPage = qq('.current')[0];
  		var currentPageIndex = windows.indexOf(currentPage);
        var desiredPageIndex = windowHeaders.indexOf(this.innerText);
  		var desiredPage = windows[desiredPageIndex];
  		if (currentPageIndex != desiredPageIndex) {
  			progressBar.setProgress(windowHeaders.indexOf(this.innerText) * progressBarPercent);
  			// Animate differently based on whether the desired page is before or after the current page
  			if (currentPageIndex > desiredPageIndex)
 				formula_animator.previousPage(currentPage, desiredPage);
 			else
 				formula_next_page(currentPage, desiredPage)
  		}
  	}

  	formulaOutline.appendChild(newItem);
  }


  function formula_next_page (current_page, next_page) {
    // NOTE(jordan): I don't know why this happens
    if (next_page) {
      var next_page = extend(next_page)
        , next_page_inputs = next_page.getElementsByTagName('input')
        , next_page_textareas = next_page.getElementsByTagName('textarea');
      next_page_inputs = [].slice.call(next_page_inputs)
                           .concat([].slice.call(next_page_textareas));
      formula_animator.nextPage(current_page, next_page, function () {
        formula_validate(next_page_inputs);
        next_page_inputs[0].focus();
      });
    } else if (formula_inputs_valid(formula_inputs)) {
      progressBar.reset();
      formula_submit();
    } else {
      alert("Looks like something isn't quite right. Try going back and checking that all the textboxes are filled it, and all answers have little green check marks next to them.");
    }
  }

  nextBtn.onclick = function () {
    var current_page = extend(qq('.page.current')[0])
      , next_page    = current_page.nextElementSibling;
    progressBar.increase(progressBarPercent)
    formula_next_page(current_page, next_page);
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
      	progressBar.decrease(progressBarPercent)
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

  formula_get_data(formula_inputs);

  var current_page_inputs = qq('.page.current input');

  formula_validate(current_page_inputs);

  // NOTE(jordan): gross gross gross gross gross
  adjustPadding();

  window.onresize = adjustPadding;

  // NOTE(jordan): make mobile warning dismissable
  var closeWarningBtn = qq('a[do*="close-warning"]')[0];

  closeWarningBtn.onclick = closeWarning;

  var resumeBtn = document.getElementById('resume-btn');

  filepicker.setKey('AV96DZseeSYOldbUvmYwGz');

  resumeBtn.onclick = function () {
    filepicker.pick({
      mimetypes: ['text/plain',
                  'text/richtext',
                  'application/pdf',
                  'text/pdf'],
      container: 'window',
      services: ['COMPUTER', 'GMAIL', 'BOX'
                 , 'DROPBOX', 'GOOGLE_DRIVE'
                 , 'SKYDRIVE', 'EVERNOTE'
                 , 'CLOUDDRIVE'],
      //debug: true
    },
    function(InkBlob) {
      var current_page_inputs = qq('.page.current input');
      resumeBtn.nextElementSibling.value = JSON.stringify(InkBlob);
      formula_validate(current_page_inputs);
    },
    function(PFError) {
      console.log(PFError.toString());
    });
  }
}
