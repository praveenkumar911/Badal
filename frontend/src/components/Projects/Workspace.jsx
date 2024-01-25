import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import TopBar from '../TopBar/TopBar';
import axios from 'axios';
import Grid from '@mui/material/Grid';
import PieChartsRow from "./Chart";
import Vector from "../project/Vector.svg";
import info from "../project/info.svg";
import gitlab from "../project/gitlab.svg";
import { useNavigate } from "react-router-dom";
import rcts  from "../project/RCTS.png"
import PieChartsTaskRow from './charttask';
const Workspace = () => {
    const title = useOutletContext();
    const navigate = useNavigate();
    const [moduledetails, setModuledetails] = useState([]);
    const[taskdetails,setTaskdetails]=useState([])
    const permissionString = sessionStorage.getItem('permissions');
    const permissions = permissionString ? permissionString.split(',') : [];
    const orgId=sessionStorage.getItem('orgId')
    const userId=sessionStorage.getItem('userId')
    const [orgdata,setOrgdata]=useState()
    const isP001Allowed = permissions.includes('P001');
    const isP002Allowed = permissions.includes('P002');
    const isP003Allowed = permissions.includes('P003');
    const isP004Allowed = permissions.includes('P004');
    const isP005Allowed = permissions.includes('P005');
    useEffect(() => {
      // Fetch all teams data 
      axios.get(`http://localhost:5030/get-org/${orgId}`)
        .then(response => {
          setOrgdata(response.data);
        })
        .catch(error => {
          console.error('Error fetching teams data:', error);
        });
    }, []);
  
    useEffect(() => {
      axios
        .get("http://localhost:5030/get-alltask")
        .then((res) => {
          setTaskdetails(res.data.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }, []);
    useEffect(() => {
      const fetchData = async () => {
        try {
          if (isP005Allowed) {
            // Step 3: Get all workspaces if isP005Allowed is true
            const allWorkspacesResponse = await axios.get('http://localhost:5030/get-all-workspaces');
            console.log('All Workspaces:', allWorkspacesResponse.data);
            setModuledetails(allWorkspacesResponse.data.workspaces);
          } else {
            // Step 1: Get Team IDs based on Entity ID
            const teamIdsResponse = await axios.get(`http://localhost:5030/get-teams-by-id/${orgId}`);
            const teamIds = teamIdsResponse.data.teamIds;
            // Step 2: Get Workspaces based on Team IDs 
            const workspacesResponse = await axios.post('http://localhost:5030/get-workspaces-by-teamids', { teamIds });
    
            console.log('Workspaces based on team IDs for Org:', workspacesResponse.data);
            setModuledetails(workspacesResponse.data.workspaces);
          }
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
    
      fetchData();
    }, [orgId, isP005Allowed]);
    
  return (
    <>
      <TopBar title={title} />
       
      <div>
        {moduledetails && moduledetails
          .map((details) => (
            
            <div key={details._id}>
              <Grid container spacing={0} sx={{
                maxWidth: '79.17vw',
                marginLeft: "8vw",
                marginRight: "1vw",
                marginTop: "2vw",
               
                border: '2px dotted #000',
                borderRadius: '8px',
                '@media (max-width: 850px)': {
                  minWidth: '1200px',
                  overflowX: 'auto', 
                  overflowY: "hidden" 
                },
              }}>
             <Grid
  item
  xs={12}
  sm={1.5}
  sx={{
    top: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    cursor: 'pointer',
    width: '120px',
    height: '120px',
    position: 'relative',
    marginTop:"2vw"
  }}
  container
  justifyContent="center" // Center content horizontally within the grid
  alignItems="center" // Center content vertically within the grid
  onClick={() => {
   /*  // Check if TeamsAssigned array length is less than 3
    if (details.TeamsAssigned.length < 3) {
      // Handle circle click logic here
      handleCircleClick(details);
    } */
  }}
>
  <svg
    width="100%"
    height="100%"
    viewBox="0 0 24 24"
    /* fill={isChecked ? '#FFF' : 'transparent'}
    stroke={isChecked ? '#000' : '#000'} */
    strokeWidth="0.5"
    strokeLinecap="round"
    strokeLinejoin="round" 
   
  >
  </svg>
                      <img
                        src={orgdata?.imgUrl || rcts}
                        alt="org img"
                        style={{
                          width: '50%',
                          height: '50%',
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          transform: 'translate(-50%, -50%)',
                          display: 'block',
                        }}
                      />
                    
</Grid>
              <Grid container xs={12} sm={3} sx={{
                borderLeft: '1px dashed #000',
                borderRight: ['none', '1px dashed #000'],
                padding: ['8px', '10px', '12px'],
                display: 'flex',
                alignItems: 'flex-start',
              }}>
                <Grid item xs={12} sm={12} md={12} xl={12}>
                  <div style={{ display: 'flex', justifyContent: 'space between', alignItems: 'center',cursor:'pointer' }} onClick={() => {
                       // navigate("/task/" + project + "/" + details._id);
                      }}> 
                    <h4>{details.workspaceName}</h4> 
                    
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: "flex-end" }}>
                      <img src={info} style={{ height: "30px", width: "30px", cursor: "pointer"}} onClick={() => {
                        const project=details.projectId
                        const module=details.workspaceId
                        navigate("/workspacetask/" + project + "/" + module);
                      }} /> 
                    </div>
                  <p sx={{ width: "5px" }}>{details.workspaceDescription.length > 100 ? details.workspaceDescription.substring(0, 100) + "..." : details.workspaceDescription} </p>
                </Grid>
                <Grid item xs={12} sm={12} md={12} xl={12} sx={{display: "flex",justifyContent: "flex-end"}}>
                  <img src={gitlab} style={{ height: "30px", width: "30px",  cursor: 'pointer' }} onClick={() => { window.open(details.forkedGitlabUrl, '_blank') }} />
                </Grid>
                {/* <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginTop: "1rem",
                      marginBottom: "1rem",
                    }}
                  >
                    moduleComplexity
                      {[1, 2, 3, 4, 5].map((index) => (
                      <Radio
                        key={index}
                        value={`radio${index}`}
                        control={<Radio />}
                        checked={index <= mapComplexityToNumber(details.moduleComplexity)}
                      />
                    ))}
                  </div> */}
              </Grid>
              
              <Grid item xs={12} sm={5} sx={{
                borderLeft: ['none', '1px dashed #000'],
                borderRight: ['none', '1px dashed #000'],
                position: 'relative',
                textAlign: ['left', 'center'],
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space between',
              }}>
                <div style={{
                  height: '40%',
                  borderBottom: '1px dashed #000',
                  display: 'flex',
                  flexDirection: 'column',
                  margin: '0 0 4px 0',
                  alignItems: 'flex-start',
                  justifyContent: 'flex-start',
                }}>
                  <p style={{
                    paddingLeft: '0.52vw',
                    paddingTop: '1.08vh',
                    marginTop: '-6px',
                    marginBottom: '4px',
                    fontWeight: '500'
                  }}>Skills Required</p>
                  <div   className="scrollable"style={{ display: 'flex', height: '40px',width: "91%", marginTop: '10px', marginLeft: '20px' }}>
                    {details.skillsRequired.map((item) => (
                      <p
                        key={item._id}
                        style={{
                          display: "inline-block",
                          padding: "4px 12px",
                          backgroundColor: "#FFF",
                          color: "#000",
                          border: "1px solid #000",
                          borderRadius: "20px",
                          marginRight: "5px",
                          fontSize: "12px",
                          textAlign: "center",
                          fontWeight: 400,
                          lineHeight: "1",
                        }}
                      >
                        {item.name}
                      </p>
                    ))}
                  </div>
                </div>
                <div style={{ height: '60%' }}>
                  <div style={{
                    width: '25%',
                    height: '103%',
                    float: 'left',
                    borderRight: '1px dashed #000',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    textAlign: ['left', 'center']
                  }}>
                    <span style={{
                      fontSize: ['16px', '20px'],
                      marginTop: '0.5vh',
                      marginBottom: '0',
                      marginRight: ['-4px', '-10px', '-16px']
                    }}>Total Dev time Required </span>
                    <span style={{
                      fontSize: ['32px'],
                      marginTop: ['-8px', '-16px'],
                      marginLeft: ['-8px', '-12px'],
                      fontWeight: '500'
                    }}>
                      {details.totalDevTimeRequired}
                    </span>
                    <span style={{
                      fontSize: ['16px', '20px'],
                      marginTop: ['-8px', '-16px'],
                      marginLeft: ['-8px', '-12px']
                    }}>hours</span>
                  </div>
                  <div
                      style={{
                        width: "10%",
                        height: "103%",
                        float: "left",
                        borderRight: "1px dashed #000",
                        backgroundColor: "#D9D9D9",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "flex-end",
                        alignItems: "center",
                        marginTop: "-4px",
                      }}
                    >
                      <span
                        style={{
                          transform: "translateY(-60%) rotate(270deg)",
                          fontSize: ["21px"],
                          marginBottom: "1.6vh",
                          marginRight: "0.4vw",
                        }}
                      >
                          Status{" "}
                      </span>
                      <img
                        src={Vector}
                        style={{
                          marginBottom: "1vh",
                          // width: "1.25vw",
                          // height: "2.06vh",
                          height: "25px",
                          width: "25px"
                        }}
                      />
                    </div>
                

<div
                    className="scrollable"
                      style={{
                        display: "flex",
                        flexWrap: "nowrap",
                        // overflowX: "auto",
                        whiteSpace: "nowrap",
                        marginTop:"-1vw"
                      }}
                    >
                   {taskdetails
  .filter((d) => d.workspaceId === details.workspaceId)
  .map((d, index) => (
    <PieChartsTaskRow
                              moduleName={"Task"+(index + 1)}
                              completed={parseInt(d.completed)} assigned={parseInt(d.assigned)} unassigned={0}
                              time={d.taskTime}
                            /> ))}
  </div> 
                </div>
                
              </Grid>
              <Grid item xs={12} sm={2.5} sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center', 
                justifyContent: 'center',
                backgroundColor: '#D9D9D9',
                borderRadius: '0 8px 8px 0',
              }}>
                <div style={{
                  color: '#4E4E4E',
                  fontSize: '16px',
                  fontStyle: 'normal',
                  fontWeight: 500,
                  lineHeight: 'normal',
                  fontVariant: 'small-caps',
                  letterSpacing: '0.64px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  flexShrink: 0,
                  marginBottom: '8px',
                }}>
                  Due By
                </div>
                <div style={{
                  color: '#4E4E4E',
                  fontSize: '16px',
                  fontStyle: 'normal',
                  fontWeight: 500,
                  lineHeight: 'normal',
                  fontVariant: 'small-caps',
                  letterSpacing: '0.64px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  flexShrink: 0,
                  marginTop: '8px',
                  marginBottom: '8px',
                }}>
                  {details.moduleDateEnd.substring(0, 10)}
                </div>
                {/* <select
                  name="cars"
                  id="cars"
                  style={{
                    width: '145px',
                    height: '24px',
                    flexShrink: 0,
                    borderRadius: '4px',
                    background: '#FFF',
                    boxShadow:
                      '2px 2px 4px 0px rgba(0, 0, 0, 0.25) inset, -2px -2px 4px 0px rgba(0, 0, 0, 0.25) inset',
                  }}
                >
                  <option value="volvo">Team 1</option>
                  <option value="saab">Team 2</option>
                  <option value="opel">Team 3</option>
                </select> */}
              </Grid>
            </Grid>
            {/* <div style={{ marginTop: "-6.2vw" ,display: "flex", justifyContent: "flex-end"}}>
              <RadioGroup>
                <FormControlLabel value="radio1" control={<Radio />} />
                <FormControlLabel value="radio2" control={<Radio />} />
                <FormControlLabel value="radio3" control={<Radio />} />
              </RadioGroup>
            </div> */}
          </div>
        ))}
      </div>

    </>
  );
};

export default Workspace;
