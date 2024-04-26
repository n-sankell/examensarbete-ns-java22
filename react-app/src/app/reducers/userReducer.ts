import { UserAction, UserState, LOGOUT_USER, LOGIN_USER_FAILURE, LOGIN_USER_REQUEST, LOGIN_USER_SUCCESS, CREATE_USER_REQUEST, CREATE_USER_SUCCESS, CREATE_USER_FAILURE } from '../actions/userActionTypes';

const initialState: UserState = {
  user: null,
  token: "",
  loggedIn: false,
  loading: false,
  error: null,
  userMidis: null,
  displayLoginError: false,
  displayUserCreateError: false,
};

const userReducer = (state = initialState, action: UserAction): UserState => {
  switch (action.type) {
    case LOGIN_USER_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
        displayLoginError: false,
      };
    case LOGIN_USER_SUCCESS:
    case CREATE_USER_SUCCESS:
      const { user, token } = action.payload;
      return {
        ...state,
        user: user,
        token: token,
        loggedIn: true,
        loading: false,
        error: null,
        displayLoginError: false,
        displayUserCreateError: false,
      };
    case LOGIN_USER_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
        displayLoginError: true,
      };
    case CREATE_USER_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
        displayUserCreateError: false,
      };
    case CREATE_USER_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
        displayLoginError: true,
      };
    case LOGOUT_USER:
      return {
        ...state,
        loggedIn: false,
        user: null,
        token: '',
        error: null,
        userMidis: null,
        displayLoginError: false,
        displayUserCreateError: false,
      };
    default:
      return state;
  }
};

export default userReducer;