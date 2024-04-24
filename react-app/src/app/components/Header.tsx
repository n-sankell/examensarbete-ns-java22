import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { MidiApi, MidiWithData, Midis } from "../../generated/midi-api";
import { User, UserApi } from "../../generated/user-api";
import { ReactComponent as UserSvg } from '../../assets/user-alt-1-svgrepo-com.svg';
import "./Header.css";

interface HeaderProps {
    setShowAddModal: Dispatch<SetStateAction<boolean>>;
    setShowCreateUserModal: Dispatch<SetStateAction<boolean>>;
    setShowLoginModal: Dispatch<SetStateAction<boolean>>;
    setShowEditModal: Dispatch<SetStateAction<boolean>>;
    setUpdate: Dispatch<SetStateAction<boolean>>;
    setLoggedIn: Dispatch<SetStateAction<boolean>>;
    setToken: Dispatch<SetStateAction<string>>;
    setContent: Dispatch<SetStateAction<JSX.Element>>;
    setUserMidis: Dispatch<SetStateAction<Midis>>;
    setActiveMidi: Dispatch<SetStateAction<MidiWithData>>;
    loggedIn: boolean;
    midis: Midis;
    user: User | undefined;
    userMidis: Midis;
    midiApi: MidiApi;
    userApi: UserApi;
    token: string;
}

const Header = (headerProps: HeaderProps) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const addButtonClick = () => {
        headerProps.setShowAddModal(true);
        headerProps.setShowCreateUserModal(false);
        headerProps.setShowLoginModal(false);
        setMenuOpen(false);
    };

    const createUserClick = () => {
        headerProps.setShowCreateUserModal(true);
        headerProps.setShowAddModal(false);
        headerProps.setShowLoginModal(false);
        setMenuOpen(false);
    };

    const loginClick = () => {
        headerProps.setShowLoginModal(true);
        headerProps.setShowCreateUserModal(false);
        headerProps.setShowAddModal(false);
        setMenuOpen(false);
    };

    const logoutClick = () => {
        headerProps.setShowLoginModal(false);
        headerProps.setShowCreateUserModal(false);
        headerProps.setShowAddModal(false);
        headerProps.setToken("");
        headerProps.setLoggedIn(false);
        headerProps.setUserMidis({});
        setMenuOpen(false);
    };

    const userMidisClick = () => {
        headerProps.setShowCreateUserModal(false);
        headerProps.setShowLoginModal(false);
        headerProps.setShowAddModal(false);
        setMenuOpen(false);
        headerProps.userMidis.midis?.forEach(m => console.log(m.filename));
    };

    const userAccountClick = () => {
        headerProps.setShowCreateUserModal(false);
        headerProps.setShowLoginModal(false);
        headerProps.setShowAddModal(false);
        setMenuOpen(false);
        console.log("User: " + headerProps.user?.username);
    };

    useEffect((): void => {
    }, [headerProps.user]);

    return (
    <div className="header">
        <div className='user-info-wrapper'>{ headerProps.loggedIn && headerProps.user !== undefined? 
        <> 
            <span className='user-info-name'>{ headerProps.user.username }</span>
            <UserSvg className='user-info-symbol'/> 
        </> : "" } 
        </div>
        <div className='header-button-wrapper'>
            <input type="checkbox" className="openSidebarMenu" id="openSidebarMenu" 
                    checked={menuOpen} onChange={(event: any): void => {
                        if (menuOpen === true) {
                            setMenuOpen(event.target = false);
                        } else {
                            setMenuOpen(event.target = true);
                        }
                }   } />
                <label htmlFor="openSidebarMenu" className="sidebarIconToggle">
                    <div className="spinner diagonal part-1"></div>
                    <div className="spinner horizontal"></div>
                    <div className="spinner diagonal part-2"></div>
                </label>
            <div id="sidebarMenu">
                <ul className="sidebarMenuInner">
                    { headerProps.loggedIn === true ? 
                    <li><div className="menu-button" onClick={ addButtonClick } >
                        <span className="buttonText">Create new midi</span></div></li>
                    : "" }
                    { headerProps.loggedIn === false ? 
                    <li><div className="menu-button" onClick={ createUserClick } >
                        <span className="buttonText">Create account</span></div></li>
                    : "" }
                    { headerProps.loggedIn === false ? 
                    <li><div className="menu-button" onClick={ loginClick } >
                        <span className="buttonText">Login</span></div></li>
                    : "" }
                    { headerProps.loggedIn === true ? 
                    <li><div className="menu-button" onClick={ userMidisClick } >
                        <span className="buttonText">Your files</span></div></li>
                    : "" }
                    { headerProps.loggedIn === true ? 
                    <li><div className="menu-button" onClick={ userAccountClick } >
                        <span className="buttonText">Your account</span></div></li>
                    : "" }
                    { headerProps.loggedIn === true ? 
                    <li><div className="menu-button" onClick={ logoutClick } >
                        <span className="buttonText">Logout</span></div></li>
                    : "" }
                </ul>
            </div>
        </div>
    </div>);
}

export default Header;