import { ThunkAction } from 'redux-thunk';
import { RootState } from '../store';
import { UserApi, UserCreateRequest, UserLoginRequest } from '../../generated/user-api';
import { UserAction, LOGIN_USER_REQUEST, LOGIN_USER_SUCCESS, LOGIN_USER_FAILURE, LOGOUT_USER, CREATE_USER_REQUEST, CREATE_USER_SUCCESS, CREATE_USER_FAILURE } from './userActionTypes';

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

export const logout = (): ThunkAction<void, RootState, null, UserAction> => (dispatch) => {
    dispatch({ type: LOGOUT_USER });
}