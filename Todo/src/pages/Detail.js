import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { WingBlank, Button, InputItem, Toast, Provider } from '@ant-design/react-native';
import CookieManager from '@react-native-community/cookies';
import { connect } from 'react-redux';
import moment from 'moment';
import momentLocal from 'moment/locale/zh-cn';

moment.defineLocale('zh-cn', momentLocal);

@connect(({ loading }) => ({
  loading: loading.effects['todo/add'],
}))
class Detail extends Component {
  params = {};

  constructor(props) {
    super(props);
    this.state = {
      addValue: '',
    };
    this.params.uid = props.uid;
  }

  componentDidMount() {
    const { navigation } = this.props;
    CookieManager.get('http://todo.16to.com').then((cookies) => {
      console.log(cookies.uid);
      if (cookies && cookies.uid === undefined) {
        navigation.navigate('Login');
        return;
      }
      this.params.uid = cookies.uid.value;
      console.log(this.params);
      this.getDetail();
    });

    // 聚焦到输入框
    if (this.textInputRefer) {
      this.textInputRefer.focus();
    }
  }

  componentDidUpdate() {
    // 聚焦到输入框
    console.log(this.textInputRefer);
    if (this.textInputRefer !== undefined) {
      this.textInputRefer.focus();
    }
  }

  // 获取待办详细
  getDetail() {
    const { route } = this.props;
    if (route && route.params && route.params.item) {
      this.setState({
        addValue: route.params.item.title,
      });
    } else {
      this.setState({
        addValue: '',
      });
    }
  }

  // 发送添加编辑
  sendAddEdit() {
    const { addValue } = this.state;
    const { navigation, route } = this.props;
    if (addValue === '') {
      Toast.offline('任务描述不能为空');
      return;
    }
    if (addValue.length > 200) {
      Toast.offline('任务描述过长，请不要超过200个字符');
      return;
    }
    const { dispatch } = this.props;
    const data = {
      title: addValue,
      uid: this.params.uid,
    };
    let type = 'todo/insert';
    let id;
    if (route && route.params && route.params.item) {
      type = 'todo/update';
      id = route.params.item.id;
    }
    dispatch({
      type: type,
      params: this.params,
      data,
      id,
    }).then(() => {
      this.setState({
        addValue: '',
      });
      navigation.navigate('Todo');
    });
  }

  // 内容变化
  titleChange = (e) => {
    this.setState({
      addValue: e,
    });
  };

  render() {
    const { addValue } = this.state;
    return (
      <Provider>
        <View>
          <View style={styles.inputBox}>
            <WingBlank>
              <InputItem
                clear
                placeholder="待办内容"
                defaultValue={addValue}
                autoFocus
                onChange={this.titleChange}
                underlineColorAndroid="transparent"
                ref={(c) => {
                  this.textInputRefer = c;
                }}
              >
                标题
              </InputItem>
            </WingBlank>
          </View>
          <WingBlank>
            <Button type="primary" onPress={() => this.sendAddEdit()}>
              完成
            </Button>
          </WingBlank>
        </View>
      </Provider>
    );
  }
}

//样式定义
const styles = StyleSheet.create({
  inputBox: {
    flex: 1,
    paddingVertical: 100,
  },
});

export default Detail;
