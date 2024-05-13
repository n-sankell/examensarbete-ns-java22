import { ThunkAction } from 'redux-thunk';
import { RootState } from '../store';
import { Configuration, DeleteUserRequest, EditUserDetailsRequest, EditUserPasswordRequest, UserApi, UserCreateRequest, UserLoginRequest } from '../../generated/user-api';
import { UserAction, LOGIN_USER_REQUEST, LOGIN_USER_SUCCESS, LOGIN_USER_FAILURE, LOGOUT_USER, CREATE_USER_REQUEST, CREATE_USER_SUCCESS, CREATE_USER_FAILURE, EDIT_USER_REQUEST, EDIT_USER_SUCCESS, EDIT_USER_FAILURE, EDIT_PASSWORD_REQUEST, EDIT_PASSWORD_SUCCESS, EDIT_PASSWORD_FAILURE, DELETE_USER_REQUEST, DELETE_USER_SUCCESS, DELETE_USER_FAILURE, HIDE_USER_ERRORS } from './userActionTypes';

export const login = (request: UserLoginRequest): ThunkAction<void, RootState, null, UserAction> => async (dispatch) => {
    dispatch({ type: LOGIN_USER_REQUEST, payload: { request } });
    try {
        const userApi = new UserApi(); 
        const response = await userApi.loginRaw({userLoginRequest: request});
        const rawToken: string | null = response.raw.headers.get("Authorization");
        const token: string = rawToken == null ? "" : rawToken.replace("Bearer ", "");
        const user = await response.value();
        dispatch({ type: LOGIN_USER_SUCCESS, payload: { user, token } });
    } catch (error) {
        dispatch({ type: LOGIN_USER_FAILURE, payload: error as string });
    }
};

export const createUser = (request: UserCreateRequest): ThunkAction<void, RootState, null, UserAction> => async (dispatch) => {
    dispatch({ type: CREATE_USER_REQUEST, payload: { request } });
    try {
        const userApi = new UserApi(); 
        const response = await userApi.createUserRaw({userCreateRequest: request});
        const rawToken: string | null = response.raw.headers.get("Authorization");
        const token: string = rawToken == null ? "" : rawToken.replace("Bearer ", "");
        const user = await response.value();
        dispatch({ type: CREATE_USER_SUCCESS, payload: { user, token } });
    } catch (error) {
        dispatch({ type: CREATE_USER_FAILURE, payload: error as string });
    }
};

export const editUser = (request: EditUserDetailsRequest): ThunkAction<void, RootState, null, UserAction> => async (dispatch, getState) => {
    dispatch({ type: EDIT_USER_REQUEST, payload: { request } });
    try {
        const token: string = getState().user.token;
        const userApi = new UserApi(new Configuration({accessToken: token})); 
        const response = await userApi.editUserDetails(request);
        dispatch({ type: EDIT_USER_SUCCESS, payload: { user: response } });
    } catch (error) {
        dispatch({ type: EDIT_USER_FAILURE, payload: error as string });
    }
};

export const editPassword = (request: EditUserPasswordRequest): ThunkAction<void, RootState, null, UserAction> => async (dispatch, getState) => {
    dispatch({ type: EDIT_PASSWORD_REQUEST, payload: { request } });
    try {
        const token: string = getState().user.token;
        const userApi = new UserApi(new Configuration({accessToken: token})); 
        await userApi.editUserPassword(request);
        dispatch({ type: EDIT_PASSWORD_SUCCESS });
    } catch (error) {
        dispatch({ type: EDIT_PASSWORD_FAILURE, payload: error as string });
    }
};

export const deleteUser = (request: DeleteUserRequest): ThunkAction<void, RootState, null, UserAction> => async (dispatch, getState) => {
    dispatch({ type: DELETE_USER_REQUEST, payload: { request } });
    try {
        const token: string = getState().user.token;
        const userApi = new UserApi(new Configuration({accessToken: token})); 
        await userApi.deleteUser({ deleteUserRequest: request });
        dispatch({ type: DELETE_USER_SUCCESS });
    } catch (error) {
        dispatch({ type: DELETE_USER_FAILURE, payload: error as string });
    }
};

export const logout = (): ThunkAction<void, RootState, null, UserAction> => (dispatch) => {
    dispatch({ type: LOGOUT_USER });
}

export const hideUserErrors = (): ThunkAction<void, RootState, null, UserAction> => (dispatch) => {
    dispatch({ type: HIDE_USER_ERRORS });
}