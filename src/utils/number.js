
/** 千分位 ","逗号隔开
* @param num 价格
*/
export const toThousands = (num) => {
    return parseFloat(num).toFixed(2).replace(/(\d{1,3})(?=(\d{3})+(?:\.))/g, "$1,")
}
/*
* 返回银行卡号，每隔四个数字添加一个空格
* @param str:string
*/
export const formatBankCard = (str) => {
    let newStr = str.replace(/\d(?=(?:\d{4})+\b)/g, `$& `)
    return String(newStr)
}

/** 四舍五入 保留N小数位
 * @param num:number
 * @param digit:number 保留小数位
*/
export const round = (num, digit = 2) => {
    if (typeof (num) == 'undefined') { // NaN，undefined，空值
        return '0.00'
    }
    else {
        return parseFloat(num).toFixed(digit)
    }
}

/** 大于1000转‘K’表示
 * @param value:number
 * @param digit:number 保留小数位
*/
export const toK = (value, digit = 1) => {
    const num = Number(value);
    if (num >= 1000) {
        return parseFloat(round((num / 1000), digit)) + "K";
    }
    return num;
}

/** 大于1000转‘000+’表示 大于10000转‘万’表示
 * @param value:number
 * @param digit:number 保留小数位
*/
export const toKW = (value, digit = 1) => {
    let num = Number(value);
    if (num >= 1000 && num < 10000) {
        num = parseFloat(round((num / 1000), 0)) + "000+";
    } else if (num >= 10000 && num < 100000000) {
        num = parseFloat(round((num / 10000), digit)) + "万+";
    } else if (num >= 100000000) {
        num = parseFloat(round((num / 100000000), digit)) + "亿+";
    }
    return num;
}

/** 前置补N个0
 * @param num:number
 * @param length:number 总长度
*/
export const preZero = (num, length) => {
    return (Array(length).join('0') + num).slice(-length);
}

/** 后置补0  严格的小数位控制，要求几位返回几位，小数返回字符串类型，整数返回数字类型
 * @param num:number
 * @param length:number 总长度
*/
export const fixNumber = (val, length) => {
    //最多支持14位小数，超出8位会丢失精度
    let value = Number(val).toFixed(8);
    let unit = length || 0;
    let isInt = value.indexOf(".") == -1;
    let intNum = value.split(".")[0];
    let floatNum = !isInt ? value.split(".")[1] : "0";
    let floatArry = floatNum.split("");
    let newFloatNum = ".";
    //末尾补零
    for (let i = 0; i < unit; i++) {
        if (!floatArry[i]) {
            newFloatNum += "0";
        } else {
            newFloatNum += floatArry[i];
        }
    }
    if (unit > 0) {
        return parseFloat(intNum + newFloatNum).toFixed(unit);
    } else {
        return parseInt(intNum);
    }
}

// 手机号4-7位为*星号
export const coverPhone = (phone) => {
    let phoneAry = phone.split(' ');
    if (phoneAry.lenght > 1) {
        phoneAry[1] = phoneAry.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
        return phoneAry.join(' ');
    }
    return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
}

// 车牌号为*星号
export const coverCarNo = (carNo) => {
    if (!!carNo) {
        if (carNo.length > 3) {
            return carNo.substring(0, 3) + "***" + carNo.substring(carNo.length - 1)
        } else {
            return carNo.substring(0, carNo.length) + "***" + carNo.substring(carNo.length - 1)
        }
    }
    return ""
}

// 车牌号为*星号
export const coverStore = (store) => {
    if (!!store) {
        if (store.length > 2) {
            return store.substring(0, 2) + "********" + store.substring(store.length - 1)
        } else {
            return store.substring(0, store.length) + "********" + store.substring(store.length - 1)
        }
    }
    return ""
}

//加法函数
export const add = (arg1, arg2) => {
    let r1, r2, m, n;
    try {
        r1 = arg1.toString().split(".")[1].length;
    }
    catch (e) {
        r1 = 0;
    }
    try {
        r2 = arg2.toString().split(".")[1].length;
    }
    catch (e) {
        r2 = 0;
    }
    m = Math.pow(10, Math.max(r1, r2));
    //动态控制精度长度
    n = (r1 >= r2) ? r1 : r2;
    return Number(((arg1 * m + arg2 * m) / m).toFixed(n));
}
//减法函数
export const sub = (arg1, arg2) => {
    let r1, r2, m, n;
    try {
        r1 = arg1.toString().split(".")[1].length;
    }
    catch (e) {
        r1 = 0;
    }
    try {
        r2 = arg2.toString().split(".")[1].length;
    }
    catch (e) {
        r2 = 0;
    }
    m = Math.pow(10, Math.max(r1, r2));
    //动态控制精度长度
    n = (r1 >= r2) ? r1 : r2;
    return Number(((arg1 * m - arg2 * m) / m).toFixed(n));
}

//乘法函数
export const mul = (arg1, arg2) => {
    let m = 0, s1 = arg1.toString(), s2 = arg2.toString();
    try {
        m += s1.split(".")[1].length;
    }
    catch (e) {
    }
    try {
        m += s2.split(".")[1].length;
    }
    catch (e) {
    }
    //最多保留8位小数
    return Number((Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m)).toFixed(Math.min(8, m)));
}

//除法函数
export const div = (arg1, arg2) => {
    let t1 = 0, t2 = 0, r1, r2;
    try {
        t1 = arg1.toString().split(".")[1].length;
    }
    catch (e) {
    }
    try {
        t2 = arg2.toString().split(".")[1].length;
    }
    catch (e) {
    }
    r1 = Number(arg1.toString().replace(".", ""));
    r2 = Number(arg2.toString().replace(".", ""));
    return (r1 / r2) * Math.pow(10, t2 - t1);
}
