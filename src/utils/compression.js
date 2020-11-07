
/**
 * 获取图片文件的本地路径
 * @param file 图片文件对象
 */
const getObjectURL = (file) => {
    let url = null;
    if (window.createObjectURL != undefined) { // basic
        url = window.createObjectURL(file)
    } else if (window.URL != undefined) { // mozilla(firefox)
        url = window.URL.createObjectURL(file)
    } else if (window.webkitURL != undefined) { // webkit or chrome
        url = window.webkitURL.createObjectURL(file)
    }
    return url
}

/**
 * 将base64转换为文件
 * @param dataurl 文件base64位地址
 * @param filename 文件名
 */
const dataURLtoFile = (dataUrl, filename) => {
    let arr = dataUrl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n)

    while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
    }

    return new File([u8arr], filename, { type: mime })
}

// 图片转base64
const getBase64 = (imgUrl, callback) => {
    window.URL = window.URL || window.webkitURL;
    var xhr = new XMLHttpRequest();
    xhr.open("get", imgUrl, true);
    // 至关重要
    xhr.responseType = "blob";
    xhr.onload = function () {
        if (this.status == 200) {
            //得到一个blob对象
            var blob = this.response;
            // 至关重要
            let oFileReader = new FileReader();
            oFileReader.onloadend = function (e) {
                let base64 = e.target.result;
                callback && callback(postData);
            };
            oFileReader.readAsDataURL(blob);
        }
    }
    xhr.send();
}

/**
 * 图片压缩
 * @param file 图片文件对象 
 * @param maxSize 支持的最大图片文件大小
 */
const compression = (file, maxSize = 1048576) => {
    return new Promise((resolve, reject) => {
        let sizeScale = 1
        if (file.size > maxSize) {
            sizeScale = maxSize / file.size - 0.1
        } else {
            resolve(file)
            return
        }
        const img = new Image()
        img.onload = data => {
            const canvas = document.createElement('canvas')
            const ctx = canvas.getContext('2d')
            canvas.height = img.height
            canvas.width = img.width
            ctx.drawImage(img, 0, 0, img.width, img.height)
            const base64 = canvas.toDataURL('image/jpeg', sizeScale)
            const newFile = dataURLtoFile(base64, `img.jpg`)
            resolve(newFile)
        }
        img.onerror = err => {
            reject(err)
        }
        img.src = getObjectURL(file)
    })
}

export default compression
export {
    dataURLtoFile
}