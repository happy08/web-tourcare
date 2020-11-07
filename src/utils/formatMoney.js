/**
 * 格式化金额
 */
const formatMoney = (money) => {
    try {
        money = typeof money === 'number' ? money : Number(money)
        if(!money || typeof money !== 'number') {
            throw new Error('传入的金额不正确')
        }
        return new Intl.NumberFormat('en-IN').format(money)
    }catch(err) {
        return money
    }
}

export default formatMoney