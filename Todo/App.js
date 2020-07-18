import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { Button, Toast, Provider } from '@ant-design/react-native';

export default class HelloWorldApp extends Component {

  // 展示弹框
  showToast() {
    Toast.success("弹出展示成功");
  }

  render() {
    return (
      <Provider>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Text>Hello, world!</Text>
          <Button type="primary" onPress={() => this.showToast()}>展示</Button>
        </View>
      </Provider>
    );
  }
}