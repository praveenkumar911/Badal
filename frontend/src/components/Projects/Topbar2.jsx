import { useDispatch, useSelector } from 'react-redux';
import { NavLink, Outlet, useParams } from 'react-router-dom';
import { toggle } from '../../store/features/nav/navSlice';
import './Topbar.scss';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
const Topbar2 = (props) => {
    const dispatch = useDispatch();
    const { project } = useParams();
    const [projectData, setProjectData] = useState([]); // Initialize as an array
    const navigate = useNavigate();
    useEffect(() => {
        axios
            .post("http://localhost:5030/get-projectdata", { id: project })
            .then(async (res) => {
                setProjectData(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    // Extract the project name from the fetched data
    const projectname = projectData.length > 0 ? projectData[0].projectName : "Loading...";
 
    return (
        <div className="topbar">
            <div className="title-container">
                <img className="hamburger" src="/assets/icons/web/non-active/hamburger.svg" alt="Hamburger" 
                    onClick={()=>{ dispatch(toggle()) }} />
                <div className="title">
  <h1
  >
    Modules of the project : <span
onClick={() => navigate('/project')}
style={{
  cursor: 'pointer',
  textDecoration: 'none',
  transition: 'box-shadow 0.3s ease-in-out',
}}
onMouseEnter={(e) => (e.target.style.boxShadow = '0 0 6px rgba(0, 0, 0, 0.7)')}
onMouseLeave={(e) => (e.target.style.boxShadow = '0 0 4px rgba(0, 0, 0, 0.5)')}
>
{projectname}
</span>
  </h1>
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

export default Topbar2;

/* 
<span
onClick={() => navigate('/project')}
style={{
  cursor: 'pointer',
  textDecoration: 'none',
  transition: 'box-shadow 0.3s ease-in-out',
}}
onMouseEnter={(e) => (e.target.style.boxShadow = '0 0 4px rgba(0, 0, 0, 0.7)')}
onMouseLeave={(e) => (e.target.style.boxShadow = 'none')}
>
{projectname}
</span> */