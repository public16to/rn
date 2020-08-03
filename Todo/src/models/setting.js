// 引入所有的请求接口
import CookieManager from '@react-native-community/cookies';
import { getTodoSetting, updateTodoSetting } from '../services/todo';

const TODO_URL = 'http://16to.com';

export default {
  // 空间名称
  namespace: 'setting',

  // 状态值
  state: {
    setting: {},
  },

  // action和数据异步处理
  effects: {
    // 查
    *select(_, { call, put }) {
      const cookies = yield call(CookieManager.get(TODO_URL));
      const response = yield call(getTodoSetting, cookies.uid);
      yield put({
        type: 'querySetting',
        payload: response,
      });
      return response;
    },
    // 改
    *update({ data }, { call }) {
      const uid = Cookies.get('uid');
      const response = yield call(updateTodoSetting, uid, data);
      return response;
    },
  },

  // 更新全局state
  reducers: {
    querySetting(state, action) {
      return {
        ...state,
        setting: action.payload,
      };
    },
  },
};
