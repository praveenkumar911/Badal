import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Card,
  CardContent,
  Button,
  Backdrop,
  CircularProgress,
} from '@mui/material';
import axios from 'axios';

function CreateTask(props) {
  const { project, module } = props;
  const [moduledata, setModuledata] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    projectid: project,
    moduleId: module,
    taskCreatedBy: '',
    taskName: '',
    taskTime: '',
    taskDescription: '',
    completed: "0",
    assigned: "0",
    unassigned: "0"
  });

  const [errors, setErrors] = useState({
    taskName: '',
    taskDescription: '',
    taskTime: ''
  });

  // Fetch module data on component mount or when `module` changes
  useEffect(() => {
    if (module) {
      setIsLoading(true); // Start loading
      axios.get(`http://10.8.0.12:5000/modules/${module}`)
        .then((res) => {
          if (res.data) {
            setModuledata([res.data]); // Ensure data is in an array
          } else {
            console.error('Module data is not in expected format:', res.data);
          }
        })
        .catch((err) => {
          console.error('Error fetching module data:', err);
        })
        .finally(() => {
          setIsLoading(false); // End loading
        });
    } else {
      console.error('Module ID is not provided');
    }
  }, [module]);

  // Input change handler
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

  // Form submit handler
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validate form data
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

    if (!moduledata || moduledata.length === 0) {
      console.error('Module data is empty or not fetched properly');
      return;
    }

    setIsLoading(true); // Start loading

    const gitProjectName = moduledata[0].moduleName;
    const taskIds = moduledata[0].taskIds || [];
    const numTasks = taskIds.length + 1;

    // Generate the task ID
    const taskId = `${gitProjectName}-T-${numTasks}`;

    let gitlabIssueId = '';
    let gitlabIssueUrl = '';

    try {
      const response = await axios.post(`http://10.8.0.12:5000/create-issue/${moduledata[0].gitlabId}`, {
        title: formData.taskName,
        description: formData.taskDescription,
      });
      gitlabIssueId = response.data.iid; // Get the issue ID from the response
      gitlabIssueUrl = response.data.web_url; // Get the issue web URL from the response
    } catch (error) {
      console.error('Error creating GitLab issue:', error);
      await axios.post('http://10.8.0.12:5000/log', {
        index: 'My-logs',
        data: {
          message: `Error creating GitLab issue for task ${taskId}: ${error.message}`,
          timestamp: new Date(),
        },
      });
      return;
    }

    const formDataWithGitLab = {
      ...formData,
      gitlabIssueId,
      gitlabIssueUrl,
      taskId,
      moduleId: moduledata[0].moduleId,
      assignedto: '',
    };

    let newTask = null;

    try {
      const response = await fetch('http://10.8.0.12:5000/create-task-DB', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formDataWithGitLab),
      });

      if (!response.ok) {
        throw new Error('An error occurred while saving the task to the database.');
      }

      newTask = await response.json();
    } catch (error) {
      console.error('Error creating task:', error);
      await axios.post('http://10.8.0.12:5000/log', {
        index: 'badal',
        data: {
          message: `Error creating task ${taskId}: ${error.message}`,
          timestamp: new Date(),
        },
      });
      return;
    }

    try {
      const response = await fetch(`http://10.8.0.12:5000/module/${moduledata[0]._id}/tasks`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ taskIds: [...taskIds, newTask._id] }), // Add the task ID to the taskIds array in the module
      });

      if (!response.ok) {
        throw new Error('An error occurred while updating the module with the new task ID.');
      }

      await axios.post('http://10.8.0.12:5000/log', {
        index: 'badal',
        data: {
          message: `Updated module with new task ID ${newTask._id}`,
          timestamp: new Date(),
        },
      });
      window.location.reload();
    } catch (error) {
      console.error('Error updating module:', error);
      await axios.post('http://10.8.0.12:5000/log', {
        index: 'badal',
        data: {
          message: `Error updating module with new task ID ${newTask._id}: ${error.message}`,
          timestamp: new Date(),
        },
      });
      return;
    } finally {
      setIsLoading(false); // End loading
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
                        height: '30px',
                      },
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 'none',
                      },
                    }}
                  />
                  <Typography variant="subtitle2" sx={{ color: 'red', fontSize: '20px' }}>*</Typography>
                </Box>

                <Box display="flex" alignItems="center" gap={2}>
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
                        minHeight: '72px',
                      },
                      '& .MuiOutlinedInput-multiline': {
                        borderRadius: 'none',
                      },
                    }}
                  />
                  <Typography variant="subtitle2" sx={{ color: 'red', fontSize: '20px' }}>*</Typography>
                </Box>

                <Box display="flex" alignItems="center" gap={2}>
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
                        height: '30px',
                      },
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 'none',
                      },
                    }}
                  />
                  <Typography variant="subtitle2" sx={{ color: 'red', fontSize: '20px' }}>*</Typography>
                </Box>
              </Box>

              <Box display="flex" justifyContent="center" mt={3}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  onClick={handleSubmit}
                  sx={{
                    backgroundColor: '#4CAF50',
                    '&:hover': {
                      backgroundColor: '#45A049',
                    },
                    padding: '10px 20px',
                  }}
                >
                  Add Task
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Container>
    </>
  );
}

export default CreateTask;
