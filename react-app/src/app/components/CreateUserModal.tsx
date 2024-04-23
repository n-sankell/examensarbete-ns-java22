import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { CreateUserRequest, UserApi } from "../../generated/user-api";
import "./CreateUserModal.css";

type Props = {
    setUpdate: Dispatch<SetStateAction<boolean>>;
    setShowCreateUserModal: Dispatch<SetStateAction<boolean>>;
    setToken: Dispatch<SetStateAction<string>>;
    setLoggedIn: Dispatch<SetStateAction<boolean>>;
    userApi: UserApi;
}

const CreateUserModal = (props: Props) => {
    const [username, setUsername] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const closeClick = (): void => {
        props.setShowCreateUserModal(false);
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
        try {
            const requestObject: CreateUserRequest = { 
                userCreateRequest: { 
                    username: username, 
                    email: email, 
                    password: password
                 } };
            const response = await props.userApi.createUserRaw(requestObject);
            if (response.raw.status === 200) {
                const rawToken = response.raw.headers.get("Authorization");
                const token = rawToken == null ? "" : rawToken.replace("Bearer ", "");
                console.log(response);
                props.setToken(token);
                props.setUpdate(true);
                setUsername("");
                setEmail("");
                setPassword("");
                props.setLoggedIn(true);
                props.setShowCreateUserModal(false);
            }
        } catch (error) {
            console.error('Error creating account ' + error);
        }
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

export default CreateUserModal;