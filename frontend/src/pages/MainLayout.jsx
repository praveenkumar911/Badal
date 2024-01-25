import './MainLayout.scss';
import {Outlet } from 'react-router-dom';
import Footer from '../components/Footer/Footer';
import NavBar from "../components/NavBar/NavBar";
import NavBarMobile from '../components/NavBarMobile/NavBarMobile';


const MainLayout = ({ onLogout }) => {
    return ( 
        <div className="layout-container">
            <NavBar onLogout={onLogout} />
            <div className="main-container">
                <div className="sub-container mb-4">
                    <Outlet />
                </div>
                <div className=''>
                    <Footer height={'5vh'} />
                    <NavBarMobile />
                </div>
            </div>
        </div>
    );
}

export default MainLayout;