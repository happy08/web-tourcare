/**
 * @description 转rem
*/
(function (doc, win) {
  var docEl = doc.documentElement
  var resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize'
  function recalc() {
    var designWidth = 750
    var clientWidth = docEl.clientWidth
    if (!clientWidth || clientWidth > designWidth || clientWidth < 320) {
      docEl.style.fontSize = (designWidth / 20) + 'px'
    }else{
      docEl.style.fontSize = (75 * clientWidth / designWidth) + 'px'
    }
  }

  if (!doc.addEventListener) return
  win.addEventListener(resizeEvt, recalc, false)
  doc.addEventListener('DOMContentLoaded', recalc, false)
})(document, window)
