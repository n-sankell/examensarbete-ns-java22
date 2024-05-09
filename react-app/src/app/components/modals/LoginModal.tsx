import { LoginRequest, UserLoginRequest } from "../../../generated/user-api";
import { ThunkDispatch, bindActionCreators } from "@reduxjs/toolkit";
import { closeLoginModal } from "../../actions/displayActions";
import { login } from "../../actions/userActions";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { RootState } from "../../store";
import "./LoginModal.css";
import "./Modal.css";

interface StateProps {
    displayError: boolean;
    loggedIn: boolean;
}
interface DispatchProps {
    login: (loginRequest: UserLoginRequest) => void;
    closeLoginModal: () => void;
}
interface LoginModalProps extends StateProps, DispatchProps {}

const LoginModal: React.FC<LoginModalProps> = ({ login, closeLoginModal, displayError, loggedIn }) => {
    const [identifier, setIdentifier] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const closeClick = (): void => {
        closeLoginModal();
    }
    const handleIdentifierChange = (identifierEvent: any) => {
        setIdentifier(identifierEvent.target.value);
    }
    const handlePasswordChange = (passwordEvent: any) => {
        setPassword(passwordEvent.target.value);
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
        event.preventDefault();
        const requestObject: LoginRequest = { 
            userLoginRequest: { 
                userIdentifier: identifier, 
                password: password
            } 
        };
        login(requestObject.userLoginRequest);
    }

    useEffect((): void => {
    }, []);
    
    useEffect((): void => {
        if (loggedIn) {
            closeLoginModal();
        }
    }, [loggedIn]);
    
    return (<>
        <div className='overhang' onClick={ closeClick } />
        <div className='modal'>
        <div className='content-wrapper'>
        <div className="login">
        <h3 className='h3-title'>Log in</h3>
        <form className="login-form"
            onSubmit={handleSubmit} >
            <input
                onChange={handleIdentifierChange} 
                placeholder="username/email..." 
                className="input-text"
                value={identifier}
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
            <input className="submit-button" type="submit" value="Login" />
        </form>
        </div>
        { displayError === true ? <span>Login failed</span> : "" }
        </div>
        </div>
    </>);
}

const mapStateToProps = (state: RootState): StateProps => ({
    displayError: state.user.displayLoginError,
    loggedIn: state.user.loggedIn,
  });

  const mapDispatchToProps = (dispatch: ThunkDispatch<RootState, null, any>): DispatchProps => ({
    login: bindActionCreators(login, dispatch),
    closeLoginModal: bindActionCreators(closeLoginModal, dispatch),
  });

export default connect(mapStateToProps, mapDispatchToProps)(LoginModal);