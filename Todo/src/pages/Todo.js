import React, { Component } from 'react';
import { Text, View, StatusBar, StyleSheet, ScrollView, RefreshControl, Platform } from 'react-native';
import CookieManager from '@react-native-community/cookies';
import { connect } from 'react-redux';
import { Toast, Provider, WhiteSpace, Portal, Button, Icon, WingBlank } from '@ant-design/react-native';
import moment from 'moment';
import momentLocal from 'moment/locale/zh-cn';
import TodoItem from './components/TodoItem';

moment.defineLocale('zh-cn', momentLocal);

@connect(({ todo, user, setting, loading }) => ({
  todoList: todo.list,
  setting: setting.setting,
  ssoUser: user.ssoUser,
  loading: loading.effects['todo/select'],
}))
class Todo extends Component {
  key = '';
  params = {
    uid: '',
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
    const { navigation } = this.props;
    CookieManager.get('http://todo.16to.com').then((cookies) => {
      console.log(cookies.uid);
      if (cookies && cookies.uid === undefined) {
        navigation.navigate('Login');
        return;
      }
      this.params.uid = cookies.uid.value;
      console.log(this.params);
      this.getUserData();
      this.getTodoData();
      this.fixStatusBar();
    });
  }

  // 获取数据
  getTodoData() {
    const { dispatch } = this.props;
    console.log(this.params);
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
      params: this.params,
    }).then(() => {
      // 是否显示隐藏
      CookieManager.get('http://todo.16to.com').then((cookies) => {
        if (cookies && cookies.doneVisible) {
          this.setState({
            doneVisible: cookies.doneVisible.value === 'true' ? true : false,
          });
        }
      });
      // 获取todo setting
      // this.selectSetting();
    });
  }

  // 显示列表元素
  renderItem = (item) => {
    return (
      <View>
        <Text>{item.title}</Text>
      </View>
    );
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
      });
    });
  }

  // 发送添加
  sendAdd() {
    const { addValue } = this.state;
    if (addValue === '') {
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
    };
    dispatch({
      type: 'todo/insert',
      params: this.params,
      data,
    }).then(() => {
      this.setState({
        addVisible: false,
        addValue: '',
      });
    });
  }

  // 内容变化
  titleChange = (e) => {
    this.setState({
      addValue: e,
    });
  };

  // 修复android status bar
  fixStatusBar = () => {
    if (Platform.OS === 'android') {
      StatusBar.setTranslucent(true);
      StatusBar.setBackgroundColor('transparent');
    }
  };

  // 隐藏已完成的
  showHideDone = () => {
    const { doneVisible } = this.state;
    CookieManager.set('http://todo.16to.com', {
      name: 'doneVisible',
      value: doneVisible ? 'false' : 'true',
    });
    this.setState({
      doneVisible: !doneVisible,
    });
  };

  // 退出登录
  logout = () => {
    const { navigation } = this.props;
    CookieManager.clearAll().then(() => {
      navigation.navigate('Login');
    });
  };

  render() {
    const { todoList, ssoUser, navigation } = this.props;
    const { refreshingLoading, doneVisible } = this.state;
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
          <StatusBar
            animated={true}
            translucent={false}
            barStyle={'dark-content'}
            backgroundColor="#fff"
            showHideTransition={'fade'}
          />
        </View>
        <View style={styles.headerBox}>
          {/* <Button onPress={() => }>退出</Button> */}
          <Text style={styles.headerTitle} onPress={() => this.logout()}>
            {ssoUser && ssoUser.name}
          </Text>
          <Text style={styles.headerTitle}>{moment().format('M月D日 dddd')}</Text>
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
          <View style={styles.listTitle}>
            <WingBlank>
              <WhiteSpace />
              <WhiteSpace />
              <View style={styles.titleBox}>
                <Text style={styles.doingTitle}>未完成</Text>
                <View style={styles.doingCount}>
                  <Text style={styles.countStr}>{doingData.length}</Text>
                </View>
              </View>
              <WhiteSpace />
              <WhiteSpace />
            </WingBlank>
          </View>
          <TodoItem todoList={doingData} uid={this.params.uid} navigation={navigation} />
          <View style={styles.listTitle}>
            <WingBlank>
              <WhiteSpace />
              <WhiteSpace />
              <View style={styles.titleBox}>
                <Text style={styles.doneTitle} onPress={() => this.showHideDone()}>
                  已完成
                  <View style={styles.eyeBox}>
                    <Icon name={doneVisible ? 'eye' : 'eye-invisible'} style={styles.eysBtn} />
                  </View>
                </Text>
                <View style={styles.doneCount}>
                  <Text style={styles.countStr}>{doneData.length}</Text>
                </View>
              </View>
              <WhiteSpace />
              <WhiteSpace />
            </WingBlank>
          </View>
          {doneVisible ? (
            <TodoItem todoList={doneData} uid={this.params.uid} type="done" navigation={navigation} />
          ) : null}
        </ScrollView>
        <View style={styles.addBtn}>
          <Button
            type="primary"
            style={styles.button}
            onPress={() => navigation.navigate('Detail', { type: 'add', title: '新建代办' })}
          >
            <Icon name="plus" size={32} color="white" />
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
    height: Platform.OS === 'ios' ? 34 : 0,
  },
  scroll: {
    flex: 1,
    backgroundColor: '#f5f5f9',
  },
  headerBox: {
    height: 45,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingLeft: 16,
    paddingRight: 16,
  },
  headerTitle: {
    lineHeight: 45,
    fontSize: 18,
    marginRight: 20,
  },
  addBtn: {
    position: 'absolute',
    right: 16,
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
  },
  listTitle: {
    lineHeight: 32,
  },
  titleBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  doingTitle: {
    fontSize: 18,
    lineHeight: 24,
  },
  doneTitle: {
    fontSize: 18,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    // lineHeight:,
  },
  doingCount: {
    height: 24,
    minWidth: 24,
    borderRadius: 12,
    backgroundColor: '#ff4d4f',
  },
  doneCount: {
    height: 24,
    minWidth: 24,
    borderRadius: 12,
    backgroundColor: '#999',
  },
  countStr: {
    color: '#fff',
    paddingLeft: 4,
    paddingRight: 4,
    textAlign: 'center',
    fontWeight: 'bold',
    lineHeight: 24,
  },
  eyeBox: {
    paddingLeft: 4,
    paddingTop: 6,
    height: 24,
  },
  eysBtn: {
    fontSize: 22,
    color: '#333',
  },
});

export default Todo;
