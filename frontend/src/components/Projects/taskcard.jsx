import React from "react";
import { Card, CardContent, Typography, Grid ,Dialog, DialogContent} from '@mui/material';
import gitlab from "../project/gitlab.svg";
import notes from "../project/notes.svg";
import trash from "../project/trash.svg";
import material from "../project/material.svg";
import info from "../project/info.svg";
import { useParams,useNavigate } from "react-router-dom";
import axios from 'axios';
import { useEffect,useState } from "react";

import EditModule1 from "./editmodule1";

const TaskCard= (props) => { 
  const navigate = useNavigate(); 
  const  module  = props.module
  const project =props.project
  const[moduledata,setModuledata]=useState()
  const[taskdata,setTaskdata]=useState([])
  const [taskId, setTaskId] = useState("");
  const [open, setOpen] = useState(false);
  const [open1,setOpen1] =useState(false);
  const [open2,setOpen2] =useState(false);
  const permissionString = sessionStorage.getItem('permissions');
  const permissions = permissionString ? permissionString.split(',') : [];
  const entityID=sessionStorage.getItem('entityID')
  const isP001Allowed = permissions.includes('P001');
  const isP002Allowed = permissions.includes('P002');
  const isP003Allowed = permissions.includes('P003');
  const isP004Allowed = permissions.includes('P004');
  const[projectarray,setprojectarray]=useState() 
  useEffect(() => {
    if (isP001Allowed) {
      const fetchNgosForEntity = async () => {
        try {
          const res = await axios.get(`http://localhost:5030/get-org/${entityID}`);
          // Automatically set the project owner based on the fetched organization name
          if (res.data && res.data['projects']) {
            setprojectarray(res.data['projects']);
          }
        } catch (error) {
          console.log(error);
        }
      };
      fetchNgosForEntity();
    }
  }, [isP001Allowed, entityID]);
 console.log(projectarray);
console.log(project)
const isbelongsto = projectarray && projectarray.includes(project);
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
      .post("http://localhost:5030/get-moduleData", { moduleid:module })
      .then(async (res) => {
        //setusefulData(res.data[0]);
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
        //setusefulData(res.data[0]);
        setTaskdata(res.data);
       
      })
      .catch((err) => {
        console.log(err);
      });
  }, [module]);
  //	console.log(moduledata[0].GitlabID)
  const handleDeleteModule = () => {
    axios.delete(`http://localhost:5030/delete-repo/${moduledata[0].GitlabID}`);
     
    axios.delete(`http://localhost:5030/delete-module/${module}`)
      .then((res) => {
        console.log(res.data);
        axios.put(`http://localhost:5030/delete-module-ids/${project}`, { moduleIds: [module] })
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
        
            navigate(`/module/${project}`);
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
  return (
    <>
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
                
                <img src={gitlab} alt="GitLab" style={{ width: "48px", height: "48px", cursor: 'pointer' }} onClick={() => { window.open(data.GitWebUrl, '_blank')}}></img>
                { isP003Allowed && isbelongsto &&(
                <img src={notes} alt="notes" style={{ width: "48px", height: "48px", cursor: 'pointer' }} onClick={handleOpen1} />)}
                { isP004Allowed && isbelongsto &&(
                <img src={trash} alt="trash" style={{ width: "48px", height: "48px",cursor: 'pointer' }} onClick={() => handleDeleteModule(data._id)} ></img>)}
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
      <div style={{ display: 'flex', alignItems: 'center', margin: '12px', width: '50%', cursor: 'pointer' }} onClick={() => handleDownload(data.RequirementsDocument, 'Requirements Document')}>
                  <img src={material} alt="GitLab" style={{ width: "48px", height: "48px" }} />
                  <span style={{ marginLeft: '8px', fontSize: '16px', fontWeight: '500' }}>Requirements Document</span>
                </div>

                {/* Download link for UI mocks */}
                <div style={{ display: 'flex', alignItems: 'center', margin: '12px', width: '50%', cursor: 'pointer' }} onClick={() => handleDownload(data.UIMocks, 'UI mocks')}>
                  <img src={material} alt="GitLab" style={{ width: "48px", height: "48px" }} />
                  <span style={{ marginLeft: '8px', fontSize: '16px', fontWeight: '500' }}>UI mocks</span>
                </div>

                {/* Download link for API Documentation */}
                <div style={{ display: 'flex', alignItems: 'center', margin: '12px', width: '50%', cursor: 'pointer' }} onClick={() => handleDownload(data.APIDocument, 'API Documentation')}>
                  <img src={material} alt="GitLab" style={{ width: "48px", height: "48px" }} />
                  <span style={{ marginLeft: '8px', fontSize: '16px', fontWeight: '500' }}>API Documentation</span>
                </div>
  
            <div style={{ display: 'flex', alignItems: 'center', margin: '12px', width: '50%', cursor: 'pointer' }} onClick={() => handleDownload(data.DBDocument, 'DB Documentation')}>
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
    </>
  );
};

export default TaskCard;
