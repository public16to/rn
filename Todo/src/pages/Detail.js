import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { WingBlank, Button, InputItem, Toast, Provider } from '@ant-design/react-native';
import { connect } from 'react-redux';
import moment from 'moment';
import momentLocal from 'moment/locale/zh-cn';

moment.defineLocale('zh-cn', momentLocal);

@connect(({ loading }) => ({
  loading: loading.effects['todo/add'],
}))
class Detail extends Component {
  params = {
    uid: '06eb7955e21f832424c1833a1e9f9daf',
  };

  constructor(props) {
    super(props);
    this.state = {
      addValue: '',
    };
  }

  componentDidMount() {
    this.getDetail();
  }

  // 获取待办详细
  getDetail() {
    const { route } = this.props;
    if (route && route.params && route.params.item) {
      this.setState({
        addValue: route.params.item.title,
      });
    }
  }

  // 发送添加编辑
  sendAddEdit() {
    const { addValue } = this.state;
    const { navigation, route } = this.props;
    if (addValue === '') {
      Toast.offline('任务描述不能为空');
      return;
    }
    if (addValue.length > 200) {
      Toast.offline('任务描述过长，请不要超过200个字符');
      return;
    }
    const { dispatch } = this.props;
    const data = {
      title: addValue,
      uid: this.params.uid,
    };
    let type = 'todo/insert';
    let id;
    if (route && route.params && route.params.item) {
      type = 'todo/update';
      id = route.params.item.id;
    }
    dispatch({
      type: type,
      params: this.params,
      data,
      id,
    }).then(() => {
      this.setState({
        addValue: '',
      });
      navigation.navigate('Todo');
    });
  }

  // 内容变化
  titleChange = (e) => {
    this.setState({
      addValue: e,
    });
  };

  render() {
    const { addValue } = this.state;
    return (
      <Provider>
        <View>
          <View style={styles.inputBox}>
            <WingBlank>
              <InputItem clear placeholder="自动获取光标" autoFocus defaultValue={addValue} onChange={this.titleChange}>
                标题
              </InputItem>
            </WingBlank>
          </View>
          <WingBlank>
            <Button type="primary" onPress={() => this.sendAddEdit()}>
              完成
            </Button>
          </WingBlank>
        </View>
      </Provider>
    );
  }
}

//样式定义
const styles = StyleSheet.create({
  inputBox: {
    flex: 1,
    paddingVertical: 100,
  },
});

export default Detail;
