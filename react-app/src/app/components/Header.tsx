import { Dispatch, SetStateAction, useState } from "react";
import { MidiApi, Midis } from "../../generated/midi-api";
import { UserApi } from "../../generated/user-api";
import Content from "./Content";
import "./Header.css";

interface HeaderProps {
    setShowAddModal: Dispatch<SetStateAction<boolean>>;
    setShowCreateUserModal: Dispatch<SetStateAction<boolean>>;
    setShowLoginModal: Dispatch<SetStateAction<boolean>>;
    setShowEditModal: Dispatch<SetStateAction<boolean>>;
    setShowDeleteBoxes: Dispatch<SetStateAction<boolean>>;
    setUpdate: Dispatch<SetStateAction<boolean>>;
    //seLoggedIn: Dispatch<SetStateAction<boolean>>;
    setToken: Dispatch<SetStateAction<string>>;
    setContent: Dispatch<SetStateAction<JSX.Element>>;
    //loggedIn: boolean;
    showDeleteBoxes: boolean;
    midis: Midis;
    midiApi: MidiApi;
    userApi: UserApi;
    token: string;
}

const Header = (headerProps: HeaderProps) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const addButtonClick = () => {
        headerProps.setShowAddModal(true);
        headerProps.setShowDeleteBoxes(false);
        headerProps.setShowCreateUserModal(false);
        headerProps.setShowLoginModal(false);
        setMenuOpen(false);
    };

    const createUserClick = () => {
        headerProps.setShowCreateUserModal(true);
        headerProps.setShowAddModal(false);
        headerProps.setShowDeleteBoxes(false);
        headerProps.setShowLoginModal(false);
        setMenuOpen(false);
    };

    const loginClick = () => {
        headerProps.setShowLoginModal(true);
        headerProps.setShowCreateUserModal(false);
        headerProps.setShowAddModal(false);
        headerProps.setShowDeleteBoxes(false);
        setMenuOpen(false);
    };

    const deleteButtonClick = () => {
        console.log("Click");
        if (headerProps.showDeleteBoxes == true) {
            headerProps.setShowDeleteBoxes(false);
            headerProps.setContent(
                <Content foods={headerProps.midis} showDeleteBox={false} setUpdate={headerProps.setUpdate} 
                midiApi={headerProps.midiApi} token={headerProps.token} />
            )
        } else {
            headerProps.setShowDeleteBoxes(true);
            headerProps.setContent(
                <Content foods={headerProps.midis} showDeleteBox={true} setUpdate={headerProps.setUpdate} 
                midiApi={headerProps.midiApi} token={headerProps.token} />
            )
        }
        setMenuOpen(false);
    };

    return (
    <div className="header">
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
                    <li><div className="menu-button" onClick={ addButtonClick } >
                        <span className="buttonText">Create new midi</span></div></li>
                    <li><div className="menu-button" onClick={ deleteButtonClick } >
                        <span className="buttonText">Delete midi</span></div></li>
                    <li><div className="menu-button" onClick={ createUserClick } >
                        <span className="buttonText">Create account</span></div></li>
                    <li><div className="menu-button" onClick={ loginClick } >
                        <span className="buttonText">Login</span></div></li>
                </ul>
            </div>
        </div>
    </div>);
}

export default Header;