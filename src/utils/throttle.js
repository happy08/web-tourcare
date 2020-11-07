/** 节流 每delay毫秒执行
 * @param func:Object
 * @param delay:Number 时间
 */
const throttle = (func, delay = 5000) => {
  var last
  var timer
  return function () {
    var context = this, args = arguments;
    var now = new Date()
    if (last && now - last < delay) {
      clearTimeout(timer)
      timer = setTimeout(function () {
        last = now
        func.apply(context, args)
      }, delay)
    } else {
      last = now
      func.apply(context, args)
    }
  }
}

export default throttle;