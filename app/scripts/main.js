function adjustPadding () {
  var inputGroupElements = qq('.input-group input~*, .input-group textarea~*')
    , basePad = 15
    , width = 0
    , padLeft = basePad
    , padRight = basePad

  ;[].forEach.call(inputGroupElements, function(p) {
    var siblings  = p.parentElement.children
      , groupSize = siblings.length
      , lastChild = siblings[groupSize - 1]
      , nearestInput = siblings[0]
      , nearestLabel = nearestInput.nextElementSibling

    if (nearestInput.type
        && ['text', 'email', 'tel'].indexOf(nearestInput.type) === -1)
      return

    if (/pill-left|glance/g.test(p.classList)) {
      padLeft += p.offsetWidth
    }

    if (/pill-right/g.test(p.classList)) {
      padRight += p.offsetWidth
    }

    if (p.nodeName === 'LABEL') {
      width = p.offsetWidth
    }

    if (p === lastChild) {
      nearestInput.style.paddingLeft  = padLeft + "px"
      nearestInput.style.paddingRight = padRight + "px"
      nearestInput.style.width        = width + "px"

      padLeft = padRight = basePad
    }
  })
}

function formulaSetupInputs (inputs, formulaNextPage) {
  console.log(inputs)

  extend(inputs)

  // NOTE(jordan): Event listener.
  function inputChange (e) {
    var input = this
    input.value.length === 0 ? input.removeClass('focus')
                             : input.addClass('focus')
  }

  // NOTE(jordan): Event listener.
  function labelFocus (e) {
    var label = this
    label.previousElementSibling.addClass('focus')
    label.previousElementSibling.focus()
  }

  ;[].forEach.call(inputs, function (i) {
    var label = i.nextElementSibling
    if (! label) return
    label.onclick = labelFocus
    i.onchange = i.onblur = inputChange

    if (i.value.length > 0) i.addClass('focus')
  })

  var pages = qq('.page')

  ;[].forEach.call(pages, function (page) {
    var inputs = [].slice.call(page.getElementsByTagName('input'))
    var textareas = [].slice.call(page.getElementsByTagName('textarea'))
    inputs = inputs.concat(textareas)

    var validatePage = function () {
      formulaValidate(inputs, 200)
    }

    var inputClick = function () {
      if (this.type == 'checkbox') formulaCacheSet(this)
      validatePage()
    }

    ;[].forEach.call(inputs, function (i) {
      i.onclick = inputClick
      i.onkeydown = function (e) {
        if (e.keyCode === 13) {
          e.preventDefault()
          e.stopPropagation()
          return false
        } else {
          formulaAnimator.unTilt()
          if (this.timeout) clearTimeout(this.timeout) && delete this.timeout
          this.timeout = setTimeout(function () {
            validatePage()
          }, 500)
        }
      }
    })
  })
}

window.onload = function () {
  var formulaInputs = qq('.formula input, .formula textarea')

  var nextBtn = qq('.next-btn')[0]

  var formulaOutline = document.getElementById('formula-outline')
  var windows= qq('.primary-window')
  var windowHeaders = document.getElementsByTagName('h2')

  // Convert to an array so we can use indexOf()
  windows = Array.prototype.slice.call(windows)
  windowHeaders = Array.prototype.slice.call(windowHeaders)


  // Create a progress bar and add it to the page
  var options = {
  	id: 'top-progress-bar',
  	color: '#E00000',
  	height: '4px',
  	duration: 0.4,
  }

  var progressBar = new ToProgress(options)
  var progressBarPercent = 100/windows.length;  // Percentage to increase/decrease progress bar on going to next/previous window

  // Loop through and add each window header to the outline
  for (var i = 0; i < windows.length; i++) {
  	windowHeaders[i] = windowHeaders[i].innerText;  // Remove <h2> tag from each item in windowHeaders

  	var newItem = document.createElement('li')
  	newItem.appendChild(document.createTextNode(windowHeaders[i]))

  	// When clicking on a list item, move to the respective page of the application
  	newItem.onclick = function() {
  		var currentPage = qq('.current')[0]
  		var currentPageIndex = windows.indexOf(currentPage)
        var desiredPageIndex = windowHeaders.indexOf(this.innerText)
  		var desiredPage = windows[desiredPageIndex]
  		if (currentPageIndex != desiredPageIndex) {
  			progressBar.setProgress(windowHeaders.indexOf(this.innerText) * progressBarPercent)
  			// Animate differently based on whether the desired page is before or after the current page
  			if (currentPageIndex > desiredPageIndex)
 				formulaAnimator.previousPage(currentPage, desiredPage)
 			else
 				formulaNextPage(currentPage, desiredPage)
  		}
  	}

  	formulaOutline.appendChild(newItem)
  }


  function formulaNextPage (currentPage, nextPage) {
    // NOTE(jordan): I don't know why this happens
    if (nextPage) {
      var nextPage = extend(nextPage)
        , nextPageInputs = nextPage.getElementsByTagName('input')
        , nextPageTextareas = nextPage.getElementsByTagName('textarea')
      nextPageInputs = [].slice.call(nextPageInputs)
                           .concat([].slice.call(nextPageTextareas))
      formulaAnimator.nextPage(currentPage, nextPage, function () {
        formulaValidate(nextPageInputs)
        nextPageInputs[0].focus()
      })
    } else if (formulaInputsValid(formulaInputs)) {
      progressBar.reset()
      formulaSubmit()
    } else {
      alert("Looks like something isn't quite right. Try going back and checking that all the textboxes are filled it, and all answers have little green check marks next to them.")
    }
  }

  nextBtn.onclick = function () {
    var currentPage = extend(qq('.page.current')[0])
      , nextPage    = currentPage.nextElementSibling
    progressBar.increase(progressBarPercent)
    formulaNextPage(currentPage, nextPage)
  }

  var backBtns = qq('.back-btn')

  ;[].forEach.call(backBtns, function(btn) {
    var btnPage  = extend(btn.parentElement)
      , prevPage = btnPage.previousElementSibling
    if (prevPage) {
      var prevPage = extend(prevPage)
        , prevPageInputs = prevPage.getElementsByTagName('input')
        , prevPageTextareas = prevPage.getElementsByTagName('textarea')
      prevPageInputs = [].slice.call(prevPageInputs)
                           .concat([].slice.call(prevPageTextareas))
      btn.onclick = function (e) {
      	progressBar.decrease(progressBarPercent)
        formulaAnimator.previousPage(btnPage, prevPage, function () {
          prevPageInputs[0].focus()
          formulaValidate(prevPageInputs)
        })
      }
    } else {
      alert("There's nothing to go back to! This is the beginning!")
    }
  })

  formulaSetupInputs(formulaInputs, formulaNextPage)

  formulaGetData(formulaInputs)

  var currentPageInputs = qq('.page.current input')

  formulaValidate(currentPageInputs)

  // NOTE(jordan): gross gross gross gross gross
  adjustPadding()

  window.onresize = adjustPadding
}
