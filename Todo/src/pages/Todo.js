import React, { Component } from 'react';
import { Text, View, StatusBar, StyleSheet, ScrollView, RefreshControl, KeyboardAvoidingView } from 'react-native';
import CookieManager from '@react-native-community/cookies';
import { connect } from 'react-redux';
import { Toast, Provider, Portal, List, Checkbox, Button, Icon, Modal, InputItem, WingBlank } from '@ant-design/react-native';
import moment from 'moment';

moment.updateLocale('zh-cn', {
  weekdays: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
});

const Item = List.Item;
const CheckboxItem = Checkbox.CheckboxItem;

@connect(({ todo, user, setting, loading }) => ({
  todoList: todo.list,
  setting: setting.setting,
  ssoUser: user.ssoUser,
  loading: loading.effects['todo/select'],
}))
class Todo extends Component {

  key = '';
  params = {
    uid: '06eb7955e21f832424c1833a1e9f9daf',
  };

  constructor(props) {
    super(props);
    this.state = {
      addValue: '',
      noticeValue: '',
      settingVisible: false,
      noticeVisible: false,
      doneVisible: true,
      refreshingLoading: false,
      addVisible: false,
    };
  }

  componentDidMount() {
    this.getUserData();
    this.getTodoData();
  }

  // 获取数据
  getTodoData() {
    const { dispatch } = this.props;
    this.key = Toast.loading('加载中...');
    dispatch({
      type: 'todo/select',
      params: this.params,
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
      const uid = CookieManager.get('http://todo.16to.com');
      if (uid === undefined) {
        window.location.href = '/login';
        return;
      }
      // 是否显示隐藏
      this.setState({
        // doneVisible: localStorage.getItem("doneVisible") !== 'false'
      });
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
    );
  };

  // 改变状态
  changeItem = (id, status) => {
    const { dispatch } = this.props;
    const data = {
      status,
    };
    this.key = Toast.loading('加载中...');
    dispatch({
      type: 'todo/update',
      params: this.params,
      id,
      data,
    }).then((res) => {
      Portal.remove(this.key); // 移除所有的toast
    });
  };

  // 下拉刷新
  refresh() {
    const { dispatch } = this.props;
    dispatch({
      type: 'todo/select',
      params: this.params,
    }).then(() => {
      this.setState({
        refreshingLoading: false,
      })
    });
  }

  // 发送添加
  sendAdd() {
    const { addValue } = this.state;
    if (addValue === "") {
      Toast.warn('任务描述不能为空');
      return;
    }
    if (addValue.length > 200) {
      Toast.warn('任务描述过长，请不要超过200个字符');
      return;
    }
    const { dispatch } = this.props;
    const data = {
      title: addValue,
      uid: this.params.uid,
    }
    dispatch({
      type: 'todo/insert',
      params: this.params,
      data
    }).then(() => {
      this.setState({
        addVisible: false,
        addValue: '',
      })
    })
  }

  // 内容变化
  titleChange = (e) => {
    this.setState({
      addValue: e
    });
  }

  render() {
    const { todoList, ssoUser } = this.props;
    const { refreshingLoading, addVisible } = this.state;
    const doingData = [];
    const doneData = [];
    todoList &&
      todoList.forEach((item) => {
        if (item.status === 0) {
          doingData.push(item);
        }
        if (item.status === 1) {
          doneData.push(item);
        }
      });
    return (
      <Provider>

        <View style={styles.container}>
          <StatusBar animated={true} translucent={false} barStyle={'dark-content'} showHideTransition={'fade'} />
        </View>
        <View>
          <Text>{ssoUser && ssoUser.name}</Text>
          <Text>{moment().format('M月D日 dddd')}</Text>
        </View>
        <ScrollView
          style={styles.scroll}
          automaticallyAdjustContentInsets={false}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshingLoading} onRefresh={() => this.refresh()} title={'正在刷新...'} />
          }
        >
          <List renderHeader={'未完成'}>
            {doingData &&
              doingData.map((item) => (
                <CheckboxItem
                  onChange={() => {
                    this.changeItem(item.id, 1);
                  }}
                  key={item.id}
                >
                  {item.title}
                </CheckboxItem>
              ))}
          </List>
          <List renderHeader={'已完成'}>
            {doneData &&
              doneData.map((item) => (
                <CheckboxItem checked
                  onChange={() => {
                    this.changeItem(item.id, 0);
                  }} key={item.id} checkboxStyle={{ color: '#ccc' }}>
                  {item.title}
                </CheckboxItem>
              ))}
          </List>
        </ScrollView>
        <View style={styles.addBtn}>
          <Button type="primary" style={styles.button} onPress={() => this.setState({ addVisible: true })}><Icon name="plus" size={32} color="white" /></Button>
        </View>
        <Modal
          transparent={false}
          visible={addVisible}
          animationType="slide-down"
          maskClosable
          onClose={() => { this.setState({ addVisible: false }) }}
        >
          <View style={{ flex:1,paddingVertical: 220 }}>
            <InputItem
              clear
              placeholder="自动获取光标"
              autoFocus
              onChange={this.titleChange}
            >
              标题
          </InputItem>
          </View>
          <WingBlank
            style={{
              marginTop: 20,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Button type="ghost" onPress={() => this.setState({ addVisible: false })}>返回</Button>
            <Button type="primary" onPress={() => this.sendAdd()}>添加</Button>
          </WingBlank>
        </Modal>
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
  scroll: {
    flex: 1,
    backgroundColor: '#f5f5f9',
  },
  addBtn: {
    position: "absolute",
    right: 32,
    bottom: 32,
    zIndex: 9999,
  },
  button: {
    width: 64,
    height: 64,
    borderRadius: 32,
    shadowColor: '#666',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.6,
    shadowRadius: 6,
    elevation: 10,
  }
});

export default Todo;
