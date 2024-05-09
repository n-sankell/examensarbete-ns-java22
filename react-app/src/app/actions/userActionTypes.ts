import { Midis } from '../../generated/midi-api';
import { DeleteUserRequest, EditUserDetailsRequest, EditUserPasswordRequest, User, UserCreateRequest, UserLoginRequest } from '../../generated/user-api';

export const LOGOUT_USER = 'LOGOUT_USER';
export const LOGIN_USER_REQUEST = 'LOGIN_USER_REQUEST';
export const LOGIN_USER_SUCCESS = 'LOGIN_USER_SUCCESS';
export const LOGIN_USER_FAILURE = 'LOGIN_USER_FAILURE';
export const CREATE_USER_REQUEST = 'CREATE_USER_REQUEST';
export const CREATE_USER_SUCCESS = 'CREATE_USER_SUCCESS';
export const CREATE_USER_FAILURE = 'CREATE_USER_FAILURE';
export const EDIT_USER_REQUEST = 'EDIT_USER_REQUEST';
export const EDIT_USER_SUCCESS = 'EDIT_USER_SUCCESS';
export const EDIT_USER_FAILURE = 'EDIT_USER_FAILURE';
export const EDIT_PASSWORD_REQUEST = 'EDIT_PASSWORD_REQUEST';
export const EDIT_PASSWORD_SUCCESS = 'EDIT_PASSWORD_SUCCESS';
export const EDIT_PASSWORD_FAILURE = 'EDIT_PASSWORD_FAILURE';
export const DELETE_USER_REQUEST = 'DELETE_USER_REQUEST';
export const DELETE_USER_SUCCESS = 'DELETE_USER_SUCCESS';
export const DELETE_USER_FAILURE = 'DELETE_USER_FAILURE';

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

interface EditUserRequestAction {
  type: typeof EDIT_USER_REQUEST;
  payload: {
    request: EditUserDetailsRequest;
  }
}
interface EditUserSuccessAction {
  type: typeof EDIT_USER_SUCCESS;
  payload: {
    user: User;
  };
}
interface EditUserFailureAction {
  type: typeof EDIT_USER_FAILURE;
  payload: string;
}

interface EditPasswordRequestAction {
  type: typeof EDIT_PASSWORD_REQUEST;
  payload: {
    request: EditUserPasswordRequest;
  }
}
interface EditPasswordSuccessAction {
  type: typeof EDIT_PASSWORD_SUCCESS;
}
interface EditPasswordFailureAction {
  type: typeof EDIT_PASSWORD_FAILURE;
  payload: string;
}

interface DeleteUserRequestAction {
  type: typeof DELETE_USER_REQUEST;
  payload: {
    request: DeleteUserRequest;
  }
}
interface DeleteUserSuccessAction {
  type: typeof DELETE_USER_SUCCESS;
}
interface DeleteUserFailureAction {
  type: typeof DELETE_USER_FAILURE;
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
  | CreateUserFailureAction
  | EditUserRequestAction
  | EditUserSuccessAction
  | EditUserFailureAction
  | EditPasswordRequestAction
  | EditPasswordSuccessAction
  | EditPasswordFailureAction
  | DeleteUserRequestAction
  | DeleteUserSuccessAction
  | DeleteUserFailureAction;

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