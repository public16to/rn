import React, { Component } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { WhiteSpace, WingBlank, Button, Portal, Toast, Modal } from '@ant-design/react-native';
import moment from 'moment';
import momentLocal from 'moment/locale/zh-cn';

moment.defineLocale('zh-cn', momentLocal);

@connect(({ loading }) => ({
  loading: loading.effects['todo/add'],
}))
class TodoItem extends Component {
  params = {};
  constructor(props) {
    super(props);
    this.state = {};
    this.params.uid = this.props.uid;
  }

  // 改变状态
  changeItem = (id, status) => {
    const { dispatch, uid } = this.props;
    this.params.uid = uid;
    console.log('changeItem', id, status);
    const data = {
      status: status === 1 ? 0 : 1,
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

  //删除
  deleteItem = (id, title) => {
    Modal.alert('确认删除 ' + title, '', [
      {
        text: '取消',
        onPress: () => console.log('cancel'),
        style: 'cancel',
      },
      { text: '确认', onPress: () => this.sendDelete(id), style: 'destructive' },
    ]);
  };

  // 发送删除
  sendDelete = (id) => {
    const { dispatch, uid } = this.props;
    this.params.uid = uid;
    this.key = Toast.loading('删除中...');
    dispatch({
      type: 'todo/delete',
      params: this.params,
      id,
    }).then((res) => {
      Portal.remove(this.key); // 移除所有的toast
    });
  };

  render() {
    const { todoList, type, navigation } = this.props;
    return (
      <View>
        {todoList &&
          todoList.map((item) => (
            <WingBlank key={item.id}>
              <View>
                <View style={styles.box}>
                  <Text
                    style={styles.title}
                    onPress={() =>
                      navigation.navigate('Detail', {
                        type: 'update',
                        item: item,
                        title: '编辑代办',
                        transition: 'forHorizontal',
                      })
                    }
                    onLongPress={() => this.deleteItem(item.id, item.title)}
                  >
                    {item.title}
                  </Text>
                  <View style={styles.btnBox}>
                    <Text style={styles.addtime}>
                      {type === 'done'
                        ? moment(item.updatetime).format('YYYY-MM-DD HH:mm:ss')
                        : moment(item.addtime).fromNow()}
                    </Text>
                    <Button type="ghost" style={styles.btn} onPress={() => this.changeItem(item.id, item.status)}>
                      {type === 'done' ? '已完成' : '完成'}
                    </Button>
                  </View>
                </View>
                <WhiteSpace />
              </View>
            </WingBlank>
          ))}
      </View>
    );
  }
}

//样式定义
const styles = StyleSheet.create({
  box: {
    backgroundColor: '#fff',
    paddingTop: 16,
    paddingBottom: 16,
    paddingLeft: 16,
    paddingRight: 16,
    borderRadius: 8,
  },
  title: {
    fontSize: 16,
    lineHeight: 24,
    flexWrap: 'nowrap',
  },
  btnBox: {
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  btn: {
    fontSize: 14,
    height: 28,
    paddingRight: 8,
    paddingLeft: 8,
    borderRadius: 16,
  },
  addtime: {
    lineHeight: 28,
    marginRight: 8,
    fontSize: 14,
    color: '#666',
  },
});

export default TodoItem;
