import React, { Component } from 'react';
import { Text, View,Alert } from 'react-native';
import { connect } from 'react-redux';
import { Toast } from '@ant-design/react-native';

@connect(({ todo }) => ({
    list: todo.list,
  }))
class Todo extends Component {

  componentDidMount() {
    const {dispatch}=this.props;
    const params = {
      uid:"06eb7955e21f832424c1833a1e9f9daf"
    };
    dispatch({
      type:'todo/select',
      params
    }).then((res)=>{
      // console.log(res)
    })
  }

  render() {
    const {list} = this.props;
    console.log(list);
    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Text>{list && list[0] &&list[0].title}</Text>
        </View>
    );
  }
}
export default Todo