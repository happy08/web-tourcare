/**
 * 类型判断
 */

 /**
  * 判断是否是函数
  * @param obj 需要判断的对象
  */
export const isFunction = (obj) => {
    try {
        if(!!obj && typeof obj === 'function') {
            return true
        }
        return false
    }catch(err) {
        return false
    }
}

/**
 * 判断是否为数组
 * @param obj 需要判断的对象
 */
export const isArray = (obj) => {
    try {
        return Object.prototype.toString.call(obj) === '[object Array]'
    }catch(err) {
        return false
    }   
}

/**
 * 判断是否为对象
 */
export const isObject = (obj) => {
    return Object.prototype.toString.call(obj) === '[object Object]'
}

/**
 * 判断是否为字符串
 */
export const isString = (obj) => {
    return typeof(obj) === 'string'
}