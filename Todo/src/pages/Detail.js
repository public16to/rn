import React, { Component } from 'react';
import { Text, View, StyleSheet } from 'react-native';
// import { WhiteSpace, WingBlank, Button } from '@ant-design/react-native';
import moment from 'moment';
import momentLocal from 'moment/locale/zh-cn';

moment.defineLocale('zh-cn', momentLocal);

class Detail extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { route } = this.props;
    console.log(route);
    return (
      <View>
        <Text style={styles.input}>123</Text>
      </View>
    );
  }
}

//样式定义
const styles = StyleSheet.create({
  input: {
    fontSize: 24,
  },
});

export default Detail;
