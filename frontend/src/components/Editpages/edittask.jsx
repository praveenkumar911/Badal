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
  FormHelperText,
} from '@mui/material';
import axios from 'axios';

function EditTask(props) {
  const project = props.projectId;
  const module = props.moduleId;
  const taskId = props.taskId;
  const moduleGitLabID = props.moduleGitLabID;
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    projectid: project,
    moduleid: module,
    taskCreatedBy: '',
    taskName: '',
    taskTime: '', 
    taskDescription: '',
  });

  const [errors, setErrors] = useState({
    taskName: '',
    taskDescription: '',
    taskTime: '',
  });

  useEffect(() => {
    axios
      .post('http://10.8.0.14:5000/get-Taskby-id', { taskId })
      .then((response) => {
        const task = response.data[0];
      
        setFormData({
          projectid: task.projectId,
          moduleid: task.moduleId,
          taskCreatedBy: task.taskCreatedBy,
          taskName: task.taskName,
          taskTime: task.taskTime,
          taskDescription: task.taskDescription,
          GitlabID: task.gitlabId,
          GitWebUrl: task.gitWebUrl,
        });
      })
      .catch((error) => {
        console.error('Error fetching task details:', error);
        // TODO: handle error state
      });
  }, [taskId]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setErrors({
      ...errors,
      [name]: '', // Resetting errors when the field changes
    });
  };

  const handleEditTask = (event) => {
    event.preventDefault();

    // Validate Task Name
    if (!formData.taskName.trim()) {
      setErrors({ ...errors, taskName: 'Task Name is required' });
      return;
    }

    // Validate Task Description
    if (!formData.taskDescription.trim()) {
      setErrors({ ...errors, taskDescription: 'Task Description is required' });
      return;
    }

    // Validate Dev Time Required
    if (!formData.taskTime.trim() || isNaN(Number(formData.taskTime.trim()))) {
      setErrors({ ...errors, taskTime: 'Task Time must be a valid number' });
      return;
    }

    if (parseInt(formData.taskTime) <= 0) {
      setErrors({ ...errors, taskTime: 'Task time must be greater than 0' });
      return;
    }

    setIsLoading(true);

    const gitWebUrl = formData.GitWebUrl;
    const issueIid = gitWebUrl.split('/').pop();

    // Update the GitLab issue description first
    axios
      .put(`http://10.8.0.14:5000/edit-issue/${moduleGitLabID}/${issueIid}`, {
        taskName:formData.taskName,
        description: formData.taskDescription,
      })
      .then(() => {
        console.log('GitLab issue updated successfully!');

        // Log the GitLab issue update using the /log route
        axios
          .post('http://10.8.0.14:5000/log', {
            index: 'badal',
            data: {
              action: 'update-issue',
              moduleId: moduleGitLabID,
              issueIid: issueIid,
              description: formData.taskDescription,
            },
          })
          .then(() => {
            console.log('GitLab issue update logged successfully!');
          })
          .catch((error) => {
            console.error('Error logging GitLab issue update:', error);
            // TODO: handle error state
          });

        // Update the task in the database with the new data
        axios
          .put('http://10.8.0.14:5000/edit-task-DB', {
            taskid: taskId,
            tasksdata: formData,
          })
          .then((response) => {
            console.log('Task updated successfully!', response.data);

            // Log the task update using the /log route
            axios
              .post('http://10.8.0.14:5000/log', {
                index: 'badal',
                data: {
                  action: 'update-task',
                  taskId: taskId,
                  formData: formData,
                },
              })
              .then(() => {
                console.log('Task update logged successfully!');
                window.location.reload();
                // TODO: handle success state
              })
              .catch((error) => {
                console.error('Error logging task update:', error);
                // TODO: handle error state
              });
          })
          .catch((error) => {
            console.error('Error updating task in the database:', error);
            // TODO: handle error state
          });
      })
      .catch((error) => {
        console.error('Error updating GitLab issue:', error);
        // TODO: handle error state
      })
      .finally(() => {
        setIsLoading(false); // Set loading state off
      });
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
              <Typography variant="h4" sx={{ textAlign: 'center' }}>
               Edit Task
              </Typography>

              <Box display="flex" flexDirection="column" gap={2}>
                <Box display="flex" alignItems="center" gap={2}>
                  <Typography
                    style={{ minWidth: 120, fontWeight: 'bold' }}
                  >
                    Task Name:
                  </Typography>
                  <TextField
                    id="outlined-basic"
                    label="Task Name"
                    variant="outlined"
                    name="taskName"
                    value={formData.taskName}
                    onChange={handleInputChange}
                    error={Boolean(errors.taskName)}
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
                  <Typography
                    variant="subtitle2"
                    sx={{ color: 'red', fontSize: '20px' }}
                  >
                    *
                  </Typography>
                </Box>
                <FormHelperText style={{ marginLeft: '8vw', color: 'red' }}>
                  {errors.taskName}
                </FormHelperText>

                <Box display="flex" alignItems="center" gap={2}>
                  <Typography
                    style={{ minWidth: 120, fontWeight: 'bold' }}
                  >
                    Description:
                  </Typography>
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
                  <Typography
                    variant="subtitle2"
                    sx={{ color: 'red', fontSize: '20px' }}
                  >
                    *
                  </Typography>
                </Box>
                <FormHelperText style={{ marginLeft: '8vw', color: 'red' }}>
                  {errors.taskDescription}
                </FormHelperText>

                <Box display="flex" alignItems="center" gap={2}>
                  <Typography
                    style={{ minWidth: 120, fontWeight: 'bold' }}
                  >
                    Dev Time Required:
                  </Typography>
                  <TextField
                    id="outlined-basic"
                    label="Dev Time Required (in Hours)"
                    variant="outlined"
                    name="taskTime"
                    value={formData.taskTime}
                    onChange={handleInputChange}
                    error={Boolean(errors.taskTime)}
                    fullWidth
                    sx={{
                      '& .MuiInputBase-input': {
                        height: '20px',
                      },
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 'none',
                      },
                    }}
                  />
                  <Typography
                    variant="subtitle2"
                    sx={{ color: 'red', fontSize: '20px' }}
                  >
                    *
                  </Typography>
                </Box>
                <FormHelperText style={{ marginLeft: '8vw', color: 'red' }}>
                  {errors.taskTime}
                </FormHelperText>

                <Box mt={2} display="flex" justifyContent="flex-end">
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: '#0e66ac',
                      '&:hover': {
                        backgroundColor: '#66abe3',
                      },
                    }}
                    onClick={handleEditTask}
                  >
                    Update Task
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

export default EditTask;
