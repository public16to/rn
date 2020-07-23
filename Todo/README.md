## dva引入
1. 命令行执行
```bash
yarn add redux
yarn add react-redux
yarn add dva-core
yarn add dva-loading
yarn add @babel/plugin-proposal-decorators
yarn add @babel/plugin-proposal-class-properties
```

2. .babelrc文件新建
```js
{
  "plugins": [
    ["import", { "libraryName": "@ant-design/react-native" }], 
    ["@babel/plugin-transform-flow-strip-types"],
    ["@babel/plugin-proposal-decorators", { "legacy": true }],
    ["@babel/plugin-proposal-class-properties", { "loose" : true }]
  ],
  "presets": ["module:metro-react-native-babel-preset"]
}
```

3. App.js初始化
```js
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
```

## cookie引入
1. 命令行执行
```bash
yarn add @react-native-community/cookies
cd ios && pod install
```

2. 使用
```js
import CookieManager from '@react-native-community/cookies';

// set a cookie
CookieManager.set('http://example.com', {
  name: 'myCookie',
  value: 'myValue',
  domain: 'some domain',
  path: '/',
  version: '1',
  expires: '2015-05-30T12:30:00.00-05:00'
}).then((done) => {
  console.log('CookieManager.set =>', done);
});

// Get cookies for a url
CookieManager.get('http://example.com')
  .then((cookies) => {
    console.log('CookieManager.get =>', cookies);
  });

// clear cookies
CookieManager.clearAll()
  .then((success) => {
    console.log('CookieManager.clearAll =>', success);
  });
```