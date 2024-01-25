import { useDispatch, useSelector } from 'react-redux';
import { NavLink, Outlet } from 'react-router-dom';
import { toggle } from '../../store/features/nav/navSlice';
import './TopBar.scss';

const TopBar = (props) => {
    const title = useSelector(state => state.nav.title);
    const dispatch = useDispatch();

    return (
        <div className="topbar" >
            <div className="title-container">
                <img className="hamburger" src="/assets/icons/web/non-active/hamburger.svg" alt="Hamburger" 
                    onClick={()=>{ dispatch(toggle()) }} />
                <div className="title">List Of {title}</div>
                <div className="logo">
                    <img src="/assets/images/banner.svg" alt="logo" />
                </div>
            </div>
            <div className="tabs">
                {props.tabs && props.tabs.map((i, idx) => (
                    <NavLink to={i.path} key={idx.toString()}>
                        <div className="tab-item">{i.name}</div>
                    </NavLink>
                ))}
            </div>
            <Outlet />
        </div>
    );
}

export default TopBar;