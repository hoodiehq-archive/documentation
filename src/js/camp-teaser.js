/* global $, location */

// This file is meant as a temporary hack for the migration time between the old
// Hoodie version and the new Hoodie Release. Once it’s all out, we should find a
// proper way archive the docs for the old Hoodie and make the Camp Release the
// main thing.

(function () {
  if (/^\/camp/.test(location.pathname)) {
    addCampLogo()
  } else {
    addCampTeaser()
  }

  function addCampTeaser () {
    var campPath = location.pathname === '/' ? '/camp' : location.pathname.replace(/^\/[^\/]+/, '/camp')
    var teaser = '<div id="camp-teaser" style="' +
                 '  position: absolute;' +
                 '  top:  -120px;' +
                 '  left: 0;' +
                 '  right: 0;' +
                 '  height: 120px;' +
                 '  padding-left: 200px;' +
                 '  background: no-repeat url(http://hood.ie/dist1/content_img/index/hoodie-camp-transparent.png);' +
                 '  background-size: contain;' +
                 '">' +
                 '  <h2 style="' +
                 '  margin: 1em 0 0;' +
                 '">Camp Release is here!</h2><p>' +
                 '  Check out <a href="' + campPath + '">the new docs</a> and help us make them great <3' +
                 '</p></div>'

    $(document.body).css({
      'margin-top': '120px',
      'position': 'relative'
    }).prepend(teaser)
  }

  function addCampLogo () {
    var logo = '<img src="http://hood.ie/dist1/content_img/index/hoodie-camp-transparent.png" alt="" style="' +
               '  display: block;' +
               '  position: absolute;' +
               '  right: -110px;' +
               '  top: -17px;' +
               '  height: 65px;' +
               '">'

    $('.logo').css({
      position: 'relative'
    }).append(logo)
  }
})()
