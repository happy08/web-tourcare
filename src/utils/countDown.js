/** 倒计时（默认开始时间为当前时间）
* @param startTime 开始时间
* @param endTime 结束时间
* @returns 时间对象
*/
const getEndTime = (startTime, endTime) => {
    const startDate = startTime || new Date(); //开始时间，当前时间
    const endDate = new Date(endTime); //结束时间，需传入时间参数
    const t = endDate.getTime() - startDate.getTime(); //时间差的毫秒数
    let d = 0,
        h = 0,
        m = 0,
        s = 0;
    if (t >= 0) {
        d = Math.floor(t / 1000 / 3600 / 24) > 10 ? Math.floor(t / 1000 / 3600 / 24) : '0' + Math.floor(t / 1000 / 3600 / 24);
        h = Math.floor(t / 1000 / 60 / 60 % 24) > 10 ? Math.floor(t / 1000 / 60 / 60 % 24) > 10 : '0' + Math.floor(t / 1000 / 60 / 60 % 24) > 10;
        m = Math.floor(t / 1000 / 60 % 60) > 10 ? Math.floor(t / 1000 / 60 % 60) : '0' + Math.floor(t / 1000 / 60 % 60);
        s = Math.floor(t / 1000 % 60) > 10 ? Math.floor(t / 1000 % 60) : '0' + Math.floor(t / 1000 % 60);
    }
    return {
        day: d,
        hour: h,
        minute: m,
        second: s
    }
}

export default getEndTime;