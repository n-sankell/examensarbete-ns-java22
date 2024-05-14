import { DeleteUserRequest, EditUserDetailsRequest, EditUserPasswordRequest, User } from "../../../generated/user-api";
import { ThunkDispatch, bindActionCreators } from "@reduxjs/toolkit";
import { closeEditUserModal } from "../../actions/displayActions";
import { deleteUser, editPassword, editUser, hideUserErrors, hideUserMessage } from "../../actions/userActions";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { RootState } from "../../store";
import downArrowSvg from "../../../assets/down-arrow-svgrepo-com.svg";
import "./EditUserModal.css";
import "./Modal.css";
import { Midis } from "../../../generated/midi-api";

interface DispatchProps {
    editUser: (editUserRequest: EditUserDetailsRequest) => void;
    editPassword: (editPasswordRequest: EditUserPasswordRequest) => void;
    deleteUser: (deleteUserRequest: DeleteUserRequest) => void;
    hideUserMessage: () => void;
    hideUserErrors: () => void;
    closeEditUserModal: () => void;
}
interface StateProps {
    error: string | null;
    user: User | null;
    userMidis: Midis | null;
    displayUpdateUserSuccess: boolean;
    displayUpdateUserError: boolean;
    displayUpdatePasswordSuccess: boolean;
    displayUpdatePasswordError: boolean;
    displayDeleteUserError: boolean;
}
interface EditUserModalProps extends StateProps, DispatchProps {}

const EditUserModal: React.FC<EditUserModalProps> = ( { displayDeleteUserError, displayUpdatePasswordSuccess, editUser, editPassword, closeEditUserModal, user, deleteUser, userMidis, hideUserMessage, displayUpdateUserSuccess, displayUpdateUserError, hideUserErrors, error, displayUpdatePasswordError } ) => {
    if (user !== null) {
    const [username, setUsername] = useState<string>(user.username);
    const [email, setEmail] = useState<string>(user.email);
    const [password, setPassword] = useState<string>("");
    const [oldPassword, setOldPassword] = useState<string>("");
    const [newPassword, setNewPassword] = useState<string>("");
    const [showUserEdit, setShowUserEdit] = useState<boolean>(false);
    const [showPasswordEdit, setShowPasswordEdit] = useState<boolean>(false);
    const [showDeleteUser, setShowDeleteUser] = useState<boolean>(false);
    const [promptDelete, setPromptDelete] = useState<boolean>(false);

    const closeClick = (): void => {
        closeEditUserModal();
    }
    const handleUsernameChange = (event: any) => {
        setUsername(event.target.value);
    }
    const handleEmailChange = (event: any) => {
        setEmail(event.target.value);
    }
    const handleNewPasswordChange = (event: any) => {
        hideUserMessage();
        hideUserErrors();
        setNewPassword(event.target.value);
    }
    const handleOldPasswordChange = (event: any) => {
        hideUserMessage();
        hideUserErrors();
        setOldPassword(event.target.value);
    }
    const handlePasswordChange = (event: any) => {
        hideUserMessage();
        hideUserErrors();
        setPassword(event.target.value);
    }

    const handleDetailsSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
        event.preventDefault();
        if (containsUserInfoChange()) {
            const requestObject: EditUserDetailsRequest = {
                editUserRequest: {
                    username: username,
                    email: email
                }
            };
            editUser(requestObject); 
        } else {
            //TODO add som message here
        }
    }

    const handlePasswordSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
        event.preventDefault();
        const requestObject: EditUserPasswordRequest = { 
            editPasswordRequest: {
                currentPassword: oldPassword, 
                newPassword: newPassword
            }
        };
        editPassword(requestObject); 
    }

    const handleDeleteSubmit = async (event: React.MouseEvent<HTMLButtonElement>): Promise<void> => {
        event.preventDefault();
        setPromptDelete(false);
        const requestObject: DeleteUserRequest = { 
            password: password
        };
        deleteUser(requestObject);
    }

    const handleDelete = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
        event.preventDefault();
        const requestObject: DeleteUserRequest = { 
            password: password
        };
        deleteUser(requestObject);
    }

    const handleShowEditInput = (event: any): void => {
        event.preventDefault();
        if (showUserEdit === true) {
            setShowUserEdit(false);
        } else {
            setShowUserEdit(true);
        }
    }
    const handleShowEditPassword = (event: any): void => {
        event.preventDefault();
        if (showPasswordEdit === true) {
            setShowPasswordEdit(false);
            hideUserErrors();
            hideUserMessage();
            setNewPassword("");
            setOldPassword("");
        } else {
            setShowPasswordEdit(true);
        }
    }
    const handleShowDeleteUser = (event: any): void => {
        event.preventDefault();
        if (showDeleteUser === true) {
            setShowDeleteUser(false);
            hideUserErrors();
            hideUserMessage();
            setPassword("");
        } else {
            setShowDeleteUser(true);
        }
    }

    const containsUserInfoChange = (): boolean => {
        const isEqual = username === user.username
            && email === user.email;
        return !isEqual;
    }

    const passwordValid = (): boolean => {
        return newPassword.length > 9 && newPassword !== oldPassword;
    }
    
    useEffect((): void => {
    }, []);

    useEffect((): void => {
        if (displayUpdatePasswordSuccess === true) {
            setNewPassword("");
            setOldPassword("");
        }
        if (displayDeleteUserError) {
            setPassword("");
        }
    }, [displayUpdatePasswordSuccess, displayDeleteUserError]);
    
    return (<>
        <div className='overhang' onClick={ closeClick } />
        <div className='modal'>
        <div className='content-wrapper'>
        <div className="edit-user">
        <div className='title-container'><span className='title'>User info - Edit file</span></div>

        <div className="info-container">
            <div className="file-info">
                <div className="info-row">
                    <span className="left-span">Username: </span>
                    <span className="right-span">{ user.username }</span>
                </div>
                    
                <div className="info-row">
                    <span className="left-span">Email: </span>
                    <span className="right-span">{ user.email }</span>
                </div>
                <div className="info-row">
                    <span className="left-span">Created: </span>
                    <span className="right-span">{ user.dateCreated }</span>
                </div>
                <div className="info-row">
                    <span className="left-span">Last edited: </span>
                    <span className="right-span">{ user.dateEdited }</span>
                </div>
                <div className="info-row">
                    <span className="left-span">Number of files: </span>
                    <span className="right-span">{ userMidis !== null && userMidis.midis.length > 0 ? userMidis.midis.length : 0 }</span>
                </div>
            </div>                    
        </div>

        <div className="show-file-edit-fields" onClick={ (event)=> handleShowEditInput(event) }>
            <div className="divider">
                <div className="divider-left"><div className="divider-line"></div><div className="divider-bottom"></div></div>
                <div className="divider-middle">
                    <img className={`expand-arrow ${showUserEdit ? 'expand-arrow-expanded' : ''}`} src={ downArrowSvg }></img>
                    <span className="divider-text">Edit info</span>
                </div>
                <div className="divider-right"><div className="divider-line"></div><div className="divider-bottom"></div></div>
            </div>
        </div>

        <div className={`edit-user-container ${showUserEdit ? 'edit-user-container-expanded' : ''}`}>
        <form className="edit-user-form"
            onSubmit={ handleDetailsSubmit } >
            <input
                onChange={ handleUsernameChange } 
                placeholder="username..." 
                className="input-text"
                value={ username }
                maxLength={ 20 }
                minLength={ 6 }
                required={ true } 
            />
            <input 
                onChange={ handleEmailChange } 
                placeholder="email..." 
                className="input-text"
                type="email"
                value={ email }
                maxLength={ 20 }
                minLength={ 6 }
                required={ true } 
            />
            <input className="edit-user-submit" type="submit" value="Save" disabled={ !containsUserInfoChange() }/>
        </form>
        </div>

        <div className="show-file-edit-fields" onClick={ (event)=> handleShowEditPassword(event) }>
            <div className="divider">
                <div className="divider-left"><div className="divider-line"></div><div className="divider-bottom"></div></div>
                <div className="divider-middle">
                    <img className={`expand-arrow ${showPasswordEdit ? 'expand-arrow-expanded' : ''}`} src={ downArrowSvg }></img>
                    <span className="divider-text">Password</span>
                </div>
                <div className="divider-right"><div className="divider-line"></div><div className="divider-bottom"></div></div>
            </div>
        </div>

        <div className={`edit-user-container ${showPasswordEdit ? 'edit-user-container-expanded' : ''}`}>
        <form className="edit-user-form"
            onSubmit={ handlePasswordSubmit } >
            <input
                onChange={ handleOldPasswordChange } 
                placeholder="old password..." 
                className="input-text"
                type="password"
                value={ oldPassword }
                maxLength={ 40 }
                minLength={ 1 }
                required={ true } 
            />
            <input 
                onChange={ handleNewPasswordChange } 
                placeholder="new password..." 
                className="input-text"
                type="password"
                value={ newPassword }
                maxLength={ 40 }
                minLength={ 10 }
                required={ true } 
            />
            <input className="edit-user-submit" type="submit" value="Update" disabled={ !passwordValid() }/>
            { showPasswordEdit && newPassword === oldPassword && newPassword.length > 0 ? <span className="failure-message password-change-failure">New password cannot be the same as the old</span> : "" }
            { displayUpdatePasswordSuccess === true ? <span className="success-message password-change-success">Password updated!</span> : "" }
            { displayUpdateUserError === true ? <span className="failure-message password-change-failure">{error}</span> : "" }
            { displayUpdatePasswordError === true ? <span className="failure-message password-change-failure">{error}</span> : "" }
        </form>
        </div>

        <div className="show-file-edit-fields" onClick={ (event)=> handleShowDeleteUser(event) }>
            <div className="divider">
                <div className="divider-left"><div className="divider-line"></div><div className="divider-bottom"></div></div>
                <div className="divider-middle">
                    <img className={`expand-arrow ${showDeleteUser ? 'expand-arrow-expanded' : ''}`} src={ downArrowSvg }></img>
                    <span className="divider-text">Delete user</span>
                </div>
                <div className="divider-right"><div className="divider-line"></div><div className="divider-bottom"></div></div>
            </div>
        </div>

        <div className={`edit-user-container ${showDeleteUser ? 'edit-user-container-expanded' : ''}`}>
        <form className="edit-user-form"
            onSubmit={ (e) => { e.preventDefault(); setPromptDelete(true); } } >
            <input
                onChange={ handlePasswordChange } 
                placeholder="password..." 
                className="input-text"
                type="password"
                value={ password }
                maxLength={ 40 }
                minLength={ 1 }
                required={ true } 
            />
            <input className="edit-user-submit" type="submit" value="Delete" disabled={ password === "" }/>
            { displayDeleteUserError === true ? <span className="failure-message delete-user-failure">{ error }</span> : "" }
            { promptDelete === true ? 
                <div className='delete-prompt delete-user-prompt'>
                    <span>Delete this account?</span>
                    <div className='prompt-buttons'>
                        <button className='prompt-button' onClick={ (e) => handleDeleteSubmit(e) }>Yes</button>
                        <button className='prompt-button' onClick={ () => { setPromptDelete(false); setPassword(""); } }>No</button>
                    </div>
                </div> : "" } 
        </form>
        </div>

        </div>
        </div>
        </div>
    </>);
    } else {
        console.error("User was not loaded properly");
        return (<><div><span>No user found</span></div></>);
    }
}

const mapStateToProps = (state: RootState): StateProps => ({
    error: state.user.error,
    user: state.user.user,
    userMidis: state.midi.userMidis,
    displayUpdateUserSuccess: state.user.displayUpdateUserSuccess,
    displayUpdateUserError: state.user.displayUpdateUserError,
    displayUpdatePasswordError: state.user.displayUpdatePasswordError,
    displayUpdatePasswordSuccess: state.user.displayUpdatePasswordSuccess,
    displayDeleteUserError: state.user.displayDeleteUserError,
});

const mapDispatchToProps = (dispatch: ThunkDispatch<RootState, null, any>): DispatchProps => ({
    editUser: bindActionCreators(editUser, dispatch),
    editPassword: bindActionCreators(editPassword, dispatch),
    closeEditUserModal: bindActionCreators(closeEditUserModal, dispatch),
    deleteUser: bindActionCreators(deleteUser, dispatch),
    hideUserMessage: bindActionCreators(hideUserMessage, dispatch),
    hideUserErrors: bindActionCreators(hideUserErrors, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(EditUserModal);