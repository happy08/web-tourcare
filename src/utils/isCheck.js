
/** 校验中英文姓名
* @param str:string
*/
export const isName = (str) => {
    return /[a-zA-Z\u4E00-\u9FA5]+$/.test(str)
}

/** 校验邮箱
* @param str:string
*/
export const isEmail = (str) => {
    const emailReg = /^([a-zA-Z0-9]+[_|_|.|/-]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|_|.]?)*[a-zA-Z0-9]+.[a-zA-Z]{2,4}$/;
    return emailReg.test(str);
}

/** 校验手机号码
* @param str:string
*/
export const isPhone = (str) => {
    const regExp = /^1(3|4|5|6|7|8|9)\d{9}$/;
    return regExp.test(str);
}

//整数数字
export const isAllNumber = (str) => {
    const regExp = /^[0-9]*$/;
    return regExp.test(str);
}

//所有数字类型
export const isNumber = (value) => {
    const patrn = /^(-)?\d+(\.\d+)?$/;
    if (patrn.exec(value) == null || value == "") {
        return false
    } else {
        return true
    }
}

//非0正数(价格数量，不包含0)
export const isIntNumber = (value) => {
    const patrn = /^(-)?\d+(\.\d+)?$/;
    if (patrn.exec(value) == null || value == "") {
        return false
    } else {
        if (parseFloat(value) <= 0) {
            return false;
        }
        return true
    }
}

//非负正数(包含0)
export const isZeroNumber = (value) => {
    const patrn = /^(-)?\d+(\.\d+)?$/;
    if (patrn.exec(value) == null || value == "") {
        return false
    } else {
        if (parseFloat(value) < 0) {
            return false;
        }
        return true
    }
}

/** 校验身份证号（15位或18位数字）
* @param str:string
*/
export const isUserId = (str) => {
    return /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/.test(str);
}
