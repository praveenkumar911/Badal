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
import { useNavigate } from "react-router-dom";

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

function Task() {
  const allStatus = ["Ongoing", "Completed"];
  const navigate=useNavigate()
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
  const orgId = localStorage.getItem("orgId"); // Retrieve orgId

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
        const response = await fetch(`http://10.8.0.12:5000/modules/${moduleId}`);
        const data = await response.json();
        setModuleDetails(data);
      } catch (error) {
        console.error("Error fetching module details:", error);
      }
    }

    fetchModuleDetails();
  }, [moduleId]);

  useEffect(() => {
    axios
      .get(`http://10.8.0.12:5000/tasks/${moduleId}`)
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
    if (moduleDetails && moduleDetails.teamsAssigned) {
      axios
        .get(`http://10.8.0.12:5000/get-user-by-teamid/${moduleDetails.teamsAssigned[0]}`)
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
      .post("http://10.8.0.12:5000/get-usernames", { userIds })
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

  const handleModuleStatus = (event, prod) => {
    alert(`Module status updated to ${prod.props.children.toUpperCase()}`);
  };

  


 
  const handleAssignedToChange = async (event, task) => {
    const selectedUserId = event.target.value;
    const assignedUser = teamMembers.find((member) => member._id === selectedUserId);
    try {
      // Step 1: Fetch the GitLab ID of the selected user
      const userResponse = await axios.get(`http://10.8.0.12:5000/get-user/${selectedUserId}`);
      const selectedUserGitlabId = userResponse.data.gitlabId;
  
      // Step 2: Send a POST request to assign the issue on GitLab
      const projectGitlabId = moduleDetails.gitlabId; // Assuming moduleDetails contains the GitLab project ID
      const issueId = task.gitlabId; // Assuming each task has a GitLab issue ID 
   
      await axios.post('http://10.8.0.12:5000/assign-issue', {
        projectId: projectGitlabId,
        issueId: issueId,
        userId: selectedUserGitlabId,
      });
  
      // Step 3: Update the task assignment in your local database
      await axios.put(`http://10.8.0.12:5000/update-task-assignment/${task.taskId}`, {
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
  const handleDeleteModule = () => { 
    axios.delete(`http://10.8.0.12:5000/delete-repo/${moduleDetails.gitlabId}`)
      .then(() => {
        axios.delete(`http://10.8.0.12:5000/delete-module/${moduleDetails.moduleId}`) 
          .then((res) => {
            console.log(res.data);
            const logData = { 
              index: "badal",
              data: {
                message: `Project "${moduleDetails.moduleName}" deleted successfully from GitLab, local database, and NGO collection`,
                timestamp: new Date(),
              },
            };
           axios.post(`http://10.8.0.12:5000/log`, logData); 
        
            navigate(`/workspace`);
          })
          .catch((err) => {
            console.log(err);
            const logData = {
              index: "badal",
              data: {
                message: `Error deleting project "${moduleDetails.moduleName}": ${err.message}`,
                timestamp: new Date(),
              },
            };
            axios.post(`http://10.8.0.12:5000/log`, logData);
            // Show an error alert to the user
            alert(`Error deleting project "${moduleDetails.moduleName}": ${err.message}`);
          });
      })
      .catch((err) => {
        console.log(err);
        const logData = {
          index: "badal",
          data: {
            message: `Error deleting project "${moduleDetails.moduleName}": ${err.message}`,
            timestamp: new Date(),
          },
        };
        axios.post(`http://10.8.0.12:5000/log`, logData);
        // Show an error alert to the user
        alert(`Error deleting project "${moduleDetails.moduleName}": ${err.message}`);
      });
};
const [selectedWorkspaceId, setSelectedWorkspaceId] = useState("");

const handleWorkspaceChange = (event) => {
  const workspaceId = event.target.value;
  setSelectedWorkspaceId(workspaceId);
  navigate(`/taskworkspace/${workspaceId}`);
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
              <Typography style={{ padding: 20, fontSize: "24px", fontWeight: "500" }}>
              {moduleDetails.moduleName}
              </Typography>
            </Grid>
            <Grid item xs={1.5}>
              {/* <FormControl sx={{ m: 1, minWidth: 130 }}>
              <InputLabel id="module-status-label">Status</InputLabel>
      <Select
        labelId="module-status-label"
        id="module-status"
        value={completedStatus}
        onChange={handleStatusChange}
        label="Module Status"
      >
        <MenuItem value="completed">Completed</MenuItem>
        <MenuItem value="ongoing">Ongoing</MenuItem>
        <MenuItem value="review">Review</MenuItem>
      </Select>
              </FormControl> */}

<FormControl sx={{ m: 1, minWidth: 180 }}  disabled={!(isP005Allowed || isP006Allowed ||isP001Allowed)}>
      <InputLabel id="workspace-select-label">Select Workspace</InputLabel>
      <Select
        labelId="workspace-select-label"
        value={selectedWorkspaceId}
        onChange={handleWorkspaceChange}
        label="Workspace"
      >
        {moduleDetails.workspaceIds.map((workspace, index) => (
          <MenuItem key={workspace.workspaceId} value={workspace.workspaceId}>
            {`Workspace-${index + 1}`}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
            </Grid>
          </Grid>

          <Typography variant="h6" color="text.secondary" style={{ paddingLeft: 20, marginBottom: 20 }}>
          {moduleDetails.moduleDescription}
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
            
            <Button variant="outlined" size="small" onClick={handleDeleteModule} sx={{marginTop:"5px"}}  disabled={!(isP005Allowed || isP006Allowed)}>
    Delete Module
  </Button>
            </Grid>
            <Grid container sx={{ marginBottom: 3, flexDirection: "column" }}>
           
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, marginTop: 1, alignItems: 'center',marginTop:'-12vh' }}>
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
                    window.open(moduleDetails.gitWebUrl, "_blank");
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
        <Typography variant="h5" style={{ paddingTop: 40 }}>
          <center >Tasks</center>
        </Typography>
        <Grid container sx={{ marginBottom: 1 }}>
          <Grid item xs={10.2}></Grid>
          <Grid item xs={1.8}>
  <Button 
    variant="outlined" 
    onClick={handleOpen} 
    disabled={!isP005Allowed && !isP006Allowed} // Disable if both are false
  >
    Add Task
  </Button>
</Grid>

        </Grid>

        <Divider sx={{ marginBottom: "20px" }} />
        <TableContainer component={Paper}>
          <Table stickyHeader aria-label="a dense table">
            <TableHead>
              <TableRow>
                <StyledTableCell align="left">Task Name</StyledTableCell>
                <StyledTableCell align="left">Description</StyledTableCell>
                <StyledTableCell align="right"></StyledTableCell>
                <StyledTableCell align="right"></StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {taskList.map((project) => (
                <StyledTableRow key={project._id}>
                  <TableCell align="left">{project.taskName}</TableCell>
                  <TableCell align="left">{project.taskDescription}</TableCell>
                  <TableCell align="right">
                    {/* <FormControl sx={{ minWidth: 130 }}>
                      <InputLabel htmlFor="status">Status</InputLabel>
                     */}
                      {/* <Select
                        value={"project.status.toUpperCase()"}
                        onChange={(e) => handleStatusChange(e, project)}
                        label="Status"
                        inputProps={{ name: "status", id: "status" }}
                      >
                        {allStatus.map((status) => (
                          <MenuItem key={status} value={status.toUpperCase()}>
                            {status}
                          </MenuItem>
                        ))}
                      </Select> */}
                      {/* <Select id="select-autowidth" value={sta} onChange={handleModuleStatus} autoWidth label="Status">
                  <MenuItem value={10}>Ongoing</MenuItem>
                  <MenuItem value={21}>Completed</MenuItem>
                </Select>
                    </FormControl> */}
                  </TableCell>
                  <TableCell align="right">
                      {/* <FormControl sx={{ minWidth: 120, minHeight: 20 }}>
        <InputLabel htmlFor="assigned">Assigned To</InputLabel>
        <Select
                    onChange={(e) => handleAssignedToChange(e, project)}
                    label="Assigned To"
                  >
                    {teams?.map((team) => (
                      <MenuItem key={team._id} value={team.userId}>
                        {team.username}
                      </MenuItem>
                    ))}
        </Select> 
 
                    </FormControl> */}
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

export default Task;
