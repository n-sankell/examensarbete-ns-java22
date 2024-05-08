import { CreateUserRequest, UserCreateRequest } from "../../../generated/user-api";
import { ThunkDispatch, bindActionCreators } from "@reduxjs/toolkit";
import { closeCreateUserModal } from "../../actions/displayActions";
import { createUser } from "../../actions/userActions";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { RootState } from "../../store";
import "./CreateUserModal.css";

interface DispatchProps {
    createUser: (userCreateRequest: UserCreateRequest) => void;
    closeCreateUserModal: () => void;
}
interface StateProps {
    displayUserCreateError: boolean;
}
interface CreateUserModalProps extends StateProps, DispatchProps {}

const CreateUserModal: React.FC<CreateUserModalProps> = ( { createUser, closeCreateUserModal, displayUserCreateError } ) => {
    const [username, setUsername] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const closeClick = (): void => {
        closeCreateUserModal();
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
    
    useEffect((): void => {
    }, []);
    
    return (<>
        <div className='overhang' onClick={closeClick} />
        <div className='addUserModal'>
        <div className="add-user">
        <h3 className='h3-title'>Create account</h3>
        <form className="add-user-form"
            onSubmit={handleSubmit} >
            <input
                onChange={handleUsernameChange} 
                placeholder="username..." 
                className="input-text"
                value={username}
                maxLength={20}
                minLength={6}
                required={true} 
            />
            <input 
                onChange={handleEmailChange} 
                placeholder="email..." 
                className="input-text"
                type="email"
                value={email}
                maxLength={20}
                minLength={6}
                required={true} 
            />
            <input 
                onChange={handlePasswordChange} 
                placeholder="password..." 
                className="input-text"
                type="password"
                value={password}
                maxLength={40}
                minLength={10}
                required={true} 
            />
            <input className="submit-button" type="submit" value="Create account" />
        </form>
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