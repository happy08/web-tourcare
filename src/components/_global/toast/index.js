import Vue from 'vue';
import toastComponent from './index.vue';

let ToastConstructor = Vue.extend(toastComponent);
let instance;
let instanceArr = [];

function _showToast() {
    instance.vm = instance.$mount();
    document.body.appendChild(instance.$el);
    Vue.nextTick(() => {
        instance.show = true;
    });
}

function Toast(msg, obj = {}) {
    let opt = {
        id: "_toast_id", //new Date().getTime(),
        msg: "",
        show: false,
        duration: 2000, //显示时间(毫秒)
        timer: null,
        type: "",
        icon: null,
        bgColor: "rgba(36, 36, 36, 0.8)",
        close: null,
        cover: false  //透明遮罩层
    };
    obj.msg = msg
    obj.type = obj.type ? obj.type : 'text'
    opt = { ...opt, ...obj }

    if (opt.type === 'clear') {
        (opt['id'] && instanceArr[opt['id']]) && instance.handleClose()
        return false;
    }
    //有相同id者共用一个实例，否则新增实例
    if (opt['id'] && instanceArr[opt['id']]) {
        instance = instanceArr[opt['id']];
        instance.clearTimer()
        instance = Object.assign(instance, opt)
    } else {
        instance = new ToastConstructor({
            data: opt
        });
        opt['id'] && (instanceArr[opt['id']] = instance);
    }

    _showToast();
    return instance;
}

const createMethod = type => {
    return (msg, obj = {}) => {
        obj.type = type;
        obj.icon = type;
        if (obj.type === 'loading') {  //loading类型默认打开遮罩层
            obj.cover = typeof obj.cover !== 'undefined' ? obj.cover : true;
            obj.duration = typeof obj.duration !== 'undefined' ? obj.duration : 0
        }
        Toast(msg, { ...obj });
    }
}

['loading', 'success', 'fail', 'clear'].forEach(method => {
    Toast[method] = createMethod(method);
});

Toast.install = function () {
    Vue.prototype['$toast'] = Toast;
}

export default Toast;