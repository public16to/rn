import React, { Component } from 'react';
import { View, StyleSheet, TextInput, Dimensions } from 'react-native';
import { WingBlank, Button, Toast, Provider, Text, WhiteSpace } from '@ant-design/react-native';
import CookieManager from '@react-native-community/cookies';
import { connect } from 'react-redux';
import moment from 'moment';
import momentLocal from 'moment/locale/zh-cn';
import { checkPhone } from '../utils/utils';

const screenWidth = Dimensions.get('window').width;
moment.defineLocale('zh-cn', momentLocal);

@connect(({ loading }) => ({
  loading: loading.effects['login/login'],
}))
class Detail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      phoneValue: '',
      captchaValue: '',
      count: 0,
    };
  }

  componentDidMount() {
    const { navigation } = this.props;
    navigation.addListener('beforeRemove', (e) => {
      // console.log(e);
      // e.preventDefault();
    });
    // 聚焦到输入框
    if (this.mobileInputRefer) {
      this.mobileInputRefer.focus();
    }
  }

  componentWillUnmount() {
    this.setState = () => {
      return;
    };
  }

  // 发送登录
  sendLogin() {
    const { phoneValue, captchaValue } = this.state;
    const { navigation, dispatch } = this.props;
    if (phoneValue === '') {
      if (this.mobileInputRefer) {
        this.mobileInputRefer.focus();
      }
      Toast.offline('手机号不能为空', 1.5);
      return;
    }
    if (captchaValue === '') {
      Toast.offline('手机验证码不能为空', 1.5);
      return;
    }
    const data = {
      mobile: phoneValue,
      vcode: captchaValue,
    };
    dispatch({
      type: 'login/login',
      data,
    }).then((res) => {
      if (res && res.uid) {
        CookieManager.set('http://todo.16to.com', {
          name: 'uid',
          value: res.uid,
        }).then((done) => {
          console.log(done);
          console.log(res, res.uid);
          setTimeout(() => navigation.navigate('Todo'), 0);
        });
      } else {
        if (this.captchaInputRefer) {
          this.captchaInputRefer.focus();
        }
        Toast.offline('手机验证码错误', 1.5);
      }
    });
  }

  // 发送验证码
  sendCaptcha() {
    const { dispatch } = this.props;
    const { phoneValue } = this.state;
    if (!checkPhone(phoneValue)) {
      if (this.mobileInputRefer) {
        this.mobileInputRefer.focus();
      }
      Toast.offline('手机号码有误，请确认', 1.5);
      return;
    }
    const data = {
      mobile: phoneValue,
    };
    dispatch({
      type: 'login/sendCaptcha',
      data,
    }).then((res) => {
      if (res && res.cc === 0) {
        Toast.success('手机验证码发送成功', 1.5);
        this.runGetCaptchaCountDown();
        if (this.captchaInputRefer) {
          this.captchaInputRefer.focus();
        }
      } else {
        Toast.success('手机验证码发送失败', 1.5);
      }
    });
  }

  // 内容变化
  phoneChange = (e) => {
    this.setState({
      phoneValue: e,
    });
  };

  // 内容变化
  captchaChange = (e) => {
    this.setState({
      captchaValue: e,
    });
  };

  // 验证码倒计时
  runGetCaptchaCountDown = () => {
    let count = 59;
    this.setState({ count });
    this.interval = window.setInterval(() => {
      count -= 1;
      this.setState({ count });
      if (count === 0) {
        clearInterval(this.interval);
      }
    }, 1000);
  };

  render() {
    const { loading } = this.props;
    const { count } = this.state;
    return (
      <Provider>
        <View style={styles.box}>
          <View style={styles.titleBox}>
            <Text style={styles.title}>Todo</Text>
          </View>
          <View style={styles.bannerBox}>
            <Text style={styles.banner}>可能是杭州滨江区最好用的代办应用</Text>
          </View>
          <WingBlank>
            <View style={styles.inputBox}>
              <View style={styles.mobileBox}>
                <TextInput
                  clear
                  placeholder="请输入手机号"
                  placeholderTextColor="#666"
                  style={styles.mobile}
                  autoFocus
                  onChangeText={this.phoneChange}
                  ref={(c) => {
                    this.mobileInputRefer = c;
                  }}
                />
              </View>
              <WhiteSpace />
              <View style={styles.captchaBox}>
                <TextInput
                  clear
                  placeholder="请输入手机验证码"
                  placeholderTextColor="#666"
                  onChangeText={this.captchaChange}
                  style={styles.captcha}
                  ref={(c) => {
                    this.captchaInputRefer = c;
                  }}
                />
                <Button disabled={!!count} style={styles.btn} type="ghost" onPress={() => this.sendCaptcha()}>
                  {count ? `${count} 秒` : '获取验证码'}
                </Button>
              </View>
            </View>
          </WingBlank>

          <WingBlank>
            <Button type="primary" onPress={() => this.sendLogin()} loading={loading}>
              确定
            </Button>
          </WingBlank>
        </View>
      </Provider>
    );
  }
}

//样式定义
const styles = StyleSheet.create({
  box: {
    flex: 1,
    textAlign: 'center',
    alignContent: 'center',
  },

  titleBox: {
    paddingVertical: 30,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  bannerBox: {
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  inputBox: {
    paddingVertical: 50,
    textAlign: 'center',
    alignContent: 'center',
  },
  title: {
    includeFontPadding: false,
    textAlignVertical: 'center',
    fontSize: 30,
    fontWeight: 'bold',
  },
  banner: {
    color: '#666',
    includeFontPadding: false,
    textAlignVertical: 'center',
    fontSize: 18,
  },
  captchaBox: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  mobile: {
    fontSize: 18,
    padding: 8,
    backgroundColor: '#fff',
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 6,
  },
  captcha: {
    fontSize: 18,
    padding: 8,
    backgroundColor: '#fff',
    width: screenWidth - 170,
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 6,
  },
  btn: {
    height: 48,
    width: 130,
    backgroundColor: '#fff',
  },
});

export default Detail;
