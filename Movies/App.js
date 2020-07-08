import React from 'react';
import { Text, View } from 'react-native';
import { Icon, TabBar } from '@ant-design/react-native';
import { Provider } from 'react-redux';
import { create } from 'dva-core';
import Todo from './src/pages/Todo';
import todo from './src/models/todo';

const app = create(); // 创建dva实例，可传递配置参数。https://dvajs.com/api/#app-dva-opts

const models = [todo];
models.forEach((o) => { // 装载models对象
  app.model(o);
});

app.start(); // 实例初始化

const store = app._store; // 获取redux的store对象供react-redux使用


export default class BasicTabBarExample extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: 'tab1',
    };
  }
  renderContent(pageText) {
    return (
      <View style={{ flex: 1, alignItems: 'center', backgroundColor: 'white' }}>
        <Text>{pageText}</Text>
      </View>
    );
  }
  onChangeTab(tabName) {
    this.setState({
      selectedTab: tabName,
    });
  }
  render() {
    return (
      <Provider store={store}>
      <TabBar
        unselectedTintColor="#949494"
        tintColor="#33A3F4"
        barTintColor="#f5f5f5"
        styles={{"tabs":{borderColor:"#f5f5f5",height:100}}}
      >
        <TabBar.Item
          title="代办"
          icon={<Icon name="home" />}
          selected={this.state.selectedTab === 'tab1'}
          onPress={() => this.onChangeTab('tab1')}
        >
          <Todo />
        </TabBar.Item>
        <TabBar.Item
          icon={<Icon name="ordered-list" />}
          title="口碑"
          badge={2}
          selected={this.state.selectedTab === 'tab2'}
          onPress={() => this.onChangeTab('tab2')}
        >
          {this.renderContent('Koubei Tab')}
        </TabBar.Item>
        <TabBar.Item
          icon={<Icon name="like" />}
          title="朋友"
          selected={this.state.selectedTab === 'tab3'}
          onPress={() => this.onChangeTab('tab3')}
        >
          {this.renderContent('Friend Tab')}
        </TabBar.Item>
        <TabBar.Item
          icon={<Icon name="user" />}
          title="我"
          selected={this.state.selectedTab === 'tab4'}
          onPress={() => this.onChangeTab('tab4')}
        >
          {this.renderContent('My Tab')}
        </TabBar.Item>
      </TabBar>
      </Provider>
    );
  }
}