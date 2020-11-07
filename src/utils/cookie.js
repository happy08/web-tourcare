const cookie = {

    /** 设置
   * @param name 名称
   * @param value 值
   * @param days 天数
   */
    set(name, value, days) {
        var oDate = new Date();
        oDate.setDate(oDate.getDate() + days);
        document.cookie = name + '=' + value + ';expires=' + oDate;
    },

    /** 读取
    * @param name 名称
    */
    get(name) {
        const value = '; ' + document.cookie
        const parts = value.split('; ' + name + '=')
        if (parts.length === 2) return parts.pop().split(';').shift()
    },

    /** 删除
    * @param name 名称
    */
    remove(name) {
        this.set(name, '', -1);
    }

}

export default cookie;
