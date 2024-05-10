import { UserAction, UserState, LOGOUT_USER, LOGIN_USER_FAILURE, LOGIN_USER_REQUEST, LOGIN_USER_SUCCESS, CREATE_USER_REQUEST, CREATE_USER_SUCCESS, CREATE_USER_FAILURE, EDIT_USER_REQUEST, EDIT_USER_FAILURE, EDIT_USER_SUCCESS, EDIT_PASSWORD_REQUEST, EDIT_PASSWORD_SUCCESS, EDIT_PASSWORD_FAILURE, DELETE_USER_REQUEST, DELETE_USER_SUCCESS, DELETE_USER_FAILURE, HIDE_USER_ERRORS } from '../actions/userActionTypes';

const initialState: UserState = {
  user: null,
  token: '',
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
    case EDIT_USER_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
        displayUserCreateError: false,
      };
    case EDIT_USER_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        loading: false,
        error: null,
        displayUserCreateError: false,
      };
    case EDIT_USER_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case EDIT_PASSWORD_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case EDIT_PASSWORD_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
      };
    case EDIT_PASSWORD_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case DELETE_USER_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case DELETE_USER_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case DELETE_USER_SUCCESS:
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
    case HIDE_USER_ERRORS:
      return {
        ...state,
        error: null,
        displayLoginError: false,
        displayUserCreateError: false,
      }
    default:
      return state;
  }
};

export default userReducer;