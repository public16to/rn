import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { WingBlank, Button, InputItem, Toast, Provider, Text } from '@ant-design/react-native';
import CookieManager from '@react-native-community/cookies';
import { connect } from 'react-redux';
import moment from 'moment';
import momentLocal from 'moment/locale/zh-cn';

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
    };
  }

  componentDidMount() {
    // 聚焦到输入框
    if (this.textInputRefer) {
      // this.textInputRefer.focus();
    }
  }

  componentDidUpdate() {
    // 聚焦到输入框
    console.log(this.textInputRefer);
    if (this.textInputRefer !== undefined) {
      // this.textInputRefer.focus();
    }
  }

  // 发送登录
  sendLogin() {
    const { phoneValue, captchaValue } = this.state;
    const { navigation } = this.props;
    if (phoneValue === '') {
      Toast.offline('手机号不能为空', 1.5);
      return;
    }
    if (captchaValue === '') {
      Toast.offline('手机验证码不能为空', 1.5);
      return;
    }
    const { dispatch } = this.props;
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
        }).then(() => {
          navigation.navigate('Todo');
        });
      } else {
        Toast.offline('手机验证码错误', 1.5);
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

  render() {
    const { loading } = this.props;
    return (
      <Provider>
        <View style={styles.box}>
          <View style={styles.titleBox}>
            <Text style={styles.title}>Todo</Text>
          </View>
          <View style={styles.bannerBox}>
            <Text style={styles.banner}>可能是杭州滨江区最好用的代办应用</Text>
          </View>
          <View style={styles.inputBox}>
            <WingBlank>
              <InputItem
                clear
                placeholder="请输入手机号"
                autoFocus
                onChange={this.phoneChange}
                ref={(c) => {
                  this.textInputRefer = c;
                }}
              />
            </WingBlank>
            <WingBlank>
              <InputItem clear placeholder="请输入手机验证码" onChange={this.captchaChange} />
            </WingBlank>
          </View>
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
});

export default Detail;
