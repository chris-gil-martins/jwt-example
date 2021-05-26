const ACTIONS = {
  SET_ACCESS_TOKEN: 'set-access-token',
  SET_USER: 'set-user',
};

export const setAccessToken = (token) => ({
  type: ACTIONS.SET_ACCESS_TOKEN,
  token,
});

export const setUser = (user) => ({
  type: ACTIONS.SET_USER,
  user,
});

export default function authReducer(state = { user: null, accessToken: null }, action) {
  switch (action.type) {
    case ACTIONS.SET_ACCESS_TOKEN:
      return { ...state, accessToken: action.token };
    case ACTIONS.SET_USER:
      return { ...state, user: action.user };
    default:
      return state;
  }
}
