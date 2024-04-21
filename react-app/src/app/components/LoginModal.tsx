import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { LoginRequest, UserApi } from "../../generated/user-api";
import "./LoginModal.css";

type Props = {
    setUpdate: Dispatch<SetStateAction<boolean>>;
    setShowLoginModal: Dispatch<SetStateAction<boolean>>;
    setToken: Dispatch<SetStateAction<string>>;
    userApi: UserApi;
}

const LoginModal = (props: Props) => {
    const [identifier, setIdentifier] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const closeClick = (): void => {
        props.setShowLoginModal(false);
    }
    const handleIdentifierChange = (identifierEvent: any) => {
        setIdentifier(identifierEvent.target.value);
    }
    const handlePasswordChange = (passwordEvent: any) => {
        setPassword(passwordEvent.target.value);
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
        event.preventDefault();
        try {
            const requestObject: LoginRequest = { 
                userLoginRequest: { 
                    userIdentifier: identifier, 
                    password: password
                 } };
            const response = await props.userApi.loginRaw(requestObject);
            const rawToken = response.raw.headers.get("Authorization");
            const token = rawToken == null ? "" : rawToken.replace("Bearer ", "");
            console.log(response);
            props.setToken(token);
            props.setUpdate(true);
            setIdentifier("");
            setPassword("");
            props.setShowLoginModal(false);
        } catch (error) {
            console.error('Error creating account ' + error);
        }
    }
    
    useEffect((): void => {
    }, []);
    
    return (<>
        <div className='overhang' onClick={closeClick} />
        <div className='loginModal'>
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
        </div>
    </>);
}

export default LoginModal;