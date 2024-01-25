import { useDispatch, useSelector } from 'react-redux';
import { NavLink, Outlet, useParams } from 'react-router-dom';
import { toggle } from '../../store/features/nav/navSlice';
import './Topbar.scss';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
const Topbar4 = (props) => {
    const dispatch = useDispatch();
    const { project, module } = useParams();
    const [moduleWork, setModuleWork] = useState([]);
    const [projectData, setProjectData] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        axios
          .post("http://localhost:5030/get-workspaceData", {
            moduleid: module
          })
          .then(async (res) => {
            setModuleWork(res.data);
          })
          .catch((err) => {
            console.log(err);
          });

        axios
          .post("http://localhost:5030/get-projectdata", { id: project })
          .then(async (res) => {
            setProjectData(res.data);
          })
          .catch((err) => {
            console.log(err);
          });
    }, []);

    const projectName = projectData.length > 0 ? projectData[0].projectName : "Loading...";
    const moduleName = moduleWork.length > 0 ? moduleWork[0].moduleName : "Loading...";

    return (
        <div className="topbar">
            <div className="title-container">
                <img className="hamburger" src="/assets/icons/web/non-active/hamburger.svg" alt="Hamburger" 
                    onClick={() => { dispatch(toggle()) }} />
                <div className="title"><h1 
                      >Task list for module: {/* <span  style={{
                        cursor: 'pointer',
                        textDecoration: 'none',
                        transition: 'text-decoration 0.3s ease-in-out', // Optional for smooth transition
                      }}
                      onMouseEnter={(e) => (e.target.style.textDecoration = 'underline')}
                      onMouseLeave={(e) => (e.target.style.textDecoration = 'none')} onClick={() => navigate('/project')}>{projectName}</span>  */} <span onClick={() => {
                        navigate("/workspace");
                      }} style={{
                        cursor: 'pointer',
                        textDecoration: 'none',
                        transition: 'text-decoration 0.3s ease-in-out', // Optional for smooth transition
                      }}
                      onMouseEnter={(e) => (e.target.style.textDecoration = 'underline')}
                      onMouseLeave={(e) => (e.target.style.textDecoration = 'none')}>{moduleName}</span></h1></div>
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

export default Topbar4;
