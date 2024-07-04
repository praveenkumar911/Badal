import React, { useState, useEffect } from "react";
import { Box, Container, Grid, Typography } from "@mui/material";
import { Workspacecard } from "../cards/workspacecard";
import Divider from "@mui/material/Divider";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import education from '../icons/education.svg';
import Livelihood1 from "../icons/rural.svg"
import healthcare from "../icons/healthcare.svg";
import Vector from "../icons/Vector.svg";
import gitlab from "../icons/gitlab.svg";
import PieChartsRow from "../Sub-Pages/Chart";

import './project.css'
function Workspace(props) {
    const permissionString = localStorage.getItem('permissions');
    const permissions = permissionString ? permissionString.split(',') : [];
    const isP001Allowed = permissions.includes('P001');
    const isP002Allowed = permissions.includes('P002');
    const isP003Allowed = permissions.includes('P003');
    const isP004Allowed = permissions.includes('P004');
    const isP005Allowed= permissions.includes('P005')
    const project=props.project
    const [moduleDetails, setModuleDetails] = useState([])
    React.useEffect(() => {
      axios
        .get("http://10.8.0.12:5000/get-allmodules")
        .then((res) => {
          setModuleDetails(res.data.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }, []);
  
  
    const [orgImgUrls, setOrgImgUrls] = useState({});
    const [orgNames,setOrgNames]=useState({})
    const[url,setUrl]=useState()
     useEffect(() => {

        // Fetch image URLs based on orgIds
        axios.get('http://10.8.0.12:5000/get-img-url', { params: { orgIds:  project.orgId } })
          .then(response => {
            // setOrgImgUrls(response.data.imgUrls.reduce((acc, imgUrl, index) => {
            //   acc[project[index].orgId] = imgUrl;
            //   return acc;
            // }, {}));
            setUrl(response.data.orgDetails[0].imgUrl)

          }) 
          .catch(error => {
            console.error('Error fetching org image URLs:', error);
          });
      
    }, [project]);
    console.log(url); 
  
    return (
        <>
  <div>
        <div>

              <Grid
                container
                spacing={0}
                key={project.projectCreatedBy}
                sx={{
                  width: "93%",
                  maxWidth: "79.17vw",
                  marginLeft: "5vw",
                  marginTop: "2vw",
                  border: "2px dotted #000", // add dotted border
                  borderRadius: "8px",
                  marginRight: "1vw", // add border radius
                  '@media (max-width: 800px)': {
                    minWidth: '1200px',
                    overflowX: 'auto',
                    overflowY:"hidden" 
                  },
                }}
              >
              
                <Grid
                  item
                  xs={12}
                  sm={3.5}
                  sx={{
                    // borderLeft: "1px dashed #000",
                    borderRight: ["none", "1px dashed #000"],
                    padding: ["8px", "10px", "12px"],
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "flex-start", // Align items to the top
                    
                  }}
                >
                  <div sx={{ textAlign: "left" }}>
                    <h4
                      style={{  margin: "-10px 8px 12px -10px" ,
                      cursor: 'pointer',
                      textDecoration: 'none',
                      fontSize:"45  px",
                      transition: 'text-decoration 0.3s ease-in-out',
                      marginLeft:'0.2vw' // Optional for smooth transition
                    }}
                    onMouseEnter={(e) => (e.target.style.textDecoration = 'underline')}
                    onMouseLeave={(e) => (e.target.style.textDecoration = 'none')}
                    // onClick={() => {
                    //   navigate("/module/" + project.projectName);
                    // }}
                    >
                      {project.name} 
                    </h4>

                    <p
                      sx={{
                      //   margin: "6px 4px 0 4px",
                      cursor:'pointer',
                        width: "5px",
                      }}
                      // onClick={() => {
                      //   navigate("/module/" + project.projectName);
                      // }}
                    >
                      {project &&
                      project.problem_statement &&
                      project.problem_statement.length > 33
                        ? project.problem_statement.substring(0, 33) + "..."
                        : project.problem_statement}
                    </p>
                    <img
                      src={gitlab}
                      alt="GitLab"
                      style={{ width: "30px", height: "30px", marginTop: "5vw" ,cursor:'pointer',marginLeft:'20vw'}}
                      onClick={() => {
                        window.open(project.gitweburl, "_blank");
                      }}
                    />
                  </div>
                
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={5}
                  sx={{
                    borderRight: ["none", "1px dashed #000"],
                    position: "relative",
                    textAlign: ["left", "center"],
                    display: "flex",
                    flexDirection: "column", // add flex direction
                    justifyContent: "space-between", // add justify content
                  }}
                >
                  <div
                    style={{
                      height: "40%",
                      borderBottom: "1px dashed #000",
                      display: "flex",
                      flexDirection: "column",
                      margin: "0 0 4px 0",
                      alignItems: "flex-start", // align text to left
                      justifyContent: "flex-start",
                      cursor:'pointer' // align text to top
                    }}
                    // onClick={() => {
                    //   navigate("/module/" + project.projectName);
                    // }}
                  >
                    <p
                      style={{ 
                        paddingLeft: "10px",
                        paddingTop: "10px",
                        marginTop: "-6px", // move "Skills Required" text up
                        marginBottom: "4px",
                        fontWeight: "500",
                      }}
                    >
                      Skills Required
                    </p>
                    <div
                     className="scrollable"
                      style=
                      {{
                        display: "flex",
                        height: "40px",
                        width: "91%",
                       // overflow:"auto",
                        marginTop: "10px",
                        marginLeft: "20px",
                      }}
                    > 
                      {project.tags.map((item) => ( 
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
                            fontSize: "10px",
                            textAlign: "center",
                            fontWeight: 400,
                            lineHeight: "1",
                          }}
                        >
                          {item}
                        </p>
                      ))}
                    </div>
                  </div>
                  <div style={{ height: "60%" }}>
                    <div
                      style={{
                        width: "25%",
                        height: "100%",
                        float: "left",
                        borderRight: "1px dashed #000",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexDirection: "column",
                        textAlign: ["left", "center"],
                        cursor:'pointer'
                      }}
                      // onClick={() => {
                      //   navigate("/module/" + project.projectName);
                      // }}
                    >
                      <span
                        style={{
                          fontSize: ["16px", "20px"],
                          marginTop: "0.5vh",
                          marginBottom: "0",
                          marginRight: ["-4px", "-10px", "-16px"],
                          cursor:'pointer'
                        }}
                        // onClick={() => {
                        //   navigate("/module/" + project.projectName);
                        // }}
                      >
                        Total Dev time Required{" "}
                      </span>
                      <span
                        style={{
                          fontSize: ["32px"],
                          marginTop: ["-8px", "-16px"],
                          marginLeft: ["-8px", "-12px"],
                          fontWeight: "500",
                        }}
                      >
                        {project.time}
                      </span>
                      <span
                        style={{
                          fontSize: ["16px", "20px"],
                          marginTop: ["-8px", "-16px"],
                          marginLeft: ["-8px", "-12px"],
                        }}
                      >
                        hours
                      </span>
                    </div>

                    <div
                      style={{
                        width: "10%",
                        height: "103%",
                        float: "left",
                        borderRight: "1px dashed #000",
                        backgroundColor:  "#f2fffe",
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
                        Status
                      </span>
                      <img
                        src={Vector}
                        style={{
                          marginBottom: "0.5vh",
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
                        whiteSpace: "nowrap",
                        marginTop:"-1vw",
                        cursor:"pointer"
                      }}
                    >
                   {moduleDetails  
                        .filter((details) => details.projectId === project.id)
                        .map((details, index) => (
                          <PieChartsRow  moduleName={"Module" +(index + 1)}  time={details.totalDevTimeRequired} completed={details.completed} assigned={details.teamsAssigned.length} unassigned={3-(details.teamsAssigned.length)} />
                        ))}
                        </div>  
                     
                </div>
                </Grid>

                <Grid
                  item
                  xs={12}
                  sm={2}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    // backgroundColor:  "#f2fffe",
                    // backgroundColor:  "red",
                    borderRadius: "0 8px 8px 0",
                    cursor:'pointer',
                  }}
                  // onClick={() => {
                  //   navigate("/module/" + project.projectName);
                  // }}
                >
                  <img
     src={url || ""}
    style={{
      width: '50vw',
      height: '20vh',
      maxWidth: '100%',
      maxHeight: '100%',
      paddingLeft: "10vw"
    }}
  />
                </Grid>
              </Grid>
            {/* ))} */}
        </div>
        
      </div>
        </>
    );
}

export default Workspace;