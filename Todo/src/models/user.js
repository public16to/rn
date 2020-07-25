import CookieManager from '@react-native-community/cookies';
import { getSsoUser } from '../services/todo';

const TODO_URL = 'http://16to.com';

export default {
  namespace: 'user',

  state: {
    // 获取用户信息
    ssoUser: {},

  },

  effects: {
    // 获取SSO
    *fetchUser({}, { call, put }) {
      // const cookies = yield call(CookieManager.get(TODO_URL));
      // let { uid } = cookies;
      const uid = '06eb7955e21f832424c1833a1e9f9daf';
      if (uid === undefined || uid === "undefined" || uid === null || uid === 'uid') {
        // window.location.href = "/login";
        // return {};
      }
      const response = yield call(getSsoUser, uid);
      yield put({
        type: 'saveSsoUser',
        payload: response,
      });
      console.log(response);
      return response;
    },
  },

  reducers: {
    saveSsoUser(state, action) {
      return {
        ...state,
        ssoUser: action.payload
      }
    },
  },
};
