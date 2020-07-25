/* eslint-disable react-native/no-inline-styles */
import React, { Component } from 'react';
import { Text, View, StatusBar, StyleSheet } from 'react-native';
import CookieManager from '@react-native-community/cookies';
import { connect } from 'react-redux';
import { Toast, Provider, Portal, Button } from '@ant-design/react-native';

@connect(({ todo, user, setting, loading }) => ({
  list: todo.list,
  setting: setting.setting,
  ssoUser: user.ssoUser,
  loading: loading.effects['todo/select']
}))
class Todo extends Component {
  state = {
    addValue: "",
    noticeValue: "",
    settingVisible: false,
    noticeVisible: false,
    doneVisible: true,
  };
  key = '';
  params = {};

  componentDidMount() {
    this.getUserData();
  }

  // 获取数据
  getTodoData() {
    const { dispatch } = this.props;
    const params = {
      uid: '06eb7955e21f832424c1833a1e9f9daf',
    };
    this.key = Toast.loading('Loading...');
    dispatch({
      type: 'todo/select',
      params,
    }).then((res) => {
      Portal.remove(this.key); // 移除所有的toast
    });
  }

  // 获取用户数据
  getUserData() {
    const { dispatch } = this.props;
    // 获取用户信息
    dispatch({
      type: 'user/fetchUser',
    }).then(() => {
      const uid = CookieManager.get("http://todo.16to.com");
      console.log(uid);
      if (uid === undefined) {
        window.location.href = "/login";
        return;
      }
      this.params.uid = uid;
      // 是否显示隐藏
      this.setState({
        // doneVisible: localStorage.getItem("doneVisible") !== 'false'
      })
      // 获取todo setting
      // this.selectSetting();
    });
  }

  // 展示弹框
  showToast() {
    // Toast.success('弹出展示成功');
    this.getTodoData();
  }

  render() {
    const { list, ssoUser } = this.props;
    return (
      <Provider>
        <View style={styles.container}>
          <StatusBar 
            animated={true}

            translucent={false}
            barStyle={'dark-content'}
            showHideTransition={'fade'}
          />
        </View>
        <View style={{ flex: 1 }}>
          <Text>{ssoUser && ssoUser.name}</Text>
          
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>
            {list &&
              list[Math.floor(Math.random() * (50 - 1 + 1) + 1)] &&
              list[Math.floor(Math.random() * (50 - 1 + 1) + 1)].title}
          </Text>
          <Text>hello world1</Text>
          <Button type="primary" onPress={() => this.showToast()}>
            展示
          </Button>
        </View>
      </Provider>
    );
  }
}

//样式定义
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    height:34,
  },
});

export default Todo;
