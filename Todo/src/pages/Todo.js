import React, { Component } from 'react';
import { Text, View, StatusBar, StyleSheet, ScrollView } from 'react-native';
import CookieManager from '@react-native-community/cookies';
import { connect } from 'react-redux';
import { Toast, Provider, Portal, Button, List } from '@ant-design/react-native';
import moment from 'moment';

moment.updateLocale('zh-cn', {
  weekdays: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"],
});

const Item = List.Item;

@connect(({ todo, user, setting, loading }) => ({
  todoList: todo.list,
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
    this.getTodoData();
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

  // 显示列表元素
  renderItem = (item) => {
    return (
      <View>
        <Text>{item.title}</Text>
      </View>
    )
  }

  render() {
    const { todoList, ssoUser } = this.props;
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
        <View>
          <Text>{ssoUser && ssoUser.name} 代办事项</Text>
          <Text>{moment().format("M月D日 dddd")}</Text>
        </View>
        <ScrollView
          style={{ flex: 1, backgroundColor: '#f5f5f9' }}
          automaticallyAdjustContentInsets={false}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
        >
          <List>
            {
              todoList && todoList.map((item) => (
                <Item wrap key={item.id}>
                  {item.title}
                </Item>
              ))
            }
          </List>
        </ScrollView>
        <Button type="primary" onPress={() => this.showToast()}>
          刷新
        </Button>
      </Provider>
    );
  }
}

//样式定义
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 34,
  },
});

export default Todo;
