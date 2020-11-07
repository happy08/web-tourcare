/**
 * @description 值 转 名称
 * @param value 值
 * @param list 对象
 * @param delimiter 分隔符
*/
import { find, map } from './array'
import { isArray } from './isDataType'

export default function (value, list, delimiter) {
  if (value && !list.length) {
    return ''
  }
  if (!delimiter) {
    delimiter = ' '
  }

  let rs = map(value, (one, index) => {
    if (list.length && isArray(list[0])) {
      return find(list[index], item => {
        return item.value === one
      })
    } else {
      return find(list, item => {
        return item.value === one
      })
    }
  })
  rs = rs.filter(one => {
    return typeof one !== 'undefined'
  })
  return map(rs, one => {
    return one.name
  }).join(delimiter).replace('--', '')
}

