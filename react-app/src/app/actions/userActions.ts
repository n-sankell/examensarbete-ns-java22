import { ThunkAction } from 'redux-thunk';
import { RootState } from '../store';
import { Configuration, DeleteUserRequest, EditUserDetailsRequest, EditUserPasswordRequest, ErrorResponse, ErrorResponseFromJSON, UserApi, UserCreateRequest, UserLoginRequest, ValidationError, ValidationException, ValidationExceptionFromJSON, instanceOfErrorResponse, instanceOfValidationException } from '../../generated/user-api';
import { UserAction, LOGIN_USER_REQUEST, LOGIN_USER_SUCCESS, LOGIN_USER_FAILURE, LOGOUT_USER, CREATE_USER_REQUEST, CREATE_USER_SUCCESS, CREATE_USER_FAILURE, EDIT_USER_REQUEST, EDIT_USER_SUCCESS, EDIT_USER_FAILURE, EDIT_PASSWORD_REQUEST, EDIT_PASSWORD_SUCCESS, EDIT_PASSWORD_FAILURE, DELETE_USER_REQUEST, DELETE_USER_SUCCESS, DELETE_USER_FAILURE, HIDE_USER_ERRORS, HIDE_USER_MESSAGE, FETCH_USER_REQUEST, FETCH_USER_SUCCESS, FETCH_USER_FAILURE } from './userActionTypes';
import { ResponseError } from '../../generated/user-api';

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
        const message: string = await packageUserError(error, LOGIN_USER_FAILURE);
        dispatch({ type: LOGIN_USER_FAILURE, payload: message });
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
        const message: string = await packageUserError(error, CREATE_USER_FAILURE);
        dispatch({ type: CREATE_USER_FAILURE, payload: message });
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
        const message: string = await packageUserError(error, EDIT_USER_FAILURE);
        dispatch({ type: EDIT_USER_FAILURE, payload: message });
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
        const message: string = await packageUserError(error, EDIT_PASSWORD_FAILURE);
        dispatch({ type: EDIT_PASSWORD_FAILURE, payload: message });
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
        const message: string = await packageUserError(error, DELETE_USER_FAILURE);
        dispatch({ type: DELETE_USER_FAILURE, payload: message });
    }
};

export const logout = (): ThunkAction<void, RootState, null, UserAction> => (dispatch) => {
    dispatch({ type: LOGOUT_USER });
}

export const hideUserErrors = (): ThunkAction<void, RootState, null, UserAction> => (dispatch) => {
    dispatch({ type: HIDE_USER_ERRORS });
}
export const hideUserMessage = (): ThunkAction<void, RootState, null, UserAction> => (dispatch) => {
    dispatch({ type: HIDE_USER_MESSAGE });
}
export const fetchUserDetails = (): ThunkAction<void, RootState, null, UserAction> => async (dispatch, getState) => {
    dispatch({ type: FETCH_USER_REQUEST });
    try {
        const token: string = getState().user.token;
        const userApi = new UserApi(new Configuration({accessToken: token})); 
        const response = await userApi.getUserDetails();
        dispatch({ type: FETCH_USER_SUCCESS, payload: response });
    } catch (error) {
        const message: string = await packageUserError(error, FETCH_USER_FAILURE);
        dispatch({ type: FETCH_USER_FAILURE, payload: message });
    }
}

const packageUserError = async (error: unknown, type: string): Promise<string> => {
    let message: string = "Unknown error";
    if (error instanceof ResponseError) {
      const json = await error.response.json();
      if (instanceOfValidationException(json)) {
        const ve: ValidationException = ValidationExceptionFromJSON(json);
        const firstError: ValidationError = ve.errors[0];
        message = firstError.error + " - " + firstError.field;
      } else if (instanceOfErrorResponse(json)) {
        const re: ErrorResponse = ErrorResponseFromJSON(json);
        if (type === LOGIN_USER_FAILURE && error.response.status === 403) {
            message = "Login failed";
        } else if (type === EDIT_PASSWORD_FAILURE || type === DELETE_USER_FAILURE  && error.response.status === 403) {
            message = "Password did not match";
        } else {
            message = re.errorMessage;
        }
      }
    }
    return message;
  }