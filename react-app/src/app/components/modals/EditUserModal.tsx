import { EditUserDetailsRequest, EditUserPasswordRequest, User } from "../../../generated/user-api";
import { ThunkDispatch, bindActionCreators } from "@reduxjs/toolkit";
import { closeEditUserModal } from "../../actions/displayActions";
import { editPassword, editUser } from "../../actions/userActions";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { RootState } from "../../store";
import "./EditUserModal.css";
import "./Modal.css";

interface DispatchProps {
    editUser: (editUserRequest: EditUserDetailsRequest) => void;
    editPassword: (editPasswordRequest: EditUserPasswordRequest) => void;
    closeEditUserModal: () => void;
}
interface StateProps {
    displayUserCreateError: boolean;
    user: User | null;
}
interface EditUserModalProps extends StateProps, DispatchProps {}

const EditUserModal: React.FC<EditUserModalProps> = ( { editUser, editPassword, closeEditUserModal, user, displayUserCreateError } ) => {
    if (user !== null) {
    const [username, setUsername] = useState<string>(user.username);
    const [email, setEmail] = useState<string>(user.email);
    const [oldPassword, setOldPassword] = useState<string>("");
    const [newPassword, setNewPassword] = useState<string>("");

    const closeClick = (): void => {
        closeEditUserModal();
    }
    const handleUsernameChange = (usernameEvent: any) => {
        setUsername(usernameEvent.target.value);
    }
    const handleEmailChange = (emailEvent: any) => {
        setEmail(emailEvent.target.value);
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

    const containsUserInfoChange = (): boolean => {
        const isEqual = username === user.username
            && email === user.email;
        return !isEqual;
    }
    
    useEffect((): void => {
    }, []);
    
    return (<>
        <div className='overhang' onClick={ closeClick } />
        <div className='modal'>
        <div className='content-wrapper'>
        <div className="edit-user">
        <h3 className='title'>Edit profile</h3>
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
        </div>
        </div>
    </>);
    } else {
        console.error("User was not loaded properly");
        return (<><div><span>No file found</span></div></>);
    }
}

const mapStateToProps = (state: RootState): StateProps => ({
    displayUserCreateError: state.user.displayUserCreateError,
    user: state.user.user,
});
  
const mapDispatchToProps = (dispatch: ThunkDispatch<RootState, null, any>): DispatchProps => ({
    editUser: bindActionCreators(editUser, dispatch),
    editPassword: bindActionCreators(editPassword, dispatch),
    closeEditUserModal: bindActionCreators(closeEditUserModal, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(EditUserModal);