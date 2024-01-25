import Topbar3 from "./Topbar3";
import notes from "../project/notes.svg";
import gitlab from "../project/gitlab.svg";

import React, { useState,useEffect } from "react";

import { useParams,useNavigate } from "react-router-dom";

import { Box, Grid,Radio,Dialog, DialogContent } from "@mui/material";
import axios from "axios";

import TaskCard from "./taskcard";
import Button from '@mui/material/Button';
import EditTask1 from "./edittask1";
import CreateTask from "./Createtask";

export const InnerMod = () => {
  const { module } = useParams();
  const {project}=useParams();
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
  return (
    <header>

 
      <div>
      <Topbar3 />

    
      
      <Grid container xs={12} md={12} xl={12} sm={12} sx={{'@media (max-width: 1550px)': {
            minWidth: '2000px',
            overflowX: 'auto', 
            overflowY: 'hidden'
          },}}>
          <Grid item xs={7.25} md={7.25} xl={12} sm={7.25} style={{  marginLeft: "8vw", marginTop: "5vh",  }}>
            
            <TaskCard module={module} project={project}/>
            
          </Grid>

          

        </Grid>
   
{ isP001Allowed && isbelongsto &&(
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
    { isP003Allowed && isbelongsto &&(
    <img src={notes} alt="Notes" style={{ width: '48px', height: '48px', marginTop: '-5px',cursor:'pointer' }} onClick={() => handleOpen2(data1._id)}/>)}
    <img src={gitlab} alt="GitLab" style={{ width: '48px', height: '48px', marginTop: '-5px',cursor:'pointer' }} onClick={() => { window.open(data1.GitWebUrl, '_blank')}} />
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
    <select id="assignedTo" name="assignedTo" style={{
      borderRadius: '4px',
      background: '#FFF',
      boxShadow: '2px 2px 4px 0px rgba(0, 0, 0, 0.25) inset, -2px -2px 4px 0px rgba(0, 0, 0, 0.25) inset',
      width: '10.4vw',
      height: '2.21vh',
      flexShrink: 0,
      marginTop:'10px',
      marginLeft:'2vw'
    }}>
      <option value="">Devlopers</option>
      <option value="option1">dev 1</option>
      <option value="option2">dev 2</option>
      <option value="option3">dev 3</option>
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
      

 </Grid>
    ))}
     
<Dialog open={open2} onClose={handleClose2} maxWidth="md" responsive>
  <DialogContent>
  <EditTask1 moduleId={module} projectId={project} taskId={taskId} moduleGitLabID={moduledata && moduledata[0].GitlabID} />
  </DialogContent>
</Dialog> 
</div>
    </header>
  );
};