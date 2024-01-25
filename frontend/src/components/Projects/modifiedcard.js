import React from "react";
import { Card, CardContent, DialogContent, Typography } from '@mui/material';
import gitlab from "../project/gitlab.svg";
import { Grid,Dialog } from "@mui/material";
import notes from "../project/notes.svg";
import trash from "../project/trash.svg";
import { useNavigate } from "react-router-dom";
import { useEffect,useState } from "react";
import axios from "axios";
import EditProject1 from "./editproject1";
import healthcare from "../project/healthcare.svg";
import education from "../project/education.svg";
import Livelihood1 from "../project/rural.svg"
const ModifiedCard = (props) => { 
  const permissionString = sessionStorage.getItem('permissions');
  const permissions = permissionString ? permissionString.split(',') : [];
  const orgId=sessionStorage.getItem('orgId')
  const userId=sessionStorage.getItem('userId')
 
  const isP001Allowed = permissions.includes('P001');
  const isP002Allowed = permissions.includes('P002');
  const isP003Allowed = permissions.includes('P003');
  const isP004Allowed = permissions.includes('P004');
  const isP005Allowed = permissions.includes('P005');
  const project=props.project
  console.log("hi",project);

  const navigate=useNavigate()
  const[usefulData,setusefulData]=useState();
  const[open,setOpen]=useState(false);
  const[projectData,setProjectData]=useState()
  const [projectId, setProjectId] =useState(null);
  const[orgdata,setOrgdata]=useState()
  const handleOpen = (projectId) => {
    setProjectId(projectId);
    setOpen(true);
  };


  const handleClose = () => { 
    setOpen(false);
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch project data
        const projectDataResponse = await axios.post("http://localhost:5030/get-projectdata", { projectName: project });
        const projectData = projectDataResponse.data;
  
        setusefulData(projectData[0]);
        setProjectData(projectData);
        sessionStorage.setItem('projectId', projectData[0].projectId);
  
        // Fetch organization data
        const orgDataResponse = await axios.get(`http://localhost:5030/get-org/${projectData[0].projectOwner}`);
        const orgData = orgDataResponse.data;
  
        setOrgdata(orgData);
        console.log("erdfgh", orgData);
      } catch (error) {
        console.log(error);
      }
    };
  
    // Call the fetchData function
    fetchData();
  }, [project]); // Include project as a dependency if needed
  
  const handleDeleteProject = async () => {
    const projectId = usefulData.projectId;
  
    try {
      // Delete project in GitLab
      const response = await axios.delete(`http://localhost:5030/delete-group/${usefulData.gitlabId }`);
      console.log(response.data);
  
      // Delete project in database
      await axios.delete(`http://localhost:5030/delete-project/${projectId}`);
      console.log(`Project with ID ${projectId} deleted from database`);
  
      // Delete project ID from NGO collection
      await axios.delete(`http://localhost:5030/delete-project-from-ngo/${projectId}`);
      console.log(`Project with ID ${projectId} removed from NGO collection`);
  
      // Log successful project deletion
      const logData = {
        index: "badal",
        data: {
          message: `Project "${usefulData.projectName}" deleted successfully from GitLab, local database, and NGO collection`,
          timestamp: new Date(),
        },
      };
      await axios.post(`http://localhost:5030/log`, logData);
  
      // Redirect to dashboard
      navigate('/project')
    } catch (err) {
      console.log(err);
  
      // Log the error
      const logData = {
        index: "badal",
        data: {
          message: `Error deleting project "${usefulData.projectName}": ${err.message}`,
          timestamp: new Date(),
        },
      }; 
      await axios.post(`http://localhost:5030/log`, logData);
  
      // Show an error alert to the user
      alert(`Error deleting project "${usefulData.projectName}": ${err.message}`);
    }
  };
  
  
  return (
    <>
    {projectData && projectData.map((projects) => (
    <div style={{ display: 'flex', alignItems: 'center',}}>
      <Card style={{ width: '68%', height: '400px', position: 'relative', border: '1px dotted #000' }} sx={{ '@media (max-width: 850px)': {
                  minWidth: '1000px',
                  overflowX: 'auto', 
                  
                },}}>
        <CardContent style={{ position: 'absolute', width: '100%', height: '100%' }}>
          <Grid container style={{ height: '100%' }}>
            {/* Top Left */}
            <Grid item xs={6} style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <Typography align="left" style={{fontWeight:"bold"}}>Description</Typography>
            <Typography style={{ marginLeft: '100px', width:"150%" }}> {projects.projectDescription}</Typography>
          </Grid>
            {/* Top Right */}
            <Grid item xs={6} style={{ position: 'relative', display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-end' }}>
      <Typography align="right">
        <span style={{ fontWeight: 'bold' }}>Date Added : </span>
        <span style={{  }}>{projects.projectDateCreated.substring(0, 10)}</span>
      </Typography>
    </Grid>
            {/* Bottom Left */}
            <Grid item xs={6} style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-end' }}>
            <div style={{ marginTop: 'auto' }}>
                <Typography align="left" style={{fontWeight:"bold"}}>Skills Required</Typography>
                {projects.skillsRequired.map((skill) => (
                <div style={{ display: "inline-block", margin: "5px", overflowX: "auto" }}>
                  <div
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
                     {skill.name}
                  </div>
                </div>
               ) )}
                <div style={{display: "flex",flexDirection: "row" ,paddingTop:" 3vh"}}>
                <div><p style={{ fontSize: "14px", alignContent: "center", alignItems: "center", fontWeight: "bold" ,  }}>TOTAL DEV <br />TIME <br /> REQUIRED</p></div>
                
                <div style={{ display: "flex", alignItems: "center" }}>
                  <p style={{ fontSize: "32px", fontWeight: '500', margin: 0 }}>{projects.totalDevTimeRequired}</p>
                  <p style={{ fontSize: "14px", marginLeft: "5px", margin: 0 }}>hours</p>
                </div>
                </div>
                
                {/* Additional elements */}
              </div>
            </Grid>
            {/* Bottom Right */}
            <Grid item xs={6} style={{ position: 'relative', display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end' }}>
              <Typography align="right">
                
                <img src={gitlab} alt="GitLab" style={{ width: "48px", height: "48px", cursor: 'pointer' }} onClick={() => { window.open(projects.gitWebUrl, '_blank')}}></img>
                {((isP001Allowed  && isP002Allowed && isP003Allowed && orgId===projects.projectOwner) ||isP005Allowed)  &&(
                <img src={notes} alt="notes" style={{ width: "48px", height: "48px", cursor: 'pointer' }} onClick={() => handleOpen(projects.projectId)} />)}
                {((isP001Allowed  && isP002Allowed && isP003Allowed && orgId===projects.projectOwner) ||isP005Allowed)  &&(
                <img src={trash} alt="trash" style={{ width: "48px", height: "48px", cursor: 'pointer' }} onClick={handleDeleteProject}></img>)}
              </Typography> 
            </Grid>
          </Grid>
        </CardContent>
      </Card>
     
<Card style={{
  width: '20%',
  height: '400px',
  marginLeft: '20px',
  border: '1px dotted #000',
  position: 'relative',
}}>
  {/* Dotted line */}
  <div style={{
    position: 'absolute',
    left: 0,
    right: 0,
    top: '50%',
    borderTop: '1px dotted #000',
    content: '',
  }}></div>

  {/* Images side by side */}
  <div style={{
    display: 'flex',
    justifyContent: 'space-between',
    padding: '20px', // Adjust the padding as needed
    boxSizing: 'border-box',
  }}>
    <img  src={
      projects.projectField === 'education'
        ? education
        : projects.projectField === 'livelihood'
        ? Livelihood1
        : projects.projectField === 'healthcare'
        ? healthcare
        : '' // You can specify a default image if none of the conditions match.
    }
    alt={
      projects.projectField === 'education'
        ? 'Education'
        : projects.projectField === 'livelihood'
        ? 'Livelihood'
        : projects.projectField === 'healthcare'
        ? 'Healthcare'
        : 'Default Alt Text' //
    }
    style={{ width: '48%', height: 'auto' }} />
     {orgdata && (
    <img src={orgdata.imgUrl} alt="Education" style={{ width: '48%', height: 'auto' }} />
  )}
  </div> 

  {/* Description below the horizontal line */}
  <div style={{
    position: 'absolute',
    left: 0,
    right: 0,
    top: '50%', // Adjust the position if needed
    transform: 'translateY(1px)', // Move down by the height of the dotted line
    padding: '20px', // Adjust the padding as needed
    boxSizing: 'border-box',
  }}>
    {orgdata && (
    <p>{orgdata.
      address1}</p>)}
  </div>
</Card>
    </div>
          ))}
          <Dialog open={open} onClose={handleClose} maxWidth="md" responsive>
            <DialogContent>
        <EditProject1 projectId={projectId} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ModifiedCard;
