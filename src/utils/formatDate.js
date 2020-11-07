/* 日期格式化 YYYY-MM-DD hh:mm:ss
 * date: 2017.08.08
 * @date {Date, String, Number} 需要转换的日期，可以是Date类型，也可以是毫秒数，也可以是格式化好的日期
 * @completion {Boolean} 是否要补全0，默认是
 */
const formatDate = (date, type = 'YYYY-MM-DD hh:mm:ss', completion = true) => {

    if (!date) return null

    if (typeof date === 'string' && date.includes(' ')) {
        // 兼容苹果设备
        date = date.replace(' ', 'T') + '+08:00'
    }

    let d = new Date(date);
    let dates = null;

    dates = {
        'Y+': d.getFullYear(),
        'M+': d.getMonth() + 1,
        'D+': d.getDate(),
        'h+': d.getHours(),
        'm+': d.getMinutes(),
        's+': d.getSeconds()
    };

    for (const attr in dates) {
        const val = (dates[attr] < 10 && completion) ? ('0' + dates[attr]) : dates[attr];
        const reg = new RegExp(attr, 'g');
        type = type.replace(reg, val);
    }

    return type;
};

export default formatDate

/* 秒 转成 -天-时-分-秒 */
export const semantics = (time) => {
    const oneDay = 24 * 60 * 60 * 1000;
    const oneHours = 60 * 60 * 1000;
    const oneMinutes = 60 * 1000;

    const days = Math.floor(time / oneDay);
    const hours = Math.floor((time % oneDay) / oneHours);
    const minutes = Math.floor((time % oneHours) / oneMinutes);
    const seconds = Math.floor((time % oneMinutes) / 1000);

    return [days, hours, minutes, seconds];
}

// 格式化日期为中文
export const translateData = (date) => {
    if (!date) return ''
    let _date = ''

    if (typeof date === 'string' && date.includes(' ')) {
        // 兼容苹果设备
        _date = date.replace(' ', 'T') + '+08:00'
    }

    const oneDay = 24 * 60 * 60 * 1000
    const oneHours = 60 * 60 * 1000
    const oneMinutes = 60 * 1000

    const nowTimes = new Date().getTime()
    const times = new Date(_date).getTime()
    const differenceTimes = nowTimes - times

    if (differenceTimes < oneMinutes * 1) {
        return `刚刚`
    } else if (differenceTimes < oneHours) {
        // 不足一小时
        return `${Math.ceil(differenceTimes % oneHours / oneMinutes)}分钟前`
    } else if (differenceTimes < oneDay) {
        return `${Math.ceil(differenceTimes % oneDay / oneHours)}小时前`
    } else if (differenceTimes < oneDay * 2) {
        return `昨天`
    } else {
        return date
    }

}

/**
 * 计算N天前后的日期
 * @param {string} startDate "2020-01-01"
 * @param {number} num 负数表示之前的日期，正数表示之后的日期，0表示今天
 */
export const dateDiffDate = (startDate, num) => {
    let date1 = new Date(startDate);
    // //今天时间
    // let time1 =
    //     date1.getFullYear() +
    //     "-" +
    //     (date1.getMonth() + 1) +
    //     "-" +
    //     date1.getDate();
    let date2 = new Date(date1);
    date2.setDate(date1.getDate() + num);

    let time2 =
        date2.getFullYear() +
        "-" +
        (date2.getMonth() + 1) +
        "-" +
        date2.getDate();
    return time2;
}

/**
 * 计算2个日期相差天数
 * @param {string} start 开始日期 "2020-01-01"
 * @param {string} end 结束日期
 */
export const dateDiffDays = (start, end) => {
    let separator = "-"; //日期分隔符
    let startDates = start.split(separator);
    let endDates = end.split(separator);
    let startDate = new Date(
        startDates[0],
        startDates[1] - 1,
        startDates[2]
    );
    let endDate = new Date(endDates[0], endDates[1] - 1, endDates[2]);
    const days =
        parseInt(Math.abs(endDate - startDate) / 1000 / 60 / 60 / 24) +
        1;
    console.log('days', days);
    return days; //把相差的毫秒数转换为天数
}

/**
 * 根据类型获取日期区间
 * @param {number} type 区间类型 0:今日 1昨日 2:3天 3:7天 4:15天 5本月 6上月 7近三月 8近半年 9近一年 10本年 99自定义
 */
export const getDateInterval = (type=3) => {
    let startDate = new Date() // 默认开始日期
    let endDate = new Date() // 默认结束日期
    const nowDay = startDate.getDate() // 当前日期

    // if(type === 100 && !!days) {
    //     startDate.setDate(nowDay - days * 1 + 1)
    // }else {
    switch (type) {
        case 0:
            break
        case 1:
            startDate.setDate(startDate.getDate() - 1)
            endDate.setDate(endDate.getDate() - 1)
            break
        case 2:
            startDate.setDate(nowDay - 3 + 1)
            break
        case 3:
            startDate.setDate(nowDay - 7 + 1)
            break
        case 4:
            startDate.setDate(nowDay - 15 + 1)
            break
        case 11:
            startDate.setDate(nowDay - 30 + 1)
            break
        case 5:
            startDate.setDate(1)
            break
        case 6:
            startDate.setDate(1)
            startDate.setMonth(startDate.getMonth() - 1)
            endDate.setDate(0)
            break
        case 7:
            startDate.setMonth(startDate.getMonth() - 3)
            break
        case 8:
            startDate.setMonth(startDate.getMonth() - 6)
            break
        case 9:
            startDate.setMonth(startDate.getMonth() - 12)
            break
        case 10:
            startDate.setDate(1)
            startDate.setMonth(0)
            endDate.setMonth(12)
            endDate.setDate(0)
            break
    }
    //}
    startDate = formatDate(startDate, 'YYYY-MM-DD')
    endDate = formatDate(endDate, 'YYYY-MM-DD')
    return {
        startDate,
        endDate
    }
}
