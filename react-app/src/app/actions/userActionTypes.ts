import { Midis } from '../../generated/midi-api';
import { User, UserCreateRequest, UserLoginRequest } from '../../generated/user-api';

export const LOGOUT_USER = 'LOGOUT_USER';
export const LOGIN_USER_REQUEST = 'LOGIN_USER_REQUEST';
export const LOGIN_USER_SUCCESS = 'LOGIN_USER_SUCCESS';
export const LOGIN_USER_FAILURE = 'LOGIN_USER_FAILURE';
export const CREATE_USER_REQUEST = 'CREATE_USER_REQUEST';
export const CREATE_USER_SUCCESS = 'CREATE_USER_SUCCESS';
export const CREATE_USER_FAILURE = 'CREATE_USER_FAILURE';

interface LoginUserRequestAction {
  type: typeof LOGIN_USER_REQUEST;
  payload: {
    request: UserLoginRequest;
  }
}

interface LoginUserSuccessAction {
  type: typeof LOGIN_USER_SUCCESS;
  payload: {
    user: User;
    token: string;
  };
}

interface LoginUserFailureAction {
  type: typeof LOGIN_USER_FAILURE;
  payload: string;
}

interface CreateUserRequestAction {
  type: typeof CREATE_USER_REQUEST;
  payload: {
    request: UserCreateRequest;
  }
}

interface CreateUserSuccessAction {
  type: typeof CREATE_USER_SUCCESS;
  payload: {
    user: User;
    token: string;
  };
}

interface CreateUserFailureAction {
  type: typeof CREATE_USER_FAILURE;
  payload: string;
}

interface LogoutUserAction {
  type: typeof LOGOUT_USER;
}

export type UserAction = 
  | LogoutUserAction
  | LoginUserRequestAction
  | LoginUserSuccessAction
  | LoginUserFailureAction
  | CreateUserRequestAction
  | CreateUserSuccessAction
  | CreateUserFailureAction;

export interface UserState {
  loggedIn: boolean;
  loading: boolean;
  user: User | null;
  token: string;
  error: string | null;
  userMidis: Midis | null;
  displayLoginError: boolean;
  displayUserCreateError: boolean;
}