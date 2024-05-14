import { UserAction, UserState, LOGOUT_USER, LOGIN_USER_FAILURE, LOGIN_USER_REQUEST, LOGIN_USER_SUCCESS, CREATE_USER_REQUEST, CREATE_USER_SUCCESS, CREATE_USER_FAILURE, EDIT_USER_REQUEST, EDIT_USER_FAILURE, EDIT_USER_SUCCESS, EDIT_PASSWORD_REQUEST, EDIT_PASSWORD_SUCCESS, EDIT_PASSWORD_FAILURE, DELETE_USER_REQUEST, DELETE_USER_SUCCESS, DELETE_USER_FAILURE, HIDE_USER_ERRORS, HIDE_USER_MESSAGE } from '../actions/userActionTypes';

const initialState: UserState = {
  user: null,
  token: '',
  loggedIn: false,
  loading: false,
  error: null,
  userMidis: null,
  displayLoginError: false,
  displayCreateUserError: false,
  displayCreateUserSuccess: false,
  displayUpdateUserError: false,
  displayUpdateUserSuccess: false,
  displayUpdatePasswordError: false,
  displayUpdatePasswordSuccess: false,
  displayDeleteUserError: false,
  displayDeleteUserSuccess: false,
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
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        loggedIn: true,
        loading: false,
        error: null,
        displayLoginError: false,
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
        displayCreateUserError: false,
        displayCreateUserSuccess: false,
      };
    case CREATE_USER_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
        displayCreateUserError: true,
        displayCreateUserSuccess: false,
      };
    case CREATE_USER_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        loggedIn: true,
        loading: false,
        error: null,
        displayCreateUserSuccess: true,
        displayCreateUserError: false,
      };
    case EDIT_USER_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
        displayUpdateUserError: false,
      };
    case EDIT_USER_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        loading: false,
        error: null,
        displayUpdateUserError: false,
        displayUpdateUserSuccess: true,
      };
    case EDIT_USER_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
        displayUpdateUserError: true,
        displayUpdateUserSuccess: false,
      };
    case EDIT_PASSWORD_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
        displayUpdatePasswordSuccess: false,
        displayUpdatePasswordError: false,
      };
    case EDIT_PASSWORD_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        displayUpdatePasswordSuccess: true,
        displayUpdatePasswordError: false,
      };
    case EDIT_PASSWORD_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
        displayUpdatePasswordError: true,
        displayUpdatePasswordSuccess: false,
      };
    case DELETE_USER_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
        displayDeleteUserSuccess: false,
        displayDeleteUserError: false,
      };
    case DELETE_USER_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
        displayDeleteUserError: true,
      };
    case DELETE_USER_SUCCESS:
      return {
        ...state,
        user: null,
        token: '',
        loggedIn: false,
        loading: false,
        error: null,
        userMidis: null,
        displayLoginError: false,
        displayCreateUserError: false,
        displayCreateUserSuccess: false,
        displayUpdateUserError: false,
        displayUpdateUserSuccess: false,
        displayUpdatePasswordError: false,
        displayUpdatePasswordSuccess: false,
        displayDeleteUserError: false,
        displayDeleteUserSuccess: true,
      };
    case LOGOUT_USER:
      return {
        ...state,
        user: null,
        token: '',
        loggedIn: false,
        loading: false,
        error: null,
        userMidis: null,
        displayLoginError: false,
        displayCreateUserError: false,
        displayCreateUserSuccess: false,
        displayUpdateUserError: false,
        displayUpdateUserSuccess: false,
        displayUpdatePasswordError: false,
        displayUpdatePasswordSuccess: false,
        displayDeleteUserError: false,
        displayDeleteUserSuccess: false,
      };
    case HIDE_USER_ERRORS:
      return {
        ...state,
        error: null,
        displayLoginError: false,
        displayCreateUserError: false,
        displayUpdateUserError: false,
        displayDeleteUserError: false,
        displayUpdatePasswordError: false,
      }
    case HIDE_USER_MESSAGE:
      return {
        ...state,
        displayLoginError: false,
        displayCreateUserSuccess: false,
        displayUpdateUserSuccess: false,
        displayDeleteUserSuccess: false,
        displayUpdatePasswordSuccess: false,
      }
    default:
      return state;
  }
};

export default userReducer;