// 深度合并对象
const deepMerge = (nObj, oObj) => {
    for (var key in oObj) {
        nObj[key] =
            nObj[key] &&
                nObj[key].toString() === "[object Object]"
                ? deepMerge(nObj[key], oObj[key])
                : (nObj[key] = oObj[key]);
    }
    return nObj;
}

export default deepMerge;
