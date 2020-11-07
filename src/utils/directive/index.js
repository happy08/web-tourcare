import Vue from 'vue'

// 全局自定义指令 `只允许整数或浮点数` v-number.float  :maxLen
Vue.directive('number', {
  update: function (e, { value, modifiers }, vnode) {
    try {
      var maxLen = 11; //长度 float时小数点的长度
      let el = e.tagName === 'INPUT' ? e : e.querySelector('input');
      const reg = modifiers.float ? '[^\\d.]' : '[^\\d]';  //[^\\d.]  /[^\d.]/g  /^-?([1-9]\d*(\.{1,2})?|0\.\d{1,2})$/
      let newval = value.replace(new RegExp(reg), "$1");
      if (vnode.data.attrs) {
        if (vnode.data.attrs['maxLen']) {
          maxLen = vnode.data.attrs['maxLen']
        } else if (modifiers.float) {
          maxLen = 2
        }
      }
      if (modifiers.float) { //浮点型
        let a = newval.split('.')[1]
        if (a || a === "") {
          newval = `${newval.split('.')[0]}.${a.substr(0, maxLen)}`
        }
      } else { //整数型
        newval = newval.substr(0, maxLen)
      }
      if (value !== newval) {
        el.value = newval
        el.dispatchEvent(new Event(modifiers.lazy ? 'change' : 'input'))
      }
    } catch (e) {
      console.log(e)
    }
  }
})
