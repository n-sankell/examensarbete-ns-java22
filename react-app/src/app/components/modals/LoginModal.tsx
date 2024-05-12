import { LoginRequest, UserLoginRequest } from "../../../generated/user-api";
import { ThunkDispatch, bindActionCreators } from "@reduxjs/toolkit";
import { closeLoginModal } from "../../actions/displayActions";
import { hideUserErrors, login } from "../../actions/userActions";
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
    hideUserErrors: () => void;
}
interface LoginModalProps extends StateProps, DispatchProps {}

const LoginModal: React.FC<LoginModalProps> = ({ login, closeLoginModal, displayError, loggedIn, hideUserErrors }) => {
    const [identifier, setIdentifier] = useState<string | undefined>(undefined);
    const [password, setPassword] = useState<string | undefined>(undefined);

    const closeClick = (): void => {
        closeLoginModal();
        hideUserErrors();
    }
    const handleIdentifierChange = (identifierEvent: any) => {
        hideUserErrors();
        setIdentifier(identifierEvent.target.value);
    }
    const handlePasswordChange = (passwordEvent: any) => {
        hideUserErrors();
        setPassword(passwordEvent.target.value);
    }
    const resetInpiut = () => {
        setPassword(undefined);
        setIdentifier(undefined);
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
        event.preventDefault();
        const requestObject: LoginRequest = { 
            userLoginRequest: { 
                userIdentifier: identifier === undefined ? "" : identifier, 
                password: password === undefined ? "" : password
            }
        };
        login(requestObject.userLoginRequest);
    }

    const isDisabled = (): boolean => {
        return identifier === undefined || identifier === "" || password === undefined || password === "";
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
        <div className='title-container'><span className='title'>Log in</span></div>
        { displayError === true ? <div className="failed-login"><span>Login failed</span></div> : "" }
        <form className="login-form"
            onSubmit={ handleSubmit } >
            <input
                onChange={ handleIdentifierChange } 
                placeholder="username/email..." 
                className="input-login-text"
                value={ identifier }
                maxLength={ 20 }
                minLength={ 6 }
                required={ true } 
            />
            <input 
                onChange={ handlePasswordChange } 
                placeholder="password..." 
                className="input-login-text"
                type="password"
                value={ password }
                maxLength={ 40 }
                minLength={ 10 }
                required={ true } 
            />
            <input className="submit-login-button" type="submit" value="Login" disabled={ isDisabled() }/>
            
        </form>
        
        </div>
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
    hideUserErrors: bindActionCreators(hideUserErrors, dispatch),
  });

export default connect(mapStateToProps, mapDispatchToProps)(LoginModal);