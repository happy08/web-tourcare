import Vue from 'vue';
import dialogComponent from './index.vue';

let dialogConstructor = Vue.extend(dialogComponent);
let instance;

let dialog = function (options) {
    options.id = options.id || '_dialog_id';
    if (options.type === 'image' && typeof (options.closeBtn) === 'undefined') {
        options.closeBtn = true;
    }
    instance = new dialogConstructor({
        propsData: options
    });
    instance.vm = instance.$mount();
    let dialogDom = document.querySelector('#' + options.id);
    if (options.id && dialogDom) {
        dialogDom.parentNode.replaceChild(instance.$el, dialogDom);
    } else {
        document.getElementById("app").firstChild.appendChild(instance.$el);
        //document.body.appendChild(instance.$el);
    }
    setTimeout(() => {
        //  设置z-index保证最新的弹窗再最上面
        let dialogThis = document.querySelector('#' + options.id);
        var cyDialogWrapper = document.getElementsByClassName('cy-dialog-wrapper');
        var zIndexNum = 1000 + (10 * (cyDialogWrapper.length));
        dialogThis.style.zIndex = zIndexNum;
        setTimeout(function () {
            for (var i = 0; i < cyDialogWrapper.length; i++) {
                cyDialogWrapper[i].style.zIndex = zIndexNum - 1 - i;
            }
        }, 0);
    }, 10);

    Vue.nextTick(() => {
        instance.value = true;
    });
};

dialog.install = function () {
    Vue.prototype['$dialog'] = dialog;
}

export { dialog }  //以插件使用
export default dialogComponent;  //以组件使用
