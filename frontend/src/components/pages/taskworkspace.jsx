import React, { useState, useEffect } from "react";
import { Box, Typography, Grid, Card, Divider, Paper, FormControl, InputLabel, MenuItem, Select, TableContainer, Table, TableBody, TableCell, TableRow, TableHead, Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import { tableCellClasses } from "@mui/material/TableCell";
import { useLocation,useParams } from "react-router-dom";
import LinkIcon from "@mui/icons-material/Link";
import Chip from "@mui/material/Chip";
import {Dialog,DialogContent, } from "@mui/material";
import CreateTask from "../Sub-Pages/createtask";
import axios from "axios";
import GitHubIcon from "@mui/icons-material/GitHub";
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
    fontSize: 18,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));
const dummyTasks = [
  {
    _id: "1",
    name: "Task 1",
    description: "Description for task 1",
    status: "ONGOING",
    assigned_to: { _id: "1", name: "John Doe" },
  },
  {
    _id: "2",
    name: "Task 2",
    description: "Description for task 2",
    status: "COMPLETED",
    assigned_to: { _id: "2", name: "Jane Doe" },
  },
];

const dummyTeamMembers = [
  { _id: "1", name: "John Doe" },
  { _id: "2", name: "Jane Doe" },
  { _id: "3", name: "Alice Smith" },
];


function Taskworkspace() {
  const allStatus = ["Ongoing", "Completed"];
  const [status, setStatus] = useState("");
  const [taskList, setTaskList] = useState([]);
  const [teamMembers, setTeamMembers] = useState(dummyTeamMembers);
  const location = useLocation();
  const { moduleId } = useParams();
  const [moduleDetails, setModuleDetails] = useState(null);
  const [open, setOpen] = useState(false);
  const [teams, setTeams] = useState([]);
  const [usernames, setUsernames] = useState({});
  const [sta, setSta] = useState("");
  const permissionString = localStorage.getItem("permissions");
  const permissions = permissionString ? permissionString.split(",") : [];
  const isP005Allowed = permissions.includes("P005");
  const isP006Allowed = permissions.includes("P006");
  const isP001Allowed = permissions.includes("P001");
  const isP002Allowed = permissions.includes("P002")
  const isP003Allowed = permissions.includes("P003")
  const isP004Allowed = permissions.includes("P004")

  const handleOpen = () => {
    setOpen(true);
  };

  const handleDownload = (link, documentType) => {
    if (link) {
      window.open(link, "_blank");
    } else {
      alert(`No ${documentType} found.`);
    }
  };

  useEffect(() => { 
    async function fetchModuleDetails() {
        try {
          const response = await axios.post(`http://10.8.0.14:5000/get-workspaceData/${moduleId}`);
          const data = response.data;
          if (data.length > 0) {
            setModuleDetails(data[0]); // Assuming you're only expecting one module detail object
          } else {
            console.error("No module details found for the provided moduleId");
          }
        } catch (error) {
          console.error("Error fetching module details:", error);
        }
      }
      
    fetchModuleDetails();
  }, [moduleId]);

   useEffect(() => {
    axios
      .post(`http://10.8.0.14:5000/get-task-DB-byworkspaceID/${moduleId}`)
      .then((res) => {
        setTaskList(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [moduleId]);

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (moduleDetails && moduleDetails.assignedTeam) {
      axios
        .get(`http://10.8.0.14:5000/get-user-by-teamid/${moduleDetails.assignedTeam}`)
        .then((response) => {
          setTeams(response.data);
          const userIds = response.data.map((team) => team.userId); 
          fetchUsernames(userIds);
        })
        .catch((error) => {
          console.error("Error fetching teams data:", error);
        });
    }
  }, [moduleDetails]);

  const fetchUsernames = (userIds) => {
    axios
      .post("http://10.8.0.14:5000/get-usernames", { userIds })
      .then((response) => {
        const fetchedUsernames = response.data.usernames;
        const userToUsernameMap = {};
        userIds.forEach((userId, index) => {
          if (fetchedUsernames[index]) {
            userToUsernameMap[userId] = fetchedUsernames[index];
          }
        });
        setUsernames(userToUsernameMap);
      })
      .catch((error) => {
        console.error("Error fetching usernames:", error);
      });
  };

  const stringToDate = (dateString) => {
    if (dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } else {
      return "N/A"; // Handle cases where dateString is not available
    }
  };

  const handleStatusChange = (event, prod) => {
    setStatus(event.target.value);

    setTaskList((prevTasks) =>
      prevTasks.map((task) =>
        task._id === prod._id ? { ...task, status: event.target.value } : task
      )
    );
    alert(`Task status has been updated to ${event.target.value.toLowerCase()}`);
  };
 
  const handleAssignedToChange = async (event, task) => {
    const selectedUserId = event.target.value;
    const assignedUser = teamMembers.find((member) => member._id === selectedUserId);
    try {
      // Step 1: Fetch the GitLab ID of the selected user
      const userResponse = await axios.get(`http://10.8.0.14:5000/get-user/${selectedUserId}`);
      console.log(userResponse);
      const selectedUserGitlabId = userResponse.data[0].gitlabId;
  
      // Step 2: Send a POST request to assign the issue on GitLab
      const projectGitlabId = moduleDetails.forkedGitlabId; // Assuming moduleDetails contains the GitLab project ID
      const issueId = task.gitlabId; // Assuming each task has a GitLab issue ID 
   
      await axios.post('http://10.8.0.14:5000/assign-issue', {
        projectId: projectGitlabId,
        issueId: issueId,
        userId: selectedUserGitlabId,
      });
  
      // Step 3: Update the task assignment in your local database
      await axios.put(`http://10.8.0.14:5000/update-task-assignment/${task.taskId}`, {
        assignedto: selectedUserId,
      });
  
      // Update the state
      setTaskList((prevTasks) =>
        prevTasks.map((t) =>
          t._id === task._id ? { ...t, assigned_to: assignedUser } : t
        )
      );
  
      alert(`Task has been assigned to ${assignedUser.name}`);
    } catch (error) {
      console.error("Error assigning task:", error);
      alert("Assigned successfully");
    }
  }
  const [completedStatus, setCompletedStatus] = useState('');

  // Fetch initial completed status when component mounts
  useEffect(() => {
    if (moduleDetails) {
      setCompletedStatus(getDefaultValue());
    }
  }, [moduleDetails]);

  const getDefaultValue = () => {
    switch (moduleDetails.completed) {
      case '1':
        return 'completed';
      case '0':
        return 'ongoing';
      case '2':
        return 'review';
      default:
        return '';
    }
  };
  const handleMStatusChange = async (event) => {
    const statusLabel = event.target.value;
    let completedValue = '';
  
    // Map status label to numeric value
    switch (statusLabel) {
      case 'completed':
        completedValue = '1';
        break;
      case 'review':
        completedValue = '2';
        break;
      case 'ongoing':
        completedValue = '0';
        break;
      default:
        break;
    }
  
    setCompletedStatus(statusLabel); // Update local state with label (optional)
  
    // Make API call to update completed status
    try {
      const response = await fetch(`http://10.8.0.14:5000/updateCompleted/${moduleDetails.moduleId}/${moduleDetails.workspaceId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completed: completedValue }), // Send numeric value to server
      });
  
      if (!response.ok) {
        throw new Error('Failed to update module/workspace completed status');
      }
  
      // Optionally, handle success scenario
    } catch (error) {
      console.error('Error updating module/workspace:', error);
      // Handle error scenario, e.g., show an error message to the user
      alert('Failed to update module/workspace completed status');
    }
  };
  
  const handleTaskStatusChange = async (event, task) => {
    const statusLabel = event.target.value;
    let statusValue = '';
  
    // Map statusLabel to appropriate value
    switch (statusLabel) {
      case 'completed':
        statusValue = '1';
        break;
      case 'ongoing':
        statusValue = '0';
        break;
      case 'review':
        statusValue = '2';
        break;
      default:
        break;
    }
  
    try {
      const response = await fetch(`http://10.8.0.14:5000/issue/update-completed`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          taskworkId: task.taskworkId,
          completed: statusValue,
        }),
      });
  
      if (response.ok) {
        // Update local state immediately to reflect the change in UI
        setTaskList((prevTasks) =>
          prevTasks.map((t) =>
            t._id === task._id ? { ...t, completed: statusValue } : t
          )
        );
      } else {
        console.error("Failed to update task completed status");
      }
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };
  
  

  
  return (
    <>
      <Box component="main" sx={{ flexGrow: 1, paddingLeft: 10, paddingRight: 10 }}>
        <Typography style={{ paddingTop: 20, fontSize: "24px", fontWeight: "bold" }}>
          <center>Module Details Page</center>
        </Typography>
        <Divider sx={{ marginBottom: "20px" }} />
        {moduleDetails && (
        <Card sx={{ width: "100%", backgroundColor: "#f7f9fe" }}>
          <Grid container>
            <Grid item xs={10.5}>
              <Typography style={{ padding: 20, fontSize: "22px", fontWeight: "500" }}>
              {moduleDetails.workspaceName}
              </Typography>
            </Grid>
            <Grid item xs={1.5}>
              <FormControl sx={{ m: 1, minWidth: 130 }}>
                <InputLabel id="demo-simple-select-autowidth-label">Status</InputLabel>
                <Select
        labelId="module-status-label"
        id="module-status"
        value={completedStatus}
        onChange={handleMStatusChange}
        label="Module Status"
      >
        <MenuItem value="completed" disabled={!isP005Allowed}>Completed</MenuItem>
        <MenuItem value="ongoing">Ongoing</MenuItem>
        <MenuItem value="review">Review</MenuItem>
      </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Typography variant="h6" color="text.secondary" style={{ paddingLeft: 20, marginBottom: 20 }}>
          {moduleDetails.workspaceDescription}
          </Typography>
          <Grid container sx={{ marginBottom: 3, flexDirection: "column", alignItems: "flex-end",paddingRight: "30px" }}>
            <Grid item xs={2}>
              <ul>
                <li>
                  <Typography display="flex" color="text.secondary" sx={{ justifyContent: "center", alignContent: "Center", paddingTop: "16px", fontSize: "14px" }}>
                  Start Date: {stringToDate(moduleDetails.moduleDateStart)}
                  </Typography>
                </li>
              </ul>
            </Grid>
            <Grid item xs={2}>
              <ul>
                <li>
                  <Typography display="flex" color="text.secondary" sx={{ justifyContent: "center", alignContent: "Center", paddingTop: "16px", fontSize: "14px" }}>
                  End Date: {stringToDate(moduleDetails.moduleDateEnd)}
                  </Typography>
                </li>
              </ul>
            </Grid>
            </Grid>
            <Grid container sx={{ marginBottom: 3, flexDirection: "column" }}>
           
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, marginTop: 1, alignItems: 'center' }}>
              <Typography variant="h6" sx={{ marginLeft: 2, marginRight: 2 }}>Skills</Typography>
              {moduleDetails.skillsRequired.map((skill, index) => (
                <Chip
                  key={index}
                  label={skill.name}
                  variant="outlined"
                  color="primary"
                  sx={{ margin: '2px' }} // Add some margin for better spacing
                />
              ))}
            </Box>
            <Grid item xs={2}  sx={{justifyContent: "flex-end"}} >
                
                <Typography display="flex" sx={{ paddingLeft: "10px", paddingTop: "16px" }}>
                  <GitHubIcon fontSize="large" sx={{ marginLeft: 1, marginTop: 2 }}  onClick={() => {
                    window.open(moduleDetails.forkedGitlabUrl, "_blank");
                  }} /> 
                </Typography>
             
            
          </Grid>
          </Grid>
          <Divider />
          <Grid container sx={{ marginBottom: 3 }}>
            <Grid item xs={3}>
              <ul>
                <li>
                  <Typography display="flex" sx={{ justifyContent: "center", alignContent: "Center", paddingTop: "16px", fontSize: "14px" }}>
                    Requirements
                  </Typography>
                </li>
                <li>
                  <Typography display="flex" sx={{ justifyContent: "center", alignContent: "Center", paddingTop: "16px", fontSize: "14px" }}>
                    <LinkIcon onClick={() => handleDownload(moduleDetails.requirementsDocument, 'Requirements Document')}/>
                  </Typography>
                </li>
              </ul>
            </Grid>
            <Grid item xs={3}>
              <ul>
                <li>
                  <Typography display="flex" sx={{ justifyContent: "center", alignContent: "Center", paddingTop: "16px", fontSize: "14px" }}>
                    UI-Screen
                  </Typography>
                </li>
                <li>
                  <Typography display="flex" sx={{ justifyContent: "center", alignContent: "Center", paddingTop: "16px", fontSize: "14px" }}>
                    <LinkIcon onClick={() => handleDownload(moduleDetails.uiMocks, 'UI mocks')}/>
                  </Typography>
                </li>
              </ul>
            </Grid>
            <Grid item xs={3}>
              <ul>
                <li>
                  <Typography display="flex" sx={{ justifyContent: "center", alignContent: "Center", paddingTop: "16px", fontSize: "14px" }}>
                    API-Build
                  </Typography>
                </li>
                <li>
                  <Typography display="flex" sx={{ justifyContent: "center", alignContent: "Center", paddingTop: "16px", fontSize: "14px" }}>
                    <LinkIcon onClick={() => handleDownload(moduleDetails.apiDocument, 'API Documentation')} />
                  </Typography>
                </li>
              </ul>
            </Grid>
            <Grid item xs={3}>
              <ul>
                <li>
                  <Typography display="flex" sx={{ justifyContent: "center", alignContent: "Center", paddingTop: "16px", fontSize: "14px" }}>
                    DB-Build
                  </Typography>
                </li>
                <li>
                  <Typography display="flex" sx={{ justifyContent: "center", alignContent: "Center", paddingTop: "16px", fontSize: "14px" }}>
                    <LinkIcon onClick={() => handleDownload(moduleDetails.dbDocument, 'DB Documentation')} />
                  </Typography>
                </li>
              </ul>
            </Grid>
          </Grid>
        </Card>
        )}
        <Typography variant="h5" style={{ paddingTop: 20 }}>
          <center>Tasks</center>
        </Typography>
        <Grid container sx={{ marginBottom: 3 }}>
          <Grid item xs={10.2}></Grid>
          <Grid item xs={1.8}>
          </Grid>
        </Grid>

        <Divider sx={{ marginBottom: "20px" }} />
        <TableContainer component={Paper}>
          <Table stickyHeader aria-label="a dense table">
            <TableHead>
              <TableRow>
                <StyledTableCell align="left">Task Name</StyledTableCell>
                <StyledTableCell align="left">Description</StyledTableCell>
                <StyledTableCell align="right">Status</StyledTableCell>
                <StyledTableCell align="right">Assigned To</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {taskList.map((project) => (
                <StyledTableRow key={project._id}>
                  <TableCell align="left">{project.taskName}</TableCell>
                  <TableCell align="left">{project.taskDescription}</TableCell>
                  <TableCell align="right">
                  <FormControl>
          <InputLabel>Status</InputLabel>
          <Select
          value={project.completed === '1' ? 'completed' : 'ongoing'}
          onChange={(event) => handleTaskStatusChange(event, project)}
          label="Status"
        >
          <MenuItem value="completed">Completed</MenuItem>
          <MenuItem value="ongoing">Ongoing</MenuItem>
        </Select>
        </FormControl>
                  </TableCell>
                  <TableCell align="right">
                  <FormControl sx={{ minWidth: 120, minHeight: 20 }}>
          <InputLabel htmlFor="assigned">Assigned To</InputLabel>
          <Select
            value={project.assignedto || ""}
            onChange={(e) => handleAssignedToChange(e, project)}
            label="Assigned To"
          >
            {teams?.map((team) => (
              <MenuItem key={team._id} value={team.userId}>
                {team.username}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
                  </TableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <Dialog open={open} onClose={handleClose} maxWidth="md">
        <DialogContent>
         <CreateTask moduledata={moduleDetails} module={moduleId}/>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default Taskworkspace;
