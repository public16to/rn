import React, { Component } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { WhiteSpace, WingBlank, Button } from '@ant-design/react-native';

class TodoItem extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { todoList, changeItem, type } = this.props;
    return (
      <View>
        {todoList &&
          todoList.map((item) => (
            <WingBlank key={item.id}>
              <View>
                <View style={styles.box}>
                  <Text style={styles.title}>{item.title}</Text>
                  <View style={styles.btnBox}>
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
  },
  btnBox: {
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  btn: {
    fontSize: 16,
    height: 32,
    paddingRight: 8,
    paddingLeft: 8,
    borderRadius: 16,
  },
});

export default TodoItem;
