import React, { useState,useEffect } from 'react';
import {
  Container,
  Box, 
  Typography,
  TextField,
  Card,
  CardContent,
  Button,
  Backdrop,CircularProgress,
} from '@mui/material';
import axios from 'axios';
import material from "../project/material.svg";
import { FormHelperText } from '@material-ui/core';

function CreateTask(props) {
  const [devTime, setDevTime] = useState('');
  const { project, module } = props;
  const[moduledata,setModuledata]=useState()
  const [isLoading, setIsLoading] = useState(false); 
  console.log(project);
  console.log(moduledata)
  const [formData, setFormData] = useState({
    projectid: project, 
    workspaceId: module, 
    taskCreatedBy: '',
    taskName: '',
    taskTime: '',
    taskDescription: '',
    completed:"0",
    assigned:"0",
    unassigned:"0"
  }); 

  useEffect(() => {
    axios
      .post("http://localhost:5030/get-workspaceData", { moduleid:module })
      .then(async (res) => {
        setModuledata(res.data); 
      })
      .catch((err) => {
        console.log(err);
      });
  }, [module])

   console.log(moduledata)
   const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
    setErrors({
      ...errors,
      [name]: '', // Resetting errors when the field changes
    });
  };
  
  const [errors, setErrors] = useState({
    taskName: '',
    taskDescription: '',
    taskTime: '',
  });
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    
    const validationErrors = {};
  if (!formData.taskName.trim()) {
    validationErrors.taskName = 'Task Name is required';
  }
  if (!formData.taskDescription.trim()) {
    validationErrors.taskDescription = 'Task Description is required';
  }
  if (!formData.taskTime.trim() || isNaN(Number(formData.taskTime.trim()))) {
    validationErrors.taskTime = 'Task Time must be a valid number';
  }
  

  if (Object.keys(validationErrors).length > 0) {
    setErrors(validationErrors);
    return; // Stop form submission
  }

  setIsLoading(true);

    // Count the number of tasks in the Git project
    const gitProjectName = moduledata[0].gitProjectName;
    const taskIds = moduledata[0].taskIds;
    const numTasks = taskIds.length + 1;
  
    // Generate the task ID
    const taskId = `${gitProjectName}-T-${numTasks}`;
  
    // Create the GitLab issue with the new task ID 
    let gitlabIssueId = '';
    let gitlabIssueUrl = '';
    try { 
      const response = await axios.post(`http://localhost:5030/create-issue/${moduledata[0].forkedGitlabId}`, {
        title: formData.taskName,
        description: formData.taskDescription,
      });
      console.log('New GitLab issue created!', response.data);
      gitlabIssueId = response.data.iid; // Get the issue ID from the response
      gitlabIssueUrl = response.data.web_url; // Get the issue web URL from the response
    } catch (error) {
      console.error('Error creating GitLab issue:', error);
      const logData = {
        index: 'My-logs',
        data: {
          message: `Error creating GitLab issue for task ${taskId}: ${error.message}`,
          timestamp: new Date(),
        },
      }
      await axios.post('http://localhost:5030/log', logData);
      // TODO: handle error state
      
      return;
    }
  
    // Create the task in the database 
    const formDataWithGitLab = {
      ...formData,
      gitlabIssueId,
      gitlabIssueUrl,
      taskId,
      moduleId:moduledata[0].moduleId,
      assignedto:'',
    };
    let newTask = null;
    try {
      const response = await fetch('http://localhost:5030/create-task-DB', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formDataWithGitLab),
      });
  
      if (!response.ok) {
        throw new Error(
          'An error occurred while saving the task to the database.'
        );
      }
  
      newTask = await response.json();
      console.log('New task added to collectionTask collection!', newTask);
      // TODO: handle success state
    } catch (error) {
      console.error('Error creating task:', error);
      const logData = {
        index: 'badal',
        data: {
          message: `Error creating task ${taskId}: ${error.message}`,
          timestamp: new Date(),
        },
      };
      await axios.post('http://localhost:5030/log', logData);
      // TODO: handle error state
      return;
    }
  
    // Update the module with the new task ID
    try {
      const response = await fetch(`http://localhost:5030/module/${moduledata[0]._id}/tasks`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ taskIds: [...taskIds, newTask._id] }), // Add the task ID to the taskIds array in the module
      });
  
      if (!response.ok) {
        throw new Error(
          'An error occurred while updating the module with the new task ID.'
        );
      }
      console.log('Module updated with new task ID!');
      const logData = {
        index: 'badal',
        data: {
          message: `Updated module with new task ID ${newTask._id}`,
          timestamp: new Date(),
        },
      };
      await axios.post('http://localhost:5030/log', logData);
      window.location.reload()
    } catch (error) {
      console.error('Error updating module:', error);
      const logData = {
        index: 'badal',
        data: {
          message: `Error updating module with new task ID ${newTask._id}: ${error.message}`,
          timestamp: new Date(),
        },
      };
      await axios.post('http://localhost:5030/log', logData);
      // TODO: handle error state
      return;
    }finally {
      setIsLoading(false); // Set loading state off
    }
  
  };

  return (
    <>
    <Backdrop open={isLoading} style={{ zIndex: 9999 }}>
        <CircularProgress color="inherit" />
      </Backdrop>

    <Container>
      <Box mt={4}>
        <Card variant="outlined" sx={{ maxWidth: 500 }}>
          <CardContent>
            <Typography variant="h4" sx={{ textAlign: "center" }}>Add a new Task</Typography>

            <Box display="flex" flexDirection="column" gap={2}>
              <Box display="flex" alignItems="center" gap={2}>
                <Typography style={{ minWidth: 120, fontWeight: "bold" }}>Task Name:</Typography>
                <TextField
  id="outlined-basic"
  label="Task Name"
  variant="outlined"
  name="taskName" 
  value={formData.taskName}
  onChange={handleInputChange}
  error={Boolean(errors.taskName)}
  helperText={errors.taskName}
  fullWidth
  
                sx={{
                  '& .MuiInputBase-input': {
                    height: '30px', // Adjust the height as needed
                  },
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 'none', // You can adjust the border radius or any other styles here
                  },
                }}
              />
                <Typography variant="subtitle2" sx={{ color: 'red', fontSize: '20px' }}>*</Typography>
              </Box>
              

              <Box display="flex" alignItems="center" gap={2} >
                <Typography style={{ minWidth: 120, fontWeight: "bold" }}>Description:</Typography>
                <TextField
  id="outlined-multiline-static"
  label="Description"
  multiline
  rows={4}
  variant="outlined"
  name="taskDescription"
  value={formData.taskDescription}
  onChange={handleInputChange}
  error={Boolean(errors.taskDescription)}
  helperText={errors.taskDescription}
  fullWidth

                  sx={{
                    '& .MuiOutlinedInput-inputMultiline': {
                      minHeight: '72px', // Adjust the min-height as needed
                    },
                    '& .MuiOutlinedInput-multiline': {
                      borderRadius: 'none', // You can adjust the border radius or any other styles here
                    },
                  }}
                />
                <Typography variant="subtitle2" sx={{ color: 'red', fontSize: '20px' }}>*</Typography>
              </Box>
             
      

              <Box display="flex" alignItems="center" gap={2} >
                <Typography style={{ minWidth: 120, fontWeight: "bold" }}>Dev Time Required:</Typography>
                <TextField
                id="outlined-basic"
                label="Dev Time Required (in Hours)"
                variant="outlined"
                name="taskTime" 
                value={formData.taskTime}
                onChange={handleInputChange}
                error={Boolean(errors.taskTime)}
                helperText={errors.taskTime}
                fullWidth
  
                sx={{
                  '& .MuiInputBase-input': {
                    height: '30px', // Adjust the height as needed
                  },
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 'none', // You can adjust the border radius or any other styles here
                  },
                }}
              />
                <Typography variant="subtitle2" sx={{ color: 'red', fontSize: '20px' }}>*</Typography>
              </Box>
              

              <Box mt={2} display="flex" justifyContent="flex-end">
             {/*  <Button variant='outlined' sx={{ marginRight: '8px' }}>Cancel</Button> */}
              <Button
                variant="contained"
                sx={{
                  backgroundColor: '#0e66ac',
                  '&:hover': {
                    backgroundColor: '#66abe3',
                  },
              
                }}
                onClick={handleSubmit}
              >
                Add Task
              </Button>
            </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
    </>
  );
}

export default CreateTask;
