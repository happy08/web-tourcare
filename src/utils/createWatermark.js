/**
 * 添加又拍云水印
 */
import { isArray, isString, isObject } from './isDataType'

/**
 * 添加水印
 * @param str 
 * @param watermark 
 */
const addWatermark = (str, watermark) => {
    if(str.includes(',') && /\.(png|jpg|svg|gif|JPG|JPEG|jpeg|bmp)(,|$)/.test(str) && !str.startsWith('https://agent.wlyinfo.com')) {
        return str.replace(/\.(png|jpg|svg|gif|JPG|JPEG|jpeg|bmp)(,|$)/, $1 => `${$1}${watermark ? `!${watermark}` : ''}`)
    }
    if(/\.(png|jpg|svg|gif|JPG|JPEG|jpeg|bmp)$/.test(str) && !str.startsWith('https://agent.wlyinfo.com')) {
        return `${str}${watermark ? `!${watermark}` : ''}`
    }
    return str
}

/**
 * 递归添加水印
 * @param data 需要添加水印的对象
 * @param watermark 水印字符串
 */
const loop = (data, watermark) => {
    if(isString(data)) {
        // 字符串则直接在字符串后面添加后缀
        return addWatermark(data, watermark)
    }else if(isObject(data)) {
        const obj = {}
        for(let attr in data) {
            obj[attr] = loop(data[attr], watermark)
        }
        return obj
    }else if(isArray(data)) {
        const obj = []
        for(let i = 0; i < data.length; i++) {
            obj[i] = loop(data[i], watermark)
        }
        return obj
    }else {
        return data
    }
}

/**
 * 创建水印
 * @param data 需要添加水印的对象
 * @param watermark 水印字符
 */
const createWatermark = (data, watermark) => {
    if(!isArray(data) && !isString(data) && !isObject(data)) {
        // 非数组、非字符串、非对象则返回该数据
        return data
    }

    return loop(data, watermark)
}

export default createWatermark