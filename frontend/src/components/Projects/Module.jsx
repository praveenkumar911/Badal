import React, { useState } from "react";
import Topbar2 from "./Topbar2";
import { useParams } from "react-router-dom";
import Modulecard from "./Modulecard";
import { Grid,Dialog,DialogContent, } from "@mui/material";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ModifiedCard from "../Projects/modifiedcard";
import Button from '@mui/material/Button';
import CreateModule from "./createmodule";
  
export const Module = () => {
  const permissionString = sessionStorage.getItem('permissions');
  const permissions = permissionString ? permissionString.split(',') : [];
  const isP001Allowed = permissions.includes('P001');
  const isP002Allowed = permissions.includes('P002');
  const isP003Allowed = permissions.includes('P003');
  const isP004Allowed = permissions.includes('P004');
  const isP005Allowed= permissions.includes('P005')
  const orgId=sessionStorage.getItem('orgId')
  const userId=sessionStorage.getItem('userId')
  const { project } = useParams(); 
  const[projectId,setProjectId]=useState()
  const[projectOwner,setProjectOwner]=useState()
  useEffect(() => {
    axios
      .post("http://localhost:5030/get-projectdata", { projectName: project })
      .then(async (res) => {
        setProjectId(res.data[0].projectId);
        setProjectOwner(res.data[0].projectOwner);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  const[open1,setOpen1]=useState(false);

  const handleOpen1 = () => {
    setOpen1(true);
  };

  const handleClose1 = () => {
    setOpen1(false);
  };
  
 
  return (
    <div>
      <Topbar2/>
      <Grid container xs={12} md={12} xl={12} sm={12} >
          <Grid item xs={12} md={7.25} xl={12} sm={7.25} style={{ marginLeft: "8vw", marginTop: "5vh", }} sx={{'@media (max-width: 1550px)': {
            minWidth: '1200px',
            overflowX: 'auto', 
            overflowY: 'hidden'
          },}} >
          
   <ModifiedCard project={project}/>
            
          </Grid>

        

        </Grid>
     
      
        {((isP001Allowed  && orgId===projectOwner) ||isP005Allowed) && (
     <Button
        sx={{
          width: '94%',
          height: 'auto',
          maxWidth: '79.17vw',
          minHeight: '42px',
          borderRadius: '4px',
          background: '#D9D9D9',
          boxShadow: '2px 2px 4px 0px rgba(0, 0, 0, 0.25) inset, -2px -2px 4px 0px rgba(0, 0, 0, 0.25) inset',
          marginTop: '2vw',
          marginLeft: '8vw',
          marginRight: '5vw',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24px',
          '@media (max-width: 850px)': {
            minWidth: '1200px',
            overflowX: 'auto', 
            overflowY: 'hidden'
          },
        }}
        onClick={handleOpen1}
        // onClick={togglePopup}
      >
          <span style={{ marginRight: '0.42vw', fontSize: '24px', color: 'black' }}>+ ADD Module</span>
      </Button>
        )}
      <Dialog open={open1} onClose={handleClose1} maxWidth="xl" >
      <DialogContent>
  <CreateModule projectId={projectId}  responsive/>
  </DialogContent>
  
</Dialog>
      <Modulecard project={project} />
    </div>
  );
};  