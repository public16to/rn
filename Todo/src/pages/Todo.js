/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {Text, View} from 'react-native';
import {connect} from 'react-redux';
import {Toast, Provider, Portal, Button} from '@ant-design/react-native';

@connect(({todo, loading}) => ({
  list: todo.list,
  loading: loading.effects['todo/select'],
}))
class Todo extends Component {
  key = '';

  componentDidMount() {}

  // 获取数据
  getData() {
    const {dispatch} = this.props;
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

  // 展示弹框
  showToast() {
    // Toast.success('弹出展示成功');
    this.getData();
  }

  render() {
    const {list} = this.props;
    return (
      <Provider>
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
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
export default Todo;
