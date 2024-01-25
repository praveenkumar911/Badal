import React, { createRef, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useLocation } from "react-router-dom";
import "./NavBar.scss";
import axios from "axios";
import { toggle, changeTitle } from "../../store/features/nav/navSlice";

const menuItems = [
  {
    name: "Home",
    icon: "/assets/icons/web/non-active/home.svg",
    iconActive: "/assets/icons/web/active/home.svg",
    path: "home",
  },
  {
    name: "Data",
    icon: "/assets/icons/web/non-active/data.svg",
    iconActive: "/assets/icons/web/active/data.svg",
    path: "data",
  },
  {
    name: "Teams",
    icon: "/assets/icons/web/non-active/groups.svg",
    iconActive: "/assets/icons/web/active/groups.svg",
    path: "Teams",
  },
  {
    name: "Project",
    icon: "/assets/icons/web/non-active/project.svg",
    iconActive: "/assets/icons/web/active/project.svg",
    path: "project",
  },
  {
    name: "Workspace",
    icon: "/assets/icons/web/non-active/workspace.svg",
    iconActive: "/assets/icons/web/active/workspace.svg",
    path: "workspace",
  },
  {
    name: "Sign Out",
    icon: "/assets/icons/web/non-active/signout.svg",
    iconActive: "/assets/icons/web/active/signout.svg",
    path: "/",
  },
];

const NavBar = ({ onLogout }) => {
  const [index, setIndex] = useState(0);
  const loaction = useLocation();
  const navRef = useRef([]);
  navRef.current = menuItems.map(
    (item, idx) => navRef.current[idx] ?? createRef()
  );
  const isNavExp = useSelector((state) => state.nav.isNavExp);
  const title = useSelector((state) => state.nav.title);
  const dispatch = useDispatch();

  const clickHandler = ({ name }, idx) => {
    if (name === "Sign Out") {
      // ... (existing signout logic)

      // Trigger the onLogout function received from props
      if (onLogout) {
        onLogout();
      }
    } else {
      dispatch(changeTitle(name));
      setIndex(idx);
    }
  };

  useEffect(() => {
    let idx = menuItems.findIndex((item) => item.name === title);
    setIndex(idx);
  }, [title]);

  useEffect(() => {
    // console.log("location changed", location.pathname);
    navRef.current.forEach((item, idx) => {
      if (item.current.className.includes("active")) {
        setIndex(idx);
        dispatch(changeTitle(menuItems[idx].name));
      }
    });
  }, [loaction, dispatch]);

  return (
    <div className={isNavExp ? "nav-container" : "nav-container vertical"}>
      <div className="nav-header">
        <div
          className="hamburger"
          onClick={() => {
            dispatch(toggle());
          }}
        ></div>
        <img
          className="hamburger-image"
          src="/assets/icons/web/non-active/hamburger.svg"
          alt="Hamburger"
          onClick={() => {
            dispatch(toggle());
          }}
        />
        {isNavExp && <div className="title">RCTS</div>}
      </div>
      <div className="menu-list">
        {menuItems.map((i, idx) => (
          <NavLink
            ref={navRef.current[idx]}
            to={i.path}
            key={idx.toString()}
            onClick={clickHandler.bind(this, i, idx)}
          >
            <div className={index === idx ? "menu-item active" : "menu-item"}>
              <img src={index === idx ? i.iconActive : i.icon} alt={i.name} />
              {isNavExp && <div className="label">{i.name}</div>}
            </div>
          </NavLink>
        ))}
      </div>
      <div className="nav-footer">
        <div className="user">
          <img src="/assets/icons/web/non-active/user.svg" alt="user" />
          {isNavExp && <div className="label">User Profile</div>}
        </div>
        <div className={isNavExp ? "actions" : "actions vertical"}>
          <div className="items languages">
            <div className="label">Language</div>
            <table className="lang">
              {isNavExp && (
                <tbody>
                  <tr>
                    <td className="lang-item">En</td>
                    <td className="lang-item">Hi</td>
                    <td className="lang-item">Te</td>
                  </tr>
                </tbody>
              )}
              {!isNavExp && (
                <tbody>
                  <tr>
                    <td className="lang-item">En</td>
                  </tr>
                  <tr>
                    <td className="lang-item">Hi</td>
                  </tr>
                  <tr>
                    <td className="lang-item">Te</td>
                  </tr>
                </tbody>
              )}
            </table>
          </div>
          <div className="items">
            <div className="label">Privacy</div>
          </div>
          <div className="items">
            <div className="label">Terms</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
