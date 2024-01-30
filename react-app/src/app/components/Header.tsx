import { Dispatch, SetStateAction, useState } from "react";
import "./Header.css";
import { Foods } from "../../generated";
import Content from "./Content";

interface HeaderProps {
    setShowAddModal: Dispatch<SetStateAction<boolean>>;
    setShowEditModal: Dispatch<SetStateAction<boolean>>;
    setShowDeleteBoxes: Dispatch<SetStateAction<boolean>>;
    setUpdate: Dispatch<SetStateAction<boolean>>;
    showDeleteBoxes: boolean;
    foods: Foods;
    setContent: Dispatch<SetStateAction<JSX.Element>>;
}

const Header = (headerProps: HeaderProps) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const addButtonClick = () => {
        headerProps.setShowAddModal(true);
        headerProps.setShowDeleteBoxes(false);
        setMenuOpen(false);
    };

    const deleteButtonClick = () => {
        console.log("Click");
        if (headerProps.showDeleteBoxes == true) {
            headerProps.setShowDeleteBoxes(false);
            headerProps.setContent(
            <Content foods={headerProps.foods} showDeleteBox={false} setUpdate={headerProps.setUpdate}/>
            )
        } else {
            headerProps.setShowDeleteBoxes(true);
            headerProps.setContent(
                <Content foods={headerProps.foods} showDeleteBox={true} setUpdate={headerProps.setUpdate}/>
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
                        <span className="buttonText">Add new food</span></div></li>
                    <li><div className="menu-button" onClick={ deleteButtonClick } >
                        <span className="buttonText">Delete foods</span></div></li>
                </ul>
            </div>
        </div>
    </div>);
}

export default Header;