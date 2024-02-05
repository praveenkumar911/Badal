import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { changeTitle } from "../../store/features/nav/navSlice";
import "./NavBarMobile.scss";

const menuItems = [
    { name: "Home", icon: "/assets/icons/mobile/non-active/home.svg", iconActive: "/assets/icons/mobile/active/home.svg", path: "home" },
    { name: "Data", icon: "/assets/icons/mobile/non-active/data.svg", iconActive: "/assets/icons/mobile/active/data.svg", path: "data" },
    { name: "Groups", icon: "/assets/icons/mobile/non-active/groups.svg", iconActive: "/assets/icons/mobile/active/groups.svg", path: "groups" },
    { name: "Tools", icon: "/assets/icons/mobile/non-active/tools.svg", iconActive: "/assets/icons/mobile/active/tools.svg", path: "tools" },
    { name: "Sign Out", icon: "/assets/icons/mobile/non-active/signout.svg", iconActive: "/assets/icons/mobile/active/signout.svg", path: "login" },
];

const NavBarMobile = () => {
    const dispatch = useDispatch();
    const [ index, setIndex ] = useState(0);
    const title = useSelector(state => state.nav.title);

    const clickHandler = ({name}, idx) => {
        dispatch(changeTitle(name));
        setIndex(idx);
    }

    useEffect(()=>{
        let idx = menuItems.findIndex(item => item.name === title);
        setIndex(idx);
    }, [title]);

    return (
        <div className="navbar-mobile">
            <div className="nav-list">
                {menuItems.map((item, idx) => 
                    <NavLink to={item.path} key={idx.toString()} onClick={clickHandler.bind(this, item, idx)}>
                        <div className="menu-item">
                            <img src={index===idx?item.iconActive:item.icon} alt={item.name} />
                            <div className="title">{item.name}</div>
                        </div>
                    </NavLink>
                )}
            </div>
        </div>
    );
}

export default NavBarMobile;