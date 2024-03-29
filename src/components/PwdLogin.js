import React, { Component } from 'react';
import { Link, hashHistory } from 'react-router';
require('../styles/LoginWeCode.css');
import LoadCode from './loadCode';

export default class PwdLogin extends Component {
    constructor() {
        super();
        //初始状态
        this.state = {
            OpenId: window.localStorage.getItem('openId'),
            form: {
                Phone: {
                    valid: false,
                    value: '',
                    error: ''
                },
                Pwd: {
                    valid: false,
                    value: '',
                    error: ''
                }
            },
            isShow:false,
            isLoginTip:'',
            loading: false,
            isStop:false//清空getOpenId
        };
    }
    handleValueChange(field, value, type = 'string') { //监控input值的改变

        const { form } = this.state;

        const newFieldObj = { value, valid: true, error: '' };
        let PhoneReg = /^1[0-9]{10}$/;
        var PwdReg = /^[0-9a-zA-Z]{6,}$/;
        switch (field) {
            case 'Phone': {
                if (!PhoneReg.test(newFieldObj.value)) {
                    newFieldObj.error = '请输入正确的手机号';
                    newFieldObj.valid = false;
                } else if (value.length === 0) {
                    newFieldObj.error = '手机号不能为空';
                    newFieldObj.valid = false;
                }
                break;
            }
            case 'Pwd': {
                if (!PwdReg.test(newFieldObj.value)) {
                    newFieldObj.error = '请输入6位或6位以上字母或数字';
                    newFieldObj.valid = false;
                } else if (newFieldObj.value.length <= 0) {
                    newFieldObj.error = '密码不能为空';
                    newFieldObj.valid = false;
                }
                break;
            }
        }

        this.setState({
            form: {
                ...form,
                [field]: newFieldObj
            }
        });
    }
    handleSubmit = (e,val) => {//提交表单
        e.preventDefault();
        const { OpenId, form } = this.state;//序列化
        if (!form.Phone.valid || !form.Pwd.valid) {
            alert('请填写正确的信息后重试');
            return;
        }
        this.setState({
            loading: true
        })
        // let data = new FormData('UserName=15711473935&Password=abc123');

        fetch(Login,
            {
                method: "POST",
                headers: {
                    "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
                },
                body: 'UserName='+form.Phone.value+'&Password='+form.Pwd.value
            })
            .then(res => res.json())
            .then(json => {
                if (json.result == 2) {
                    this.setState({
                        isStop:true
                    })
                    window.localStorage.setItem('Tonken', json.data.userToken);
                    hashHistory.push('/Main/Index/Index');
                } else if (json.result == 0) {
                    this.setState({
                        isShow:true,
                        isLoginTip:json.msg
                    })
                    let that = this;
                    setTimeout(function () {
                        that.setState({
                            isShow: false,
                            isLoginTip:''
                        })
                        that.refs.phone.value='';
                        that.refs.ps.value='';
                    }, 1500)
                   // hashHistory.push('/PwdLogin');
                }

            })
    }
    render() {
        var text = this.state.liked ? '获取验证码' : this.state.count + '秒后重发';
        // var loadType = this.state.loading ? 'loading' : '';
        var loadType = true;
        let Pwd = this.state.form.Pwd.valid;//Pwd的状态
        let Phone = this.state.form.Phone.valid;//Phone的状态
        const { form,isShow,isLoginTip } = this.state;

        var PhoneClass = !Phone && form.Phone.error ? 'b_from_label _from_label err_from' : 'b_from_label _from_label';
        var PwdClass = !Pwd && form.Pwd.error ? 'b_from_label _from_label err_from' : 'b_from_label _from_label';
        var btnClass = (form.Phone.valid && form.Pwd.valid) ? 'login_btn' : 'disabled';
        let isLoginError = isShow ? { display: 'block', height: document.documentElement.clientHeight + 'px' } : { display: 'none', height: document.documentElement.clientHeight + 'px' }
        return (
            <div className="login_c_c">
                <div className="fl pwd_login_box">
                    {/* { err_from} */}
                    <div className={PhoneClass}>
                        <span className="fl input_msg">
                            <span className="iconfont icon-p-shouji"></span>
                        </span>
                        <input type="text" ref='phone' onChange={(e) => this.handleValueChange('Phone', e.target.value)} placeholder="输入11位手机号" className="b_from_input _from_input" maxLength="11"/>
                        {/* <span className="b_red bit">*</span> */}
                        <p className="form_vail b_red">
                        {
                            !Phone && form.Phone.error != '' ? <span className="iconfont icon-cuowu"></span> : ''
                        }

                        {this.state.form.Phone.error}
                    </p>
                    </div>
                    
                    <div className={PwdClass}>
                        <span className="fl input_msg">
                            <span className="iconfont icon-mima"></span>
                        </span>
                        <input type="password" ref='ps' onChange={(e) => this.handleValueChange('Pwd', e.target.value)} placeholder="请输入6位或6位以上字母或数字" className="b_from_input _from_input" />
                        <p className="form_vail b_red">
                        {
                            !Pwd && form.Pwd.error != '' ? <span className="iconfont icon-cuowu"></span> : ''
                        }

                        {this.state.form.Pwd.error}
                    </p>
                    </div>
                    
                    {/*登录按钮  */}
                    <a href="javascript:;" className={btnClass} onClick={(e) => this.handleSubmit(e)} >
                        确认登录
                    </a>
                    {/*忘记密码  */}
                    <div className="from_forget">
                        <Link to="/BackCode" className="forget">
                            忘记密码?
                        </Link>
                    </div>
                </div>
                <div className="fr" style={{ marginLeft: '30px' }}>
                    <div className="login_code_box">
                        <LoadCode source={GetImageUrl} isStop={this.state.isStop}/>
                        <div className="code_b_text">
                            微信扫码快速/登录
                    </div>
                        <ul className="login_btn_box">
                            <li>
                                <Link to="/PwdLogin">
                                    <span className="iconfont icon-zhuanhuan"></span>
                                    切换密码登录
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
                {/* 登录失败提示 */}
                < div className="testTing" style={isLoginError} >
                    <div className="yy" ref="yys" >
                        <h5>{isLoginTip}</h5>
                    </div>
                </div>
            </div>
        )
    }
}