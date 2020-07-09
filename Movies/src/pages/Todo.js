import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { connect } from 'react-redux';
import { Toast,Provider,Portal } from '@ant-design/react-native';

@connect(({ todo,loading }) => ({
    list: todo.list,
    loading:loading.effects['todo/select'],
  }))
class Todo extends Component {

  key=""

  componentDidMount() {
    
    const {dispatch}=this.props;
    const params = {
      uid:"06eb7955e21f832424c1833a1e9f9daf"
    };
    this.key = Toast.loading("Loading...");
    dispatch({
      type:'todo/select',
      params
    }).then((res)=>{
    })
  }

  render() {
    const {list,loading} = this.props;
    if(loading===false){
      Portal.remove(this.key);
    }
    return (
      <Provider>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Text>{list && list[0] &&list[0].title}</Text>
        </View>
      </Provider>
    );
  }
}
export default Todo