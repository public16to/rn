import React, {Component} from 'react';
import {Provider} from 'react-redux';
import {create} from 'dva-core';
import createLoading from 'dva-loading';
import models from './src/models';
import Todo from './src/pages/Todo';

const app = create(); // 创建dva实例，可传递配置参数
app.use(createLoading()); // 增加loading属性
// 装载models对象
models.forEach((o) => {
  app.model(o);
});
app.start(); // 实例初始化
const store = app._store; // 获取redux的store对象供react-redux使用

export default class HelloWorldApp extends Component {
  render() {
    return (
      <Provider store={store}>
        <Todo />
      </Provider>
    );
  }
}
