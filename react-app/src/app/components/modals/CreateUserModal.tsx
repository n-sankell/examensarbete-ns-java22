import { CreateUserRequest, UserCreateRequest } from "../../../generated/user-api";
import { ThunkDispatch, bindActionCreators } from "@reduxjs/toolkit";
import { closeCreateUserModal } from "../../actions/displayActions";
import { createUser } from "../../actions/userActions";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { RootState } from "../../store";
import "./CreateUserModal.css";
import "./Modal.css";

interface DispatchProps {
    createUser: (userCreateRequest: UserCreateRequest) => void;
    closeCreateUserModal: () => void;
}
interface StateProps {
    displayUserCreateError: boolean;
}
interface CreateUserModalProps extends StateProps, DispatchProps {}

const CreateUserModal: React.FC<CreateUserModalProps> = ( { createUser, closeCreateUserModal, displayUserCreateError } ) => {
    const [username, setUsername] = useState<string | undefined>(undefined);
    const [email, setEmail] = useState<string  | undefined>(undefined);
    const [password, setPassword] = useState<string | undefined>(undefined);

    const closeClick = (): void => {
        closeCreateUserModal();
        resetValues();
    }
    const handleUsernameChange = (usernameEvent: any) => {
        setUsername(usernameEvent.target.value);
    }
    const handleEmailChange = (emailEvent: any) => {
        setEmail(emailEvent.target.value);
    }
    const handlePasswordChange = (passwordEvent: any) => {
        setPassword(passwordEvent.target.value);
    }
    const resetValues = () => {
        setUsername(undefined);
        setEmail(undefined);
        setPassword(undefined);
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
        event.preventDefault();
        const requestObject: CreateUserRequest = { 
            userCreateRequest: { 
                username: username === undefined ? "" : username, 
                email: email === undefined ? "" : email, 
                password: password === undefined ? "" : password
            }
        };
        createUser(requestObject.userCreateRequest); 
    }

    const isDisabled = (): boolean => {
        return username === undefined || username === "" || email === undefined || email === "" || password === undefined || password === "";
    }
    
    useEffect((): void => {
    }, []);
    
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
        </form>
        </div>
        </div>
        </div>
    </>);
}

const mapStateToProps = (state: RootState): StateProps => ({
    displayUserCreateError: state.user.displayUserCreateError,
});
  
const mapDispatchToProps = (dispatch: ThunkDispatch<RootState, null, any>): DispatchProps => ({
    createUser: bindActionCreators(createUser, dispatch),
    closeCreateUserModal: bindActionCreators(closeCreateUserModal, dispatch),
});
  
export default connect(mapStateToProps, mapDispatchToProps)(CreateUserModal);