import React, { Component } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { WhiteSpace, WingBlank, Button } from '@ant-design/react-native';
import moment from 'moment';
import momentLocal from 'moment/locale/zh-cn';

moment.defineLocale('zh-cn', momentLocal);

class TodoItem extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { todoList, changeItem, type, navigation } = this.props;
    console.log(todoList, navigation);
    return (
      <View>
        {todoList &&
          todoList.map((item) => (
            <WingBlank key={item.id}>
              <View>
                <View style={styles.box}>
                  <Text
                    style={styles.title}
                    onPress={() => navigation.navigate('Detail', { type: 'update', id: item.id, title: '修改代办' })}
                  >
                    {item.title}
                  </Text>
                  <View style={styles.btnBox}>
                    <Text style={styles.addtime}>
                      {type === 'done'
                        ? moment(item.updatetime).format('YYYY-MM-DD HH:mm:ss')
                        : moment(item.addtime).fromNow()}
                    </Text>
                    <Button type="ghost" style={styles.btn} onPress={() => changeItem(item.id, item.status)}>
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
