const clone = (b) => {
    if (Array.isArray(b)) {
        // 数组拷贝
        let obj = [];
        for (let i = 0; i < b.length; i++) {
            obj[i] = clone(b[i]);
        }
        return obj;
    } else if(b instanceof Date) {
        return b
    }else if (b instanceof Object) {
        // 对象拷贝
        let obj = {};
        for (let attr in b) {
            obj[attr] = clone(b[attr]);
        }
        return obj;
    } else {
        return b;
    }
}

export default clone;
