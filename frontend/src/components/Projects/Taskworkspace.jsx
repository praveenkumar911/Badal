import React from "react";
import { Card, CardContent, Typography, Grid ,Dialog, DialogContent,Radio} from '@mui/material';
import gitlab from "../project/gitlab.svg";
import notes from "../project/notes.svg";
import trash from "../project/trash.svg";
import material from "../project/material.svg";
import info from "../project/info.svg";
import { useParams,useNavigate } from "react-router-dom";
import axios from 'axios';
import { useEffect,useState } from "react";
import Button from '@mui/material/Button';
import EditModule1 from "./editmodule1"; 
import Topbar3 from "./Topbar3";
import Topbar4 from "./Topbar4";
import CreateTask from "./Createtask";
import EditTask1 from "./edittask1";
const WorkSpacetask= (props) => { 
  const navigate = useNavigate(); 
  const { project } = useParams();
  const { module } = useParams();
  const[moduledata,setModuledata]=useState()
  const[taskdata,setTaskdata]=useState([])
  const [taskId, setTaskId] = useState("");
  const [open, setOpen] = useState(false);
  const [open1,setOpen1] =useState(false);
  const [open2,setOpen2] =useState(false);
  const permissionString = sessionStorage.getItem('permissions');
  const permissions = permissionString ? permissionString.split(',') : [];
  const orgId=sessionStorage.getItem('orgId')
  const userId=sessionStorage.getItem('userId')
  const [teams, setTeams] = useState([]);
  const isP001Allowed = permissions.includes('P001');
  const isP002Allowed = permissions.includes('P002');
  const isP003Allowed = permissions.includes('P003');
  const isP004Allowed = permissions.includes('P004');
  const isP005Allowed = permissions.includes('P005');
  const [usernames, setUsernames] = useState({});
  
  
  const handleOpen1 = () => { 
    setOpen1(true);
  };

  const handleClose1 = () => {
    setOpen1(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };  
  const handleOpen2 = (taskId) => {
    setTaskId(taskId);
    setOpen2(true);
  };

  const handleClose2 = () => {
    setOpen2(false);
  };
  const handleDownload = (link, documentType) => {
    if (link) {
      window.open(link, '_blank');
    } else {
      alert(`No ${documentType} found.`);
    }
  };
  useEffect(() => {
    axios
      .post("http://localhost:5030/get-workspaceData", { moduleid:module })
      .then(async (res) => {
        setModuledata(res.data);
      })
      .catch((err) => { 
        console.log(err);
      });
  }, [module]);
  useEffect(() => { 
    axios
      .post("http://localhost:5030/get-task-DB", { moduleid:module })
      .then(async (res) => {
        setTaskdata(res.data);
       
      })
      .catch((err) => {
        console.log(err);
      });
  }, [module]);
  
 
  const handleDeleteModule = () => { 
    axios.delete(`http://localhost:5030/delete-repo/${moduledata[0].forkedGitlabId}`)
      .then(() => {
        axios.delete(`http://localhost:5030/delete-module/${module}`) 
          .then((res) => {
            console.log(res.data);
            const logData = { 
              index: "badal",
              data: {
                message: `Project "${moduledata[0].moduleName}" deleted successfully from GitLab, local database, and NGO collection`,
                timestamp: new Date(),
              },
            };
           axios.post(`http://localhost:5030/log`, logData); 
        
            navigate(`/workspace`);
          })
          .catch((err) => {
            console.log(err);
            const logData = {
              index: "badal",
              data: {
                message: `Error deleting project "${moduledata[0].moduleName}": ${err.message}`,
                timestamp: new Date(),
              },
            };
            axios.post(`http://localhost:5030/log`, logData);
            // Show an error alert to the user
            alert(`Error deleting project "${moduledata[0].moduleName}": ${err.message}`);
          });
      })
      .catch((err) => {
        console.log(err);
        const logData = {
          index: "badal",
          data: {
            message: `Error deleting project "${moduledata[0].moduleName}": ${err.message}`,
            timestamp: new Date(),
          },
        };
        axios.post(`http://localhost:5030/log`, logData);
        // Show an error alert to the user
        alert(`Error deleting project "${moduledata[0].moduleName}": ${err.message}`);
      });
};
useEffect(() => {
  // Fetch all teams data 
  if (moduledata && moduledata.length > 0) {
    axios.get(`http://localhost:5030/get-user-by-teamid/${moduledata[0].assignedTeam}`)
      .then(response => {
        setTeams([response.data]);
      })
      .catch(error => {
        console.error('Error fetching teams data:', error);
      });
  }
}, [moduledata]);
 console.log(teams);
 const handleDeveloperChange = (event, taskgitId, taskid) => {
  const selectedIssueId = taskgitId; // Assuming taskId is the issueId
  const selectedValues = event.target.value.split(',');
  const selectedUserGitlabId = selectedValues[0];
  const selectedUserId = selectedValues[1];

  console.log('GitLab ID:', selectedUserGitlabId);
  console.log('User ID:', selectedUserId);

  // Get projectId from moduledata[0].forkedGitlabId
  const selectedProjectId = moduledata && moduledata.length > 0 ? moduledata[0].forkedGitlabId : null;

  // Make the API call to assign user to issue
  axios.post('http://localhost:5030/assign-issue', {
    projectId: selectedProjectId,
    issueId: selectedIssueId,
    userId: selectedUserGitlabId,
  })
  .then((response) => {
    console.log('User assigned to issue successfully:', response.data);

    // After successfully assigning the issue, update the task assignment
    axios.put(`http://localhost:5030/update-task-assignment/${taskid}`, {
      assignedto: selectedUserId,
    })
    .then((updateResponse) => {
      console.log('Task assignment updated successfully:', updateResponse.data);
      // Handle success if needed
    })
    .catch((updateError) => {
      console.error('Error updating task assignment:', updateError);
      // Handle error if needed
    });
  })
  .catch((error) => {
    console.error('Error assigning user to issue:', error);
    // Handle error if needed
  });
};


  return (
    <>
    <header>
    <Topbar4/>
    <Grid container xs={12} md={12} xl={12} sm={12} sx={{'@media (max-width: 1550px)': {
            minWidth: '2000px',
            overflowX: 'auto', 
            overflowY: 'hidden'
          },}}>
          <Grid item xs={7.25} md={7.25} xl={12} sm={7.25} style={{  marginLeft: "8vw", marginTop: "5vh",  }}> 
      {moduledata && moduledata.map((data) => (
    <div style={{ display: 'flex', alignItems: 'center' }}>
       <Card style={{ width: '68%', height: '400px', position: 'relative', border: '1px dotted #000' }} sx={{ '@media (max-width: 850px)': {
                  minWidth: '1000px',
                  overflowX: 'auto',  
                  
                },}}>
        <CardContent style={{ position: 'absolute', width: '100%', height: '100%' }}>
          <Grid container style={{ height: '100%' }}>
            {/* Top Left */}
            <Grid item xs={6} style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <Typography align="left" style={{fontWeight:"bold"}}>Description</Typography>
            <Typography style={{ marginLeft: '100px', width:"150%" }}> {data.moduleDescription}</Typography>
          </Grid>
            {/* Top Right */}
            <Grid item xs={6} style={{ position: 'relative', display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-end' }}>
      <Typography align="right">
        <span style={{ fontWeight: 'bold' }}>Date Added : </span>
        <span style={{  }}>{data.moduleDateCreated.substring(0, 10)}</span>
      </Typography>
    </Grid>
            {/* Bottom Left */}
            <Grid item xs={6} style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-end' }}>
            <div style={{ marginTop: 'auto' }}>
                <Typography align="left" style={{fontWeight:"bold"}}>Skills Required</Typography>
                {data.skillsRequired.map((skill) => (
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
                  <p style={{ fontSize: "32px", fontWeight: '500', margin: 0 }}>{data.totalDevTimeRequired}</p>
                  <p style={{ fontSize: "14px", marginLeft: "5px", margin: 0 }}>hours</p>
                </div>
                </div>
                
                {/* Additional elements */}
              </div>
            </Grid>
            {/* Bottom Right */}
            <Grid item xs={6} style={{ position: 'relative', display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end' }}>
              <Typography align="right">
                
                <img src={gitlab} alt="GitLab" style={{ width: "48px", height: "48px", cursor: 'pointer' }} onClick={() => { window.open(data.forkedGitlabUrl, '_blank')}}></img>
                { isP003Allowed  &&(
                <img src={notes} alt="notes" style={{ width: "48px", height: "48px", cursor: 'pointer' }} onClick={handleOpen1} />)}
                { isP004Allowed  &&(
                <img src={trash} alt="trash" style={{ width: "48px", height: "48px",cursor: 'pointer' }} onClick={() => handleDeleteModule(data.workspaceId)} ></img>)}
              </Typography>
            </Grid>
          </Grid>
        </CardContent> 
      </Card>
      <Card sx={{ height: '400px', width: '20.36vw',border: '1px dotted #000', borderRadius: '8px', marginLeft: '2vw', maxWidth: '65vw', '@media (max-width: 850px)': {
                  minWidth: '300px',
                  overflowX: 'auto', 
                },  }} >
      
        <Grid xs={2.5} md={2.5} xl={2.5} sm={2.5} style={{ height: '45vh', width: '20.36vw',  borderRadius: '8px', marginTop: '-1vw', maxWidth: '65vw' }}>
          <div style={{ height: '16%',  display: 'flex', borderRadius: '8px 8px 0 0 ' }}>
          <img src={info}alt="GitLab"style={{ width: "48px", height: "48px", marginTop:"1.5vw",marginLeft:"0.5vw" }}/>
          <p style={{marginTop:'2vw', fontSize:'20px', alignItems:"center", paddingLeft:"0.5vw",marginRight:"1vw",fontWeight: "bold"}}>ADDITIONAL INFORMATION </p>
 
          </div>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
      <div style={{ display: 'flex', alignItems: 'center', margin: '12px', width: '50%', cursor: 'pointer' }} onClick={() => handleDownload(data.requirementsDocument, 'Requirements Document')}>
                  <img src={material} alt="GitLab" style={{ width: "48px", height: "48px" }} />
                  <span style={{ marginLeft: '8px', fontSize: '16px', fontWeight: '500' }}>Requirements Document</span>
                </div> 

                {/* Download link for UI mocks */}
                <div style={{ display: 'flex', alignItems: 'center', margin: '12px', width: '50%', cursor: 'pointer' }} onClick={() => handleDownload(data.uiMocks, 'UI mocks')}>
                  <img src={material} alt="GitLab" style={{ width: "48px", height: "48px" }} />
                  <span style={{ marginLeft: '8px', fontSize: '16px', fontWeight: '500' }}>UI mocks</span>
                </div>

                {/* Download link for API Documentation */}
                <div style={{ display: 'flex', alignItems: 'center', margin: '12px', width: '50%', cursor: 'pointer' }} onClick={() => handleDownload(data.apiDocument, 'API Documentation')}>
                  <img src={material} alt="GitLab" style={{ width: "48px", height: "48px" }} />
                  <span style={{ marginLeft: '8px', fontSize: '16px', fontWeight: '500' }}>API Documentation</span>
                </div>
  
            <div style={{ display: 'flex', alignItems: 'center', margin: '12px', width: '50%', cursor: 'pointer' }} onClick={() => handleDownload(data.dbDocument, 'DB Documentation')}>
                  <img src={material} alt="GitLab" style={{ width: "48px", height: "48px" }} />
                  <span style={{ marginLeft: '8px', fontSize: '16px', fontWeight: '500' }}>DB DOCUMENTATION</span>
                </div>
  
  <div style={{ display: 'flex', alignItems: 'center', margin: '12px', width: '50%' }}>
    {/* <img src={material} alt="GitLab" style={{ width: "48px", height: "48px" }} />
    <span style={{ marginLeft: '8px', fontSize: '16px', fontWeight: '500' }}>OTHERS</span> */}
  </div>
</div>

</Grid>
        </Card>
    
    <Dialog open={open1} onClose={handleClose1} maxWidth="md" responsive>
      <DialogContent>
  <EditModule1 moduleId={module} projectId={project} />
  </DialogContent>
</Dialog>

    </div>
       ))}
        </Grid>

          

</Grid>
<div>
 { ((isP001Allowed ) ||isP005Allowed) && (
<Button  onClick={handleOpen} sx={{width: '60vw',height: '5vh',minHeight: '42px',borderRadius: '4px',background: '#D9D9D9',boxShadow: '2px 2px 4px 0px rgba(0, 0, 0, 0.25) inset, -2px -2px 4px 0px rgba(0, 0, 0, 0.25) inset', marginTop:"1vh",marginLeft: '8vw',display: 'flex',alignItems: 'center',justifyContent: 'center',fontSize: '24px','@media (max-width: 850px)': {
          minWidth: '1000px',
          overflowX: 'auto', 
          overflowY: 'hidden'
        }, '@media (max-width: 1550px)': {
          minWidth: '1150px',
          overflowX: 'auto', 
          overflowY: 'hidden'
        }}}  >
        <span style={{ marginRight: '8px', fontSize: '24px', color:" black" }}>+  Create Task</span>
      </Button>)}
      <Dialog open={open} onClose={handleClose} maxWidth="lg">
        <DialogContent>
        <CreateTask project={project} module={module}  responsive/>
        </DialogContent>
      </Dialog>
    </div>
    
<div>
    {taskdata && taskdata.map((data1) => (
        <Grid >
          <div>
          <div style={{display: "flex",alignItems: "center",flexDirection: "row"}}> 
          <Grid container spacing={1.5} sx={{ 
        
  maxWidth: '60vw', 
  margin: '2vw auto',
  border: '2px dotted #000', // add dotted border
  borderRadius: '8px',
  height: '72px',
  marginLeft:"8vw",
  position: 'relative', // add position relative to the container
  '@media (max-width: 850px)': {
    minWidth: '1000px',
    overflowX: 'auto', 
    marginRight: "5vh"
  },
  '@media (max-width: 1550px)': {
    minWidth: '900px',
    overflowX: 'auto', 
    overflowY: 'hidden'
  }
 


}}>
  <Grid item xs={3} sm={1} sx={{ 
    position: "sticky",
    top: 0,
    borderRight: '1px dashed #000', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center', 
    // backgroundColor: '#D9D9D9', 
    height: '100%', 
    borderRadius: '8px 0 0 8px',
    position: 'relative',
    
  }}>
    {/* Add the empty circle using ::before */}
    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',}}>
      <span style={{ display: 'block', width: '50px', height: '50px', border: '2px solid #000', borderRadius: '50%' ,backgroundColor:"#D5E8D4" }}></span>
    </div>
  </Grid>
  <Grid item xs={5} sm={8} sx={{
  borderLeft: '1px dashed #000',
  borderRight: ['none', '1px dashed #000'],
  padding: ['8px', '10px', '12px'],
  display: 'flex',
  justifyContent: 'space-between', // Align items to the top and distribute space evenly
  alignItems: 'flex-start', // Align items to the top

}}>
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  }}>
    <div style={{
      color: '#4E4E4E',
      fontFamily: 'Roboto',
      fontSize: '24px',
      fontStyle: 'normal',
      fontWeight: 500,
      lineHeight: 'normal',
      fontVariant: 'small-caps',
      letterSpacing: '0.96px',
      marginBottom: '5px',
    }}>
        {data1.taskName}
    </div>
    <div style={{ 
      color: '#4E4E4E',
      fontFamily: 'Roboto',
      fontSize: '12px',
      fontStyle: 'normal',
      fontWeight: 300,
      lineHeight: 'normal',
      letterSpacing: '0.48px',
      // marginLeft: '5vw',
      // marginTop:'-2vw' , // Add margin to create space between text and images
    }}>
          {data1.taskDescription.length > 220 ? data1.taskDescription.substring(0, 60) + "..." : data1.taskDescription}
    </div>
  </div>
 
  <div>
  { isP003Allowed  &&(
    <img src={notes} alt="Notes" style={{ width: '48px', height: '48px', marginTop: '-5px',cursor:'pointer' }} onClick={() => handleOpen2(data1.taskId)}/>
    )}
 
    <img src={gitlab} alt="GitLab" style={{ width: '48px', height: '48px', marginTop: '-5px',cursor:'pointer' }} onClick={() => { window.open(data1.gitWebUrl, '_blank')}} />
  </div>
</Grid>
<Grid item xs={3} sm={3} sx={{
  // borderRight: '1px dashed #000',
  display: 'flex',
  flexDirection: 'column', // Set to column to stack elements vertically
  alignItems: 'flex-start', // Align items to the top
  // backgroundColor: '#D9D9D9',
  borderRadius: '0 8px 8px 0',
  padding: '8px', // Add some padding for spacing
  
}}>
  <div style={{
    color: '#4E4E4E',
    // fontFamily: 'Roboto',
    fontSize: '16px',
    fontStyle: 'normal',
    fontWeight: 500,
    lineHeight: 'normal',
    fontVariant: 'small-caps',
    letterSpacing: '0.64px',
    display: 'flex',
    width: '9.6vw',
    height: '1.4vh',
    flexDirection: 'column',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop:'-10px'
    
    // Add margin to the right
  }}>
    Assigned To:
  </div>
  <div>
  <select
  id="assignedTo"
  name="assignedTo"
  style={{
    borderRadius: '4px',
    background: '#FFF',
    boxShadow: '2px 2px 4px 0px rgba(0, 0, 0, 0.25) inset, -2px -2px 4px 0px rgba(0, 0, 0, 0.25) inset',
    width: '10.4vw',
    height: '2.21vh',
    flexShrink: 0,
    marginTop:'10px',
    marginLeft:'2vw'
  }}
  onChange={(e) => handleDeveloperChange(e, data1.gitlabId,data1.taskId)}
>
  <option value="">Developers</option>
  {teams.map((team, index) => (
    <option  value={`${team.gitlabId},${team.userId}`}key={index}>
      {team.username}
    </option>
  ))}
</select>
  </div>

</Grid>

</Grid>
<div>
      <Grid item xs={12} md={12} xl={12} sm={12} style={{ margin: "2vh 0 2vh 0" }} >
  <button
    style={{
      width: "16vw",
      height: "5vh",
      borderRadius: "4px",
      backgroundColor: "#D9D9D9",
      // marginTop: "-9vh",
      // marginLeft: "auto",
      // marginRight: "10vw",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "28px",
      marginRight: "10vw",
      
    }}
  >
    <Radio value="a" name="radio-buttons"/>
    review
  </button>
  </Grid>
      </div>
          </div>
      
      </div>
      <Dialog open={open2} onClose={handleClose2} maxWidth="md" responsive>
      <DialogContent>
  <EditTask1 moduleId={module} projectId={project} taskId={taskId} moduleGitLabID={moduledata && moduledata[0].forkedGitlabId} />
  </DialogContent>
</Dialog>

 </Grid>
    ))}
    </div>

       </header>
    </>
  );
};

export default WorkSpacetask;
