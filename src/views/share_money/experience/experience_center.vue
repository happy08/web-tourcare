<template>
<div class="bg-darkblue">
    <div class="head mg-10 pdlr-10 bg-blue round-5">
        <div class="flex">
            <cy-cell theme="blue" :title="`设备ID：${options.equipmentId}`" titleIcon="shebeiID" class="w50 pdl-0 mgr-15" @click.native=" options.experienceStep != 6 && equipmentList.length>1? showCaseSwiper = true : ''">
                <cy-icon v-if="options.experienceStep != 6 && equipmentList.length>1" slot="desc" type="xiala" color="#ffffff" size="12"></cy-icon>
            </cy-cell>
            <cy-cell theme="blue" :title="`体验车牌：${options.carNum}`" titleIcon="tiyanchepai" class="w50 pdlr-0"></cy-cell>
        </div>
        <div class="flex">
            <cy-cell theme="blue" :title="`温度：${options.temperature || '--'}（℃）`" titleIcon="wendu" class="w50 pdl-0 mgr-15"></cy-cell>
            <cy-cell theme="blue" :title="`电流：${options.current || '--'}（A）`" titleIcon="dianliu" class="w50 pdlr-0"></cy-cell>
        </div>
        <div class="flex">
            <cy-cell theme="blue" :title="`经度：${options.longitude}`" titleIcon="jingdu" class="w50 pdl-0 mgr-15"></cy-cell>
            <cy-cell theme="blue" :title="`纬度：${options.latitude}`" titleIcon="weidu" class="w50 pdlr-0"></cy-cell>
        </div>
    </div>

    <!-- 步骤 -->
    <div class="mg-10 pd-5 bg-blue round-5 white">
        <div class="countdown-wrapper">
            <div class="image-wrapper">
                <img class="bg_home" src="../../../assets/img/experience/bg_home.png" alt="">
                <div class="bg_label">
                    您是第{{options.rank}}位体验者
                </div>
                <div class="diversions-wrapper">
                    <!-- 第一步就绪 跟第六步体验完成 不需要动画 -->
                    <div :class="[['2','3','4','5'].includes(options.experienceStep) ? 'animation' : '']" v-for="(item,index) in wavyList" :key="index" :style="`--i:${index};--x:${item.x};--y:${item.y}`"></div>
                </div>
            </div>
            <!-- v-show="options.experienceStep == 3 && dateList.length && minute < 5 && workCountDown > 0" -->
            <div v-show="options.experienceStep == 3 && dateList.length && minute < 5 && workCountDown > 0" class="time-wrapper">
                <span :class="[7,8,10,11].includes(index) ? 'time-wrapper-num' : ''" v-for="(item,index) in dateList" :key="index">{{item}}</span>
            </div>
        </div>
        <div class="step">
            <div class="step-line">
                <!-- 第一步 -->
                <div :class="['circle', options.experienceStep == 1 ? 'active' : '',options.experienceStep > 1 ? 'last' : '' ]"></div>
                <div :class="['line',options.experienceStep > 1 ? 'active' : '' ]"></div>

                <!-- 第二步 -->
                <div :class="['circle', options.experienceStep == 2 ? 'active' : '',options.experienceStep > 2 ? 'last' : '' ]"></div>
                <div :class="['line',options.experienceStep > 2 ? 'active' : '' ]"></div>

                <!-- 第三步 -->
                <div :class="['circle', options.experienceStep == 3 ? 'active' : '',options.experienceStep > 3 ? 'last' : '' ]"></div>
                <div :class="['line',options.experienceStep > 3 ? 'active' : '' ]"></div>

                <!-- 第四步 -->
                <div :class="['circle', options.experienceStep == 4 ? 'active' : '',options.experienceStep > 4 ? 'last' : '' ]"></div>
                <div :class="['line',options.experienceStep > 4 ? 'active' : '' ]"></div>

                <!-- 第五步 -->
                <div :class="['circle', options.experienceStep == 5 ? 'active' : '',options.experienceStep > 5 ? 'last' : '' ]"></div>
            </div>
            <div class="step-item tc fs-10">
                <div :class="['item', options.experienceStep == 1 ? 'active' : '',options.experienceStep > 1 ? 'last' : '' ]">
                    <div class="bg" :style="options.experienceStep >= 1 ? 'color: #17cfe1;' : ''">
                        <div class="name">第一步</div>
                        <div>准备就绪</div>
                    </div>
                </div>
                <div :class="['item', options.experienceStep == 2 ? 'active' : '',options.experienceStep > 2 ? 'last' : '' ]">
                    <div class="bg" :style="options.experienceStep >= 2 ? 'color: #17cfe1;' : ''">
                        <div class="name">第二步</div>
                        <div>施工前空气质量检测</div>
                    </div>
                </div>
                <div :class="['item', options.experienceStep == 3 ? 'active' : '',options.experienceStep > 3 ? 'last' : '' ]">
                    <div class="bg" :style="options.experienceStep >= 3 ? 'color: #17cfe1;' : ''">
                        <div class="name">第三步</div>
                        <div>
                            5分钟
                            <br />体验施工
                        </div>
                    </div>
                </div>
                <div :class="['item', options.experienceStep == 4 ? 'active' : '',options.experienceStep > 4 ? 'last' : '' ]">
                    <div class="bg" :style="options.experienceStep >= 4 ? 'color: #17cfe1;' : ''">
                        <div class="name">第四步</div>
                        <div>施工后空气质量检测</div>
                    </div>
                </div>
                <div :class="['item', options.experienceStep == 5 ? 'active' : '',options.experienceStep > 5 ? 'last' : '' ]">
                    <div class="bg" :style="options.experienceStep >= 5 ? 'color: #17cfe1;' : ''">
                        <div class="name">第五步</div>
                        <div>施工前后空气质量对比</div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 第二步 施工前 详情 -->
        <!-- v-show="options.experienceStep == 2" -->
        <div v-show="options.experienceStep == 2" class="step-content round-5">
            <div class="step-2 flex between pd-10 tc fs-12">
                <div>
                    <div class="skyblue">检测项目</div>
                    <div class>TVOC(有机挥发物)</div>
                    <div class>HCHO(甲醛)</div>
                    <div class>PM2.5(空气污染)</div>
                </div>
                <div>
                    <div class="skyblue">检测值</div>
                    <div :class="['green','yellow','red'][beforeRecord.checkStatusTvoc]">
                        {{beforeRecord.tvoc || '<0.01' }}mg/m³
                        <cy-icon v-if="beforeRecord.checkStatusTvoc == 2" type="jinggao" color="#FF0000" size="15"></cy-icon>
                    </div>
                    <div :class="['green','yellow','red'][beforeRecord.checkStatusTcho]">
                        {{beforeRecord.hcho || '<0.01' }}mg/m³
                        <cy-icon v-if="beforeRecord.checkStatusTcho == 2" type="jinggao" color="#FF0000" size="15"></cy-icon>
                    </div>
                    <div :class="['green','yellow','red'][beforeRecord.checkStatusPm]">
                        {{beforeRecord.pm25}}ug/m³
                        <cy-icon v-if="beforeRecord.checkStatusPm == 2" type="jinggao" color="#FF0000" size="15"></cy-icon>
                    </div>
                </div>
                <div>
                    <div class="skyblue">国家标准</div>
                    <div class>0.6mg/m³</div>
                    <div class>0.1mg/m³</div>
                    <div class>35ug/m³</div>
                </div>
            </div>
        </div>

        <!-- 第三步详情 v-show="options.experienceStep == 3" -->
        <div v-show="options.experienceStep == 3" class="step-content round-5">
            <div class="step-3">
                <div class="flex between tc fs-10">
                    <div class="pd-5" :style="minute < 5  ? 'color:#17cfe1;' :'color:#fff;'">
                        <div>第一分钟</div>
                        <div>360度</div>
                        <div>全车祛异味</div>
                    </div>
                    <div class="pd-5" :style="minute < 4  ? 'color:#17cfe1;' :'color:#fff;'">
                        <div>第二分钟</div>
                        <div>360度</div>
                        <div>无死角杀菌</div>
                    </div>
                    <div class="pd-5" :style="minute < 3 ? 'color:#17cfe1;' :'color:#fff;'">
                        <div>第三分钟</div>
                        <div>360度</div>
                        <div>无死角杀毒</div>
                    </div>
                    <div class="pd-5" :style="minute < 2  ? 'color:#17cfe1;' :'color:#fff;'">
                        <div>第四分钟</div>
                        <div>360度</div>
                        <div>超声雾化清洗</div>
                    </div>
                    <div class="pd-5" :style="minute < 1  ? 'color:#17cfe1;' :'color:#fff;'">
                        <div>第五分钟</div>
                        <div>360度</div>
                        <div>负离子空气净化</div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 第四步详情 v-show="options.experienceStep == 4"-->
        <div v-show="options.experienceStep == 4" class="step-content round-5">
            <div class="step-4 flex between pd-10 tc fs-12">
                <div>
                    <div class="skyblue">检测项目</div>
                    <div class>TVOC(有机挥发物)</div>
                    <div class>HCHO(甲醛)</div>
                    <div class>PM2.5(空气污染)</div>
                </div>
                <div>
                    <div class="skyblue">检测值</div>
                    <div :class="['green','yellow','red'][afterRecord.checkStatusTvoc]">
                        {{afterRecord.tvoc || '<0.01' }}mg/m³
                        <cy-icon v-if="afterRecord.checkStatusTvoc == 2" type="jinggao" color="#FF0000" size="15"></cy-icon>
                    </div>
                    <div :class="['green','yellow','red'][afterRecord.checkStatusTcho]">
                        {{afterRecord.hcho || '<0.01' }}mg/m³
                        <cy-icon v-if="afterRecord.checkStatusTcho == 2" type="jinggao" color="#FF0000" size="15"></cy-icon>
                    </div>
                    <div :class="['green','yellow','red'][afterRecord.checkStatusPm]">
                        {{afterRecord.pm25}}ug/m³
                        <cy-icon v-if="afterRecord.checkStatusPm == 2" type="jinggao" color="#FF0000" size="15"></cy-icon>
                    </div>
                </div>
                <div>
                    <div class="skyblue">国家标准</div>
                    <div class>0.6mg/m³</div>
                    <div class>0.1mg/m³</div>
                    <div class>35ug/m³</div>
                </div>
            </div>
        </div>

        <!-- 第五步详情 v-show="options.experienceStep == 5"-->
        <div v-show="options.experienceStep == 5 || options.experienceStep == 6" class="step-content round-5">
            <div class="step-5 flex between pd-10 tc fs-12">
                <div>
                    <div class="skyblue">检测项目</div>
                    <div class>TVOC(有机挥发物)</div>
                    <div class>HCHO(甲醛)</div>
                    <div class>PM2.5(空气污染)</div>
                </div>
                <div>
                    <div class="skyblue">
                        施工<span>前</span>数值
                    </div>
                    <div :class="['green','yellow','red'][beforeRecord.checkStatusTvoc]">
                        {{beforeRecord.tvoc || '<0.01' }}mg/m³
                        <cy-icon v-if="beforeRecord.checkStatusTvoc == 2" type="jinggao" color="#FF0000" size="15"></cy-icon>
                    </div>
                    <div :class="['green','yellow','red'][beforeRecord.checkStatusTcho]">
                        {{beforeRecord.hcho || '<0.01' }}mg/m³
                        <cy-icon v-if="beforeRecord.checkStatusTcho == 2" type="jinggao" color="#FF0000" size="15"></cy-icon>
                    </div>
                    <div :class="['green','yellow','red'][beforeRecord.checkStatusPm]">
                        {{beforeRecord.pm25}}ug/m³
                        <cy-icon v-if="beforeRecord.checkStatusPm == 2" type="jinggao" color="#FF0000" size="15"></cy-icon>
                    </div>
                </div>
                <div>
                    <div class="skyblue">
                        施工<span>后</span>数值
                    </div>
                    <div :class="['green','yellow','red'][afterRecord.checkStatusTvoc]">
                        {{afterRecord.tvoc || '<0.01' }}mg/m³
                        <cy-icon v-if="afterRecord.tvoc > beforeRecord.tvoc" type="wangshang1" color="#0091FF" size="15"></cy-icon>
                        <cy-icon v-if="afterRecord.tvoc < beforeRecord.tvoc" type="wangxia1" color="#0091FF" size="15"></cy-icon>
                    </div>
                    <div :class="['green','yellow','red'][afterRecord.checkStatusTcho]">
                        {{afterRecord.hcho || '<0.01' }}mg/m³
                        <cy-icon v-if="afterRecord.hcho > beforeRecord.hcho" type="wangshang1" color="#0091FF" size="15"></cy-icon>
                        <cy-icon v-if="afterRecord.hcho < beforeRecord.hcho" type="wangxia1" color="#0091FF" size="15"></cy-icon>
                    </div>
                    <div :class="['green','yellow','red'][afterRecord.checkStatusPm]">
                        {{afterRecord.pm25}}ug/m³
                        <cy-icon v-if="afterRecord.pm25 > beforeRecord.pm25" type="wangshang1" color="#0091FF" size="15"></cy-icon>
                        <cy-icon v-if="afterRecord.pm25 < beforeRecord.pm25" type="wangxia1" color="#0091FF" size="15"></cy-icon>
                    </div>
                </div>
            </div>
        </div>

    </div>

    <div class="flex pd-15" v-show="isShow">
        <cy-btn @click.native="$router.push(`/share_money?isNowBuy=1&applyPk=${options.applyPk}`)" type="blue-gradient" round>购买继续施工</cy-btn>
        <cy-btn v-if="options.experienceStep == 6 && evaluateStatus == 0" @click.native="$router.push(`/experience/evaluate?applyPk=${options.applyPk}`)" class="mgl-10" type="white" round plain>去评价</cy-btn>
    </div>

    <!-- 选择设备 -->
    <cy-popup v-model="showCaseSwiper" :closeIcon="false" height="60vh">
        <cy-cell v-for="(item,index) in equipmentList" :key="index" @click.native="handleChangeId(item.equipmentID,item.longitude, item.latitude)" :title="item.equipmentID" link="javascript:;"></cy-cell>
    </cy-popup>
</div>
</template>

<script>
import {
    config
} from '@/service/config.js'
import getEndTime from '@/utils/countDown.js'
export default {
    name: "experience_center",
    props: {},
    data() {
        return {
            WS: null,
            info: localStorage.getItem('vuex') ? JSON.parse(localStorage.getItem('vuex')) : {},
            equipmentList: [],
            showCaseSwiper: false, //是否显示弹框
            status: 2, //体验状态
            options: {
                experienceTotal: '', //	Integer	体验者数量
                equipmentId: '', //		String	设备id
                carNum: '', //		String	车牌
                temperature: '', //		String	温度,℃
                current: '', //		String	电流,A
                longitude: '', //		String	经度
                latitude: '', //		String	维度
                experienceStep: '' //体验步骤:0:无动作(默认) 1-5分布是第几步
            }, //体验完的数据
            beforeRecord: {
                tvoc: "",
                hcho: "",
                pm25: "",
                checkStatusTvoc: 1, //tvoc 状态
                checkStatusTcho: 1, // hcho状态
                checkStatusPm: 1 // pm2.5 状态
            }, //施工前报告
            afterRecord: {
                tvoc: "",
                hcho: "",
                pm25: "",
                checkStatusTvoc: 1, //tvoc 状态
                checkStatusTcho: 1, // hcho状态
                checkStatusPm: 1 // pm2.5 状态
            }, //施工后报告
            time: null,
            wavyList: [{
                x: 0,
                y: 68
            }, {
                x: 9,
                y: 46
            }, {
                x: 26,
                y: 31
            }, {
                x: 49,
                y: 20
            }, {
                x: 73,
                y: 14
            }, {
                x: 98,
                y: 10
            }, {
                x: 122,
                y: 9
            }, {
                x: 146,
                y: 9
            }, {
                x: 172,
                y: 11
            }, {
                x: 196,
                y: 14
            }, {
                x: 219,
                y: 21
            }, {
                x: 238,
                y: 31
            }, {
                x: 254,
                y: 44
            }, {
                x: 266,
                y: 58
            }, {
                x: 277,
                y: 74
            }],
            dateList: [],
            endTime: null,
            minute: 5, //倒计时分钟 用于判断当前是第三步中的第几步
            isShow: false,
            workCountDown: 0,
            evaluateStatus: "1" //0未评价 1已评价
        };
    },

    created() {
        const params = this.$route.params.id.split(',')
        document.title = '体验中心-'+params[3]||'';
        this.update()
    },
    methods: {
        // 倒计时
        _countdown(time) {
            /**
                time:秒数
             */
            // 先清除定时器
            if (this.endTime) {
                clearInterval(this.endTime)
                this.endTime = null;
            }
            let workCountDown = time > 2 ? time - 2 : time
            this.endTime = setInterval(() => {
                if (workCountDown >= 0) {
                    let minute = parseInt(workCountDown / 60) //分
                    this.minute = minute; //分钟 赋值
                    console.log(minute)
                    let second = workCountDown % 60 //秒
                    second = second > 9 ? second : `0${second}`
                    second = String(second).split('');
                    this.dateList = ['-', '距', '离', '结', '束', '还', '有', '0', minute, '分', second[0], second[1], '秒', '-'];
                    workCountDown--
                } else {
                    if (this.endTime) {
                        clearInterval(this.endTime)
                        this.endTime = null;
                    }
                }
            }, 1000)
        },
        // 设备列表
        getEquipmentByUser() {
            return new Promise((resolve, reject) => {
                const id = this.$route.params.id;
                if (id) {
                    const params = this.$route.params.id.split(',')
                    this.$toast.loading("加载中…");
                    this.$api.getEquipmentByUser({
                            faccount: params[1],
                            auth: 'all',
                            level: 2,
                            equipmentType: '2'
                        }).then(data => {
                            if (data && data.response.length && data.response[0].equipmentList) {
                                const equipmentList = data.response[0].equipmentList
                                this.equipmentList = equipmentList;
                                this.options = {
                                    ...this.options,
                                    equipmentId: equipmentList[0].equipmentID,
                                    longitude: equipmentList[0].longitude, //		String	经度
                                    latitude: equipmentList[0].latitude, //		String	维度
                                }
                            }
                            this.$toast.clear();
                            resolve()
                        })
                        .catch(err => {});
                }
            })
        },
        // 连接webSocket
        webSocket() {
            if ("WebSocket" in window) {
                // 打开一个 web socket
                this.WS = new WebSocket(config.WEBSOCKETURL);
                // ws.readyState
                // 0 - 表示连接尚未建立。
                // 1 - 表示连接已建立，可以进行通信。
                // 2 - 表示连接正在进行关闭。
                // 3 - 表示连接已经关闭或者连接不能打开。
                this.WS.onopen = () => {
                    // 打开一个 web socket
                    // Web Socket 已连接上，使用 send() 方法发送数据
                    // 进来先发送一次注册数据
                    this.WS.send(`register:${this.options.equipmentId}`);
                    // 每8s 握手一次
                    this.time = setInterval(() => {
                        if (this.WS.readyState == 1) {
                            this.WS.send(`handshake|${this.options.equipmentId}`);
                        } else {
                            // 状态不是1  就断开连接 以及定时器
                            this.disconnect()
                        }
                    }, 8000)
                    // 重新连接
                    if (this.WS.readyState !== 1) {
                        this.againWebSocket()
                    }
                };

                this.WS.onmessage = (evt) => {
                    var received_msg = evt.data;
                    // 解析数据
                    this._getParsingData(received_msg)
                };
                this.WS.error = () => {
                    console.log("通信异常！")
                    // 重新连接
                    this.againWebSocket()
                }
            } else {
                // 浏览器不支持 WebSocket
                this.$toast('您的浏览器不支持 WebSocket')
            }
        },
        // 解析数据
        _getParsingData(equipmentData) {
            // 是否需要解析的数据
            if (equipmentData.includes(`equipmentData:${this.options.equipmentId}:`)) {
                const data = equipmentData.replace(`equipmentData:${this.options.equipmentId}:`, '');
                // console.log('data')
                // console.log(JSON.parse(data))

                const _data = JSON.parse(data);
                // 是否显示按钮
                this.isShow = this.info.user.pk == _data.userPk
                this.options = {
                    ...this.options,
                    equipmentId: _data.equipmentID, //		String	设备id
                    carNum: _data.carNum, //		String	车牌
                    temperature: _data.temperature, //		String	温度,℃
                    current: _data.current / 10, //		String	电流,A
                    longitude: _data.longitude, //		String	经度
                    latitude: _data.latitude, //		String	维度
                    experienceStep: _data.experienceStep //体验步骤:0:无动作(默认) 1-5分布是第几步
                }
                /** 数据
                 * 温度(TH) 湿度(RH) 需要 除以 10
                 * hcho 需要除以 1000
                 * tvoc 需要除以 100
                 * TVOC = 0，显示<0.01 、 甲醛 = 0   显示<0.01  、 pm2.5 = 0   显示5
                 */

                // 施工前
                let tvoc = _data.tvoc > 0 ? _data.tvoc / 100 : _data.tvoc;

                let hcho = _data.hcho > 0 ? _data.hcho / 1000 : _data.hcho;
                let pm25 = (_data.pm25 || _data.pM25) == 0 ? 5 : (_data.pm25 || _data.pM25);

                //状态：良好 关注 处理
                // tvoc 状态
                let checkStatusTvoc = 0
                if (tvoc > 0.6 && tvoc <= 1) {
                    checkStatusTvoc = 1
                } else if (tvoc > 1) {
                    checkStatusTvoc = 2
                }

                // hcho状态
                let checkStatusTcho = 0
                if (hcho > 0.1 && hcho <= 0.3) {
                    checkStatusTcho = 1
                } else if (hcho > 0.3) {
                    checkStatusTcho = 2
                }

                // pm2.5 状态
                let checkStatusPm = 0
                if (pm25 >= 35 && pm25 <= 75) {
                    checkStatusPm = 1
                } else if (pm25 > 75) {
                    checkStatusPm = 2
                }
                if (_data.workStatus == '0') {
                    this.beforeRecord = {
                        ...this.beforeRecord,
                        tvoc: Number(tvoc),
                        hcho: Number(hcho).toFixed(2),
                        pm25: Number(pm25),
                        checkStatusTvoc, //tvoc 状态
                        checkStatusTcho, // hcho状态
                        checkStatusPm // pm2.5 状态
                    }
                }
                // 施工后
                if (_data.workStatus == '2') {
                    this.afterRecord = {
                        ...this.afterRecord,
                        tvoc: Number(tvoc),
                        hcho: Number(hcho).toFixed(2),
                        pm25: Number(pm25),
                        checkStatusTvoc, //tvoc 状态
                        checkStatusTcho, // hcho状态
                        checkStatusPm // pm2.5 状态
                    }
                }

                // 第3 4 5 6步 且没有施工前数据就调用一次接口
                if (['3', '4', '5', '6'].includes(_data.experienceStep)) {
                    if (!this.beforeRecord.tvoc || !this.beforeRecord.hcho) {
                        this.getExperienceReport(_data.userPk, false)
                    }
                }
                // 5分钟倒计时 确保是第三步 且 workCountDown > 0 才开始倒计时
                if (_data.experienceStep == '3' && _data.workCountDown > 0) {
                    // _data.equipmentRunningState 0: 未运行 1: 正在运行 2: 正在暂停 3: 异常退出 4: 正常退出 5: 施工完成
                    if (_data.equipmentRunningState == '1') {
                        console.log(1111)
                        this._countdown(_data.workCountDown)
                    } else {

                        // 倒计时暂停

                        clearInterval(this.endTime)
                        this.endTime = null;
                        let minute = parseInt(_data.workCountDown / 60) //分
                        this.minute = minute; //分钟 赋值
                        let second = _data.workCountDown % 60 //秒
                        second = second > 9 ? second : `0${second}`
                        second = String(second).split('');
                        this.dateList = ['-', '距', '离', '结', '束', '还', '有', '0', minute, '分', second[0], second[1], '秒', '-'];
                    }
                } else {
                    // _data.workCountDown < 0 代表是倒计时之前   _data.workCountDown ==  0 代表是倒计时结束  否则 正在倒计时
                    if (_data.experienceStep == '3' && _data.workCountDown == -1 && _data.workStatus == 1) {
                        this.minute = 5;
                    } else {
                        this.minute = 0;
                    }
                    if (this.endTime) {
                        clearInterval(this.endTime)
                        this.endTime = null;
                    }
                }

                this.workCountDown = _data.workCountDown

                // 步骤状态为6 代表结束  断开连接
                if (_data.experienceStep == '6') {
                    // 步骤是6 就断开连接  不需要拿接口数据 因为平板可能还没有上传完数据
                    this.disconnect()
                    // 体验报告
                    // this.getExperienceReport(_data.userPk)
                }
            }
        },
        // 重连WebSocket
        againWebSocket() {
            //先关闭  然后在重新连接
            this.disconnect()
            this.webSocket()
        },
        // 选择设备ID
        handleChangeId(id, longitude, latitude) {
            this.options = {
                ...this.options,
                equipmentId: id,
                longitude, //		String	经度
                latitude //		String	维度
            }
            this.showCaseSwiper = false;

            this.beforeRecord = {
                tvoc: "",
                hcho: "",
                pm25: "",
                checkStatusTvoc: 1, //tvoc 状态
                checkStatusTcho: 1, // hcho状态
                checkStatusPm: 1 // pm2.5 状态
            } //施工前报告
            this.afterRecord = {
                tvoc: "",
                hcho: "",
                pm25: "",
                checkStatusTvoc: 1, //tvoc 状态
                checkStatusTcho: 1, // hcho状态
                checkStatusPm: 1 // pm2.5 状态
            } //施工后报告
            this.minute = 5
            // 断开连接
            this.disconnect()
            if (this.endTime) {
                clearInterval(this.endTime)
                this.endTime = null;
            }

            // 重连webSocket
            this.webSocket()
        },
        // 获取用户体验报告
        getExperienceReport(lookUserPk, isData = true) {
            return new Promise((resolve, reject) => {
                const params = this.$route.params.id.split(',')
                if (params && params[2]) {
                    this.$api.getExperienceReport({
                        sysSource: '2', //	true	请求URL	String		系统类型：2=车内大健康
                        orgPk: params[2], //	true	请求URL	String		门店pk
                        lookUserPk, //	true	请求URL	String		用户pk
                        projectPk: '' //	true	请求URL	String		项目pk
                    }).then(data => {
                        // 不等于三 直接return
                        if (data.obj.status != '3') {
                            this.options = {
                                ...this.options,
                                rank: data.obj.rank, //	Integer	体验者数量
                                applyPk: data.obj.applyPk //申请记录pk
                            }
                            resolve()
                            return
                        }
                        this.evaluateStatus = data.obj.evaluateStatus //评价状态
                        this.isShow = this.info.user.pk == data.obj.userPk
                        if (isData) {
                            this.options = {
                                ...this.options,
                                rank: data.obj.rank, //	Integer	体验者数量
                                applyPk: data.obj.applyPk, //申请记录pk
                                equipmentId: data.obj.equipmentId || this.options.equipmentId, //		String	设备id
                                carNum: data.obj.carNum || '--', //		String	车牌
                                temperature: data.obj.temperature || '--', //		String	温度,℃
                                current: data.obj.current ? data.obj.current / 10 : '--', //		String	电流,A
                                longitude: data.obj.longitude || this.options.longitude, //		String	经度
                                latitude: data.obj.latitude || this.options.latitude, //		String	维度
                                experienceStep: data.obj.experienceStep == 6 ? data.obj.experienceStep : this.options.experienceStep //体验步骤:0:无动作(默认) 1-5分布是第几步
                            }
                        }

                        /** 数据
                         * 温度(TH) 湿度(RH) 需要 除以 10
                         * hcho 需要除以 1000
                         * tvoc 需要除以 100
                         * TVOC = 0，显示<0.01 、 甲醛 = 0   显示<0.01  、 pm2.5 = 0   显示5
                         */
                        if (data.obj.beforeRecord) {
                            let beforeRecord = {
                                ...data.obj.beforeRecord
                            }
                            // 施工前
                            let beforeTvoc = beforeRecord.tvoc > 0 ? beforeRecord.tvoc / 100 : beforeRecord.tvoc;
                            let beforeHcho = beforeRecord.hcho > 0 ? beforeRecord.hcho / 1000 : beforeRecord.hcho;
                            let beforePm25 = beforeRecord.pm25 == 0 ? 5 : beforeRecord.pm25;

                            //状态：良好 关注 处理
                            // tvoc 状态
                            let beforeCheckStatusTvoc = 0
                            if (beforeTvoc > 0.6 && beforeTvoc <= 1) {
                                beforeCheckStatusTvoc = 1
                            } else if (beforeTvoc > 1) {
                                beforeCheckStatusTvoc = 2
                            }

                            // hcho状态
                            let beforeCheckStatusTcho = 0
                            if (beforeHcho > 0.1 && beforeHcho <= 0.3) {
                                beforeCheckStatusTcho = 1
                            } else if (beforeHcho > 0.3) {
                                beforeCheckStatusTcho = 2
                            }

                            // pm2.5 状态
                            let beforeCheckStatusPm = 0
                            if (beforePm25 >= 35 && beforePm25 <= 75) {
                                beforeCheckStatusPm = 1
                            } else if (beforePm25 > 75) {
                                beforeCheckStatusPm = 2
                            }

                            this.beforeRecord = {
                                ...this.beforeRecord,
                                tvoc: Number(beforeTvoc),
                                hcho: Number(beforeHcho).toFixed(2),
                                pm25: Number(beforePm25),
                                checkStatusTvoc: beforeCheckStatusTvoc, //tvoc 状态
                                checkStatusTcho: beforeCheckStatusTcho, // hcho状态
                                checkStatusPm: beforeCheckStatusPm // pm2.5 状态
                            }
                        }

                        /************************  施工后 *********************************/
                        /** 数据
                         * 温度(TH) 湿度(RH) 需要 除以 10
                         * hcho 需要除以 1000
                         * tvoc 需要除以 100
                         * TVOC = 0，显示<0.01 、 甲醛 = 0   显示<0.01  、 pm2.5 = 0   显示5
                         */
                        if (data.obj.afterRecord) {
                            let afterRecord = {
                                ...data.obj.afterRecord
                            }
                            let afterTvoc = afterRecord.tvoc > 0 ? afterRecord.tvoc / 100 : afterRecord.tvoc;
                            let afterHcho = afterRecord.hcho > 0 ? afterRecord.hcho / 1000 : afterRecord.hcho;
                            let afterPm25 = afterRecord.pm25 == 0 ? 5 : afterRecord.pm25;

                            //状态：良好 关注 处理
                            // tvoc 状态
                            let afterCheckStatusTvoc = 0
                            if (afterTvoc > 0.6 && afterTvoc <= 1) {
                                afterCheckStatusTvoc = 1
                            } else if (afterTvoc > 1) {
                                afterCheckStatusTvoc = 2
                            }

                            // hcho状态
                            let afterCheckStatusTcho = 0
                            if (afterHcho > 0.1 && afterHcho <= 0.3) {
                                afterCheckStatusTcho = 1
                            } else if (afterHcho > 0.3) {
                                afterCheckStatusTcho = 2
                            }

                            // pm2.5 状态
                            let afterCheckStatusPm = 0
                            if (afterPm25 >= 35 && afterPm25 <= 75) {
                                afterCheckStatusPm = 1
                            } else if (afterPm25 > 75) {
                                afterCheckStatusPm = 2
                            }

                            this.afterRecord = {
                                ...this.afterRecord,
                                tvoc: Number(afterTvoc),
                                hcho: Number(afterHcho).toFixed(2),
                                pm25: Number(afterPm25),
                                checkStatusTvoc: afterCheckStatusTvoc, //tvoc 状态
                                checkStatusTcho: afterCheckStatusTcho, // hcho状态
                                checkStatusPm: afterCheckStatusPm // pm2.5 状态
                            }
                        }

                        resolve()
                    })
                }
            })
        },
        async update() {
            try {
                // 需要下调用设备列表api 因为equipmentId 默认是列表第一个  后面如果体验报告有equipmentId 直接覆盖
                // 设备列表
                await this.getEquipmentByUser()
                // 体验报告
                await this.getExperienceReport(this.info.user.pk)
                // this.options.experienceStep  == 6 代表已经结束 否则就 连接 webSocket 获取检测信息
                if (this.options.experienceStep !== '6') {
                    this.webSocket()
                }
            } catch (err) {
                console.log(err)
            }
        },
        // 断开连接
        disconnect() {
            //关闭WS
            if (this.WS) {
                this.WS.close();
            }
            if (this.time) {
                clearInterval(this.time)
                this.time = null
            }
        }
    },
    beforeDestroy() {
        this.disconnect()

        if (this.endTime) {
            clearInterval(this.endTime)
            this.endTime = null;
        }
    },
    mounted() {
        document.addEventListener("visibilitychange", () => {
            // 监听页面显示  手机后台切换前台
            if (!document.hidden && this.options.experienceStep !== '6') {
                this.webSocket()
            } else {
                // 页面隐藏断开连接
                this.disconnect()
            }
        });
    }
};
</script>

<style lang="scss" scoped>
@import "../../../assets/css/_mixin";

.head {
    /deep/.cy-cell {
        padding: 4px 15px;

        .cy-cell-title {
            font-size: 12px;
        }

        &.cy-field-blue::after {
            left: 22px;
        }
    }

    .flex:last-child {
        /deep/.cy-cell {
            &.cy-field-blue::after {
                border-width: 0;
            }
        }
    }

}

.step {
    .step-line {
        display: flex;
        align-items: center;
        padding: 10px 25px;

        .line {
            margin: 0 15px;
            width: 32px;
            height: 1px;
            background: #104c7e;

            &.active {
                background: #35abd9;
            }
        }

        .circle {
            position: relative;
            width: 12px;
            height: 12px;
            background: #021b30;
            border-radius: 50%;

            &::before {
                content: "";
                position: absolute;
                width: 6px;
                height: 6px;
                border-radius: 50%;
                background: #104c7e;
                left: 3px;
                top: 3px;
            }

            &.last,
            &.active {
                &::before {
                    transform: rotate(-90deg);
                    background-image: linear-gradient(270deg,
                            #3f8bfd 0%,
                            #29d7a8 100%);
                }
            }

            &.last {
                box-shadow: 0 0px 8px 0 #008bff;
            }

            &.active {
                animation: fade-in-out 1s ease infinite;
            }
        }
    }
}

.step-item {
    display: flex;
    margin-left: -5px;
    margin-right: -5px;

    .item {
        position: relative;
        width: 61px;
        height: 70px;
        margin: 0px 5px 10px 5px;
        border-radius: 6px;

        .bg {
            padding: 10px 3px;
            background: #021b30;
            position: absolute;
            z-index: 2;
            top: 0px;
            left: 0px;
            right: 0px;
            bottom: 0px;
            border-radius: 5px;
        }

        .name {
            margin-bottom: 3px;
        }

        &.last::after,
        &.active::after {
            content: "";
            position: absolute;
            top: -1px;
            left: -1px;
            right: -1px;
            bottom: -1px;
            background: linear-gradient(rgba(41, 215, 168, 0.5) 0%,
                    rgba(0, 139, 255, 0.5) 100%);
            box-shadow: 0px -1px 6px 0 rgba(41, 215, 168, 0.2),
                1px 0px 6px 0 rgba(0, 139, 255, 0.2),
                0px 1px 6px 0 rgba(41, 215, 168, 0.2),
                -1px 0 6px 0 rgba(0, 139, 255, 0.2);
            z-index: 0;
            border-radius: 5px;
        }

        &.active::after {
            animation: fade-in-out2 1s ease infinite;
        }
    }
}

@keyframes fade-in-out {
    0% {
        box-shadow: 0 1px 8px 0 #008bff;
    }

    50% {
        box-shadow: 0 1px 8px 0 #04243e;
    }

    100% {
        box-shadow: 0 1px 8px 0 #008bff;
    }
}

@keyframes fade-in-out2 {
    0% {
        opacity: 1;
    }

    50% {
        opacity: 0.2;
    }

    100% {
        opacity: 1;
    }
}

.step-content {
    position: relative;
    z-index: 1;

    &::after {
        content: "";
        position: absolute;
        top: -1px;
        left: -1px;
        right: -1px;
        bottom: -1px;
        background: linear-gradient(rgba(41, 215, 168, 0.5) 0%,
                rgba(0, 139, 255, 0.5) 100%);
        box-shadow: 0px -1px 6px 0 rgba(41, 215, 168, 0.2),
            1px 0px 6px 0 rgba(0, 139, 255, 0.2),
            0px 1px 6px 0 rgba(41, 215, 168, 0.2),
            -1px 0 6px 0 rgba(0, 139, 255, 0.2);
        z-index: -1;
        border-radius: 5px;
    }

    .step-2,
    .step-3,
    .step-4,
    .step-5 {
        background: #021b30;
        border-radius: 5px;
    }

    .step-4,
    .step-5 {
        line-height: 2.5;
    }

    .step-2::before,
    .step-3::before,
    .step-4::before,
    .step-5::before {
        content: "";
        position: absolute;
        top: -3px;
        margin-left: -3px;
        z-index: 3;
        border-style: solid;
        border-width: 3px;
        border-color: #021b30 #021b30 transparent transparent;
        box-shadow: 2px -2px 2px rgba(41, 215, 168, 0.2);
        transform: rotate(-45deg);
    }

    .step-2::before {
        left: 97px;
    }

    .step-3::before {
        left: 173px;
    }

    .step-4::before {
        left: 243px;
    }

    .step-5::before {
        left: 313px;
    }
}

.popup-wrapper-container {
    position: absolute;
    bottom: 0;
    left: 0;
    // transform: translate(0, 0);
    width: 100%;
    max-height: 60vh;
    background: #fff;
    overflow: auto;

    >div {
        position: relative;
        height: 45px;
        line-height: 45px;
        text-align: center;

        &::before {
            @include setBottomLine(#e6e6e6);
        }
    }
}

.skyblue {
    span {
        color: #fff;
    }
}

.countdown-wrapper {
    padding: 24px 0 13px 0;

    .time-wrapper {
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        font-size: 12px;
        color: #FFFFFF;
        margin-top: 13px;
        font-weight: bold;

        span {
            margin: 0 4px;
        }

        .time-wrapper-num {
            padding: 0 4px;
            background: #052138;
            font-size: 13px;
            color: #17CFE1;
        }
    }

    .image-wrapper {
        position: relative;
        text-align: center;

        .bg_home {
            margin:0 auto;
            width: 263px;
            height: 227px;
        }

        .bg_label {
            position: absolute;
            top: -4px;
            right: 40px;
            width: 135px;
            height: 56px;
            background: url('../../../assets/img/experience/bg_label.png') no-repeat;
            background-size: 100% 100%;
            font-size: 12px;
            color: #2D2586;
            text-align: center;
            line-height: 40px;
            animation: scaleDraw 4s infinite;
            -webkit-animation: scaleDraw 4s infinite;
        }

        @keyframes scaleDraw {
            0% {
                transform: scale(1);
            }

            25% {
                transform: scale(1.1);
            }

            50% {
                transform: scale(1);
            }

            75% {
                transform: scale(1.1);
            }
        }

        .diversions-wrapper {
            display: flex;
            justify-content: space-between;
            width: 274px;
            position: absolute;
            left: 50%;
            bottom: 3px;
            transform: translate(-50%, 0);

            .animation {
                animation: animate 1.5s ease-in-out infinite;
                animation-delay: calc(.08s*var(--i));
            }

            div {
                width: 8px;
                height: 8px;
                transform: rotate(-90deg);
                transform: rotate(-90deg);
                background-image: linear-gradient(270deg, #3F8BFD 0%, #29D7A8 100%);
                box-shadow: 0 1px 15px 0 #008BFF;
                border-radius: 50%;
                border-radius: 50%;
                position: absolute;
                top: calc(-1px*var(--y));
                left: calc(1px*var(--x));
                // animation: animate 1.5s ease-in-out infinite;
                // animation-delay: calc(.08s*var(--i));
            }

            @keyframes animate {
                0% {
                    transform: scale(1) rotate(-90deg);
                }

                20% {
                    transform: scale(1.5) rotate(-90deg);
                }

                40%,
                100% {
                    transform: scale(1) rotate(-90deg);
                }
            }
        }
    }
}

.step-2,
.step-4,
.step-5 {
    >div {
        >div {
            line-height: 30px;
        }
    }
}
</style>
