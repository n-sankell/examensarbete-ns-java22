import { CreateUserRequest, UserCreateRequest } from "../../../generated/user-api";
import { ThunkDispatch, bindActionCreators } from "@reduxjs/toolkit";
import { closeCreateUserModal } from "../../actions/displayActions";
import { createUser, hideUserErrors, hideUserMessage } from "../../actions/userActions";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { RootState } from "../../store";
import "./CreateUserModal.css";
import "./Modal.css";

interface DispatchProps {
    createUser: (userCreateRequest: UserCreateRequest) => void;
    closeCreateUserModal: () => void;
    hideUserMessage: () => void;
    hideUserErrors: () => void;
}
interface StateProps {
    error: string | null;
    displayUserCreateError: boolean;
    loggedIn: boolean;
}
interface CreateUserModalProps extends StateProps, DispatchProps {}

const CreateUserModal: React.FC<CreateUserModalProps> = ( { createUser, closeCreateUserModal, displayUserCreateError, loggedIn, error, hideUserErrors, hideUserMessage } ) => {
    const [username, setUsername] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string >("");

    const closeClick = (): void => {
        closeCreateUserModal();
        resetValues();
    }
    const handleUsernameChange = (usernameEvent: any) => {
        hideUserErrors();
        hideUserMessage();
        setUsername(usernameEvent.target.value);
    }
    const handleEmailChange = (emailEvent: any) => {
        hideUserErrors();
        hideUserMessage();
        setEmail(emailEvent.target.value);
    }
    const handlePasswordChange = (passwordEvent: any) => {
        hideUserErrors();
        hideUserMessage();
        setPassword(passwordEvent.target.value);
    }
    const resetValues = () => {
        hideUserErrors();
        hideUserMessage();
        setUsername("");
        setEmail("");
        setPassword("");
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
        event.preventDefault();
        const requestObject: CreateUserRequest = { 
            userCreateRequest: { 
                username: username, 
                email: email, 
                password: password
            }
        };
        createUser(requestObject.userCreateRequest); 
    }

    const isDisabled = (): boolean => {
        return username === "" || email === "" || password === "";
    }
    
    useEffect((): void => {
    }, []);

    useEffect((): void => {
        if (loggedIn) {
            closeCreateUserModal();
            hideUserErrors();
            hideUserMessage();
        }
    }, [loggedIn]);
    
    return (<>
        <div className='overhang' onClick={ closeClick } />
        <div className='modal'>
        <div className='content-wrapper'>
        <div className="add-user">
        <div className='title-container'><span className='title'>Create an account</span></div>
        <form className="add-user-form"
            onSubmit={ handleSubmit } >
            <input
                onChange={ handleUsernameChange } 
                placeholder="username..." 
                className="input-create-text"
                value={ username }
                maxLength={ 20 }
                minLength={ 6 }
                required={ true } 
            />
            <input 
                onChange={ handleEmailChange } 
                placeholder="email..." 
                className="input-create-text"
                type="email"
                value={ email }
                maxLength={ 20 }
                minLength={ 6 }
                required={ true } 
            />
            <input 
                onChange={ handlePasswordChange } 
                placeholder="password..." 
                className="input-create-text"
                type="password"
                value={ password }
                maxLength={ 40 }
                minLength={ 10 }
                required={ true } 
            />
            <input className="submit-new-user-button" type="submit" value="Create account" disabled={ isDisabled() }/>
            { displayUserCreateError === true ? <span className="failure-message create-user-failure">{ error }</span> : "" } 
        </form>
        </div>
        </div>
        </div>
    </>);
}

const mapStateToProps = (state: RootState): StateProps => ({
    displayUserCreateError: state.user.displayCreateUserError,
    loggedIn: state.user.loggedIn,
    error: state.user.error,
});
  
const mapDispatchToProps = (dispatch: ThunkDispatch<RootState, null, any>): DispatchProps => ({
    createUser: bindActionCreators(createUser, dispatch),
    closeCreateUserModal: bindActionCreators(closeCreateUserModal, dispatch),
    hideUserErrors: bindActionCreators(hideUserErrors, dispatch),
    hideUserMessage: bindActionCreators(hideUserMessage, dispatch),
});
  
export default connect(mapStateToProps, mapDispatchToProps)(CreateUserModal);