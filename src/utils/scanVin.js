import api from '@/service/api'
import Toast from "@/components/_global/toast";
import compression from './compression'


const uploadFile = async (file) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', '2007')
    const data = await api.scanVinCode(formData)
    return data.obj.data.cardsinfo.card.item.content
}

const scanVin = (file) => {
    return new Promise((resolve, reject) => {
        const fileMaxSize = 348576
        const inputEl = document.createElement('input')
        inputEl.type = 'file'
        inputEl.accept = 'image/*'
        inputEl.value = ''
        inputEl.style.display = 'none'
        document.body.appendChild(inputEl)
        inputEl.addEventListener('change', (event) => {
            const file = event.target.files[0]
            compression(file, fileMaxSize).then((data) => {
                return data
            }).then(data => {
                Toast('正在识别')
                return uploadFile(data)
            }).then(data => {
                resolve(data)
                Toast.success('识别成功')
            }).catch(err => {
                Toast.fail('识别失败，请重试')
                reject(err)
            })
        })

        const evt = new MouseEvent("click", {
            bubbles: true,
            cancelable: true,
            view: window
        })

        inputEl.dispatchEvent(evt)
    })
}

export default scanVin