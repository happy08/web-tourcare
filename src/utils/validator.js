/**
 * @description 表单验证
*/
import schema from "async-validator";
import Toast from "@/components/_global/toast";
import { dialog } from "@/components/_global/dialog";

const validator = (option) => {
    return new Promise((resolve, reject) => {
        let data = option.data || {},
            rules = option.rules || {},
            confirmMsg = option.confirmMsg
        const validator = new schema(rules);
        validator.validate(data, (errors, fields) => {
            if (errors) {
                Toast(errors[0].message)
            } else {
                if (confirmMsg) { //有确认消息
                    setTimeout(() => { Toast.clear() }, 0)
                    dialog({
                        
                        title: confirmMsg,
                        onConfirm() {
                            Toast.loading("加载中…")
                            resolve()
                        },
                        onCancel() {
                            reject()
                        }
                    })
                } else { console.log('resolve');
                    resolve()
                }
            }
        });

    })
}

export default validator

