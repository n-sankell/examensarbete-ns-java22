import { closeCreateMidiModal, closeCreateUserModal, closeLoginModal, closePublicMidis, closeUserMidis, displayCreateMidiModal, displayCreateUserModal, displayLoginModal, displayPublicMidis, displayUserMidis } from "../../actions/displayActions";
import { ThunkDispatch, bindActionCreators } from "@reduxjs/toolkit";
import UserSvg from '../../../assets/user-alt-1-svgrepo-com.svg';
import PlaySvg from '../../../assets/play-player-music-svgrepo-com.svg'
import PauseSvg from '../../../assets/pause-circle-svgrepo-com.svg'
import { Midis } from "../../../generated/midi-api";
import { User } from "../../../generated/user-api";
import { logout } from "../../actions/userActions";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { RootState } from "../../store";
import { MidiWrapper } from "../../types/MidiWrapper";
import "./Header.css";

interface StateProps {
    loggedIn: boolean;
    user: User | null;
    userMidis: Midis | null;
    parsedMidi: MidiWrapper;
    midiIsPlaying: boolean;
}
interface DispatchProps {
    displayLoginModal: () => void;
    displayCreateUserModal: () => void;
    displayCreateMidiModal: () => void;
    displayUserMidis: () => void;
    displayPublicMidis: () => void;
    closeCreateMidiModal: () => void;
    closeCreateUserModal: () => void;
    closeUserMidis: () => void;
    closePublicMidis: () => void;
    closeLoginModal: () => void;
    logout: () => void;
}
interface HeaderProps extends StateProps, DispatchProps {}

const Header: React.FC<HeaderProps> = ( { loggedIn, user, userMidis, logout, parsedMidi, midiIsPlaying, 
    displayLoginModal, displayCreateUserModal, displayCreateMidiModal, displayUserMidis, displayPublicMidis, 
    closeLoginModal, closeCreateUserModal, closeCreateMidiModal, closeUserMidis, closePublicMidis }) => {

    const [menuOpen, setMenuOpen] = useState<boolean>(false);

    const addButtonClick = (): void => {
        closeAllModals();
        displayCreateMidiModal();
        setMenuOpen(false);
    };
    const createUserClick = (): void => {
        closeAllModals();
        displayCreateUserModal();
        setMenuOpen(false);
    };
    const loginClick = (): void => {
        closeAllModals();
        displayLoginModal();
        setMenuOpen(false);
    };
    const logoutClick = (): void => {
        logout();
        closeAllModals();
        setMenuOpen(false);
    };
    const userMidisClick = () => {
        closeAllModals();
        setMenuOpen(false);
        displayUserMidis();
    };
    const publicMidisClick = () => {
        closeAllModals();
        setMenuOpen(false);
        displayPublicMidis();
    };
    const userAccountClick = () => {
        closeAllModals();
        setMenuOpen(false);
        console.log("User: " + user?.username);
    };
    const closeAllModals = (): void => {
        closeLoginModal();
        closeCreateUserModal();
        closeCreateMidiModal();
        closePublicMidis();
        closeUserMidis();
    }

    useEffect((): void => {
    }, [loggedIn, user, userMidis, parsedMidi, midiIsPlaying]);

    return (
    <div className="header">

        <div className='header-button-wrapper'>
            <input type="checkbox" className="openSidebarMenu" id="openSidebarMenu" 
                    checked={ menuOpen } onChange={ (event: any): void => {
                        if (menuOpen === true) {
                            setMenuOpen(event.target = false);
                        } else {
                            setMenuOpen(event.target = true);
                        }
                } } />
                <label htmlFor="openSidebarMenu" className="sidebarIconToggle">
                    <div className="spinner diagonal part-1"></div>
                    <div className="spinner horizontal"></div>
                    <div className="spinner diagonal part-2"></div>
                </label>
            <div id="sidebarMenu">
                <ul className="sidebarMenuInner">
                    <li><div className="menu-button" onClick={ publicMidisClick } >
                        <span className="buttonText">Public midis</span></div></li>
                    { loggedIn === true ? 
                    <li><div className="menu-button" onClick={ addButtonClick } >
                        <span className="buttonText">Create new midi</span></div></li>
                    : "" }
                    { loggedIn === false ? 
                    <li><div className="menu-button" onClick={ createUserClick } >
                        <span className="buttonText">Create account</span></div></li>
                    : "" }
                    { loggedIn === false ? 
                    <li><div className="menu-button" onClick={ loginClick } >
                        <span className="buttonText">Login</span></div></li>
                    : "" }
                    { loggedIn === true ? 
                    <li><div className="menu-button" onClick={ userMidisClick } >
                        <span className="buttonText">Your files</span></div></li>
                    : "" }
                    { loggedIn === true ? 
                    <li><div className="menu-button" onClick={ userAccountClick } >
                        <span className="buttonText">Your account</span></div></li>
                    : "" }
                    { loggedIn === true ? 
                    <li><div className="menu-button" onClick={ logoutClick } >
                        <span className="buttonText">Logout</span></div></li>
                    : "" }
                </ul>
            </div>
        </div>

        <div className="control-panel"> { parsedMidi.midi !== null ? 
            <img 
                src={ midiIsPlaying === false ? PlaySvg : PauseSvg } 
                id='startButton' 
                className={ midiIsPlaying === false ? 'play-icon' : 'pause-icon' } >
            </img> : "" } 
        </div>
        
        <div className='user-info-wrapper'>{ loggedIn && user !== null ? 
        <> 
            <img src={ UserSvg } className='user-info-symbol'/> 
            <span className='user-info-name'>{ user.username }</span>
        </> : "" } 
        </div>

    </div>);
}

const mapStateToProps = (state: RootState): StateProps => ({
    loggedIn: state.user.loggedIn,
    user: state.user.user,
    userMidis: state.midi.userMidis,
    parsedMidi: state.midi.parsedMidi,
    midiIsPlaying: state.visualizer.midiIsPlaying,
  });
  
  const mapDispatchToProps = (dispatch: ThunkDispatch<RootState, null, any>): DispatchProps => ({
    displayLoginModal: bindActionCreators(displayLoginModal, dispatch),
    closeLoginModal: bindActionCreators(closeLoginModal, dispatch),
    displayCreateUserModal: bindActionCreators(displayCreateUserModal, dispatch),
    displayCreateMidiModal: bindActionCreators(displayCreateMidiModal, dispatch),
    displayUserMidis: bindActionCreators(displayUserMidis, dispatch),
    displayPublicMidis: bindActionCreators(displayPublicMidis, dispatch),
    closeCreateUserModal: bindActionCreators(closeCreateUserModal, dispatch),
    closeCreateMidiModal: bindActionCreators(closeCreateMidiModal, dispatch),
    closeUserMidis: bindActionCreators(closeUserMidis, dispatch),
    closePublicMidis: bindActionCreators(closePublicMidis, dispatch),
    logout: bindActionCreators(logout, dispatch),
  });
  
  export default connect(mapStateToProps, mapDispatchToProps)(Header);