import { getSsoUser } from '../services/todo';

export default {
  namespace: 'user',

  state: {
    // 获取用户信息
    ssoUser: {},
  },

  effects: {
    // 获取SSO
    *fetchUser({ params }, { call, put }) {
      console.log(params);
      const response = yield call(getSsoUser, params.uid);
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
        ssoUser: action.payload,
      };
    },
  },
};
