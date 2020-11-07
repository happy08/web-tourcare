const storage = {
    /** 设置 
    * @param key 键
    * @param value 值
    */
    set(key, value) {
        try {
            window.localStorage.setItem(key, decodeURIComponent(JSON.stringify(value)));
        } catch (e) {
            window.localStorage.setItem(key, decodeURIComponent(value));
        }
    },

    /** 读取
    * @param key 键
    */
    get(key) {
        var local = window.localStorage.getItem(key);
        try {
            var result = JSON.parse(decodeURIComponent(local));
            return result;
        } catch (e) {
            return local;
        }
    },

    /** 删除
    */
    remove(key) {
        window.localStorage.removeItem(key)
    }

}

export default storage;
