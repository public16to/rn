import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import { Provider } from 'react-redux';
import { create } from 'dva-core';
import createLoading from 'dva-loading';
import models from './src/models';
import Todo from './src/pages/Todo';
import Detail from './src/pages/Detail';

const app = create(); // 创建dva实例，可传递配置参数
app.use(createLoading()); // 增加loading属性
// 装载models对象
models.forEach((o) => {
  app.model(o);
});
app.start(); // 实例初始化
const store = app._store; // 获取redux的store对象供react-redux使用

const Stack = createStackNavigator();
export default class TodoApp extends Component {
  render() {
    return (
      <Provider store={store}>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Todo"
            screenOptions={{
              // 添加这一行会实现安卓下页面的左右切换，默认是从下到上
              cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
            }}
          >
            <Stack.Screen name="Todo" options={{ title: '返回', headerShown: false }} component={Todo} />
            <Stack.Screen
              name="Detail"
              options={({ route }) => ({ title: route.params.title, gestureDirection: 'horizontal' })}
              component={Detail}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    );
  }
}
