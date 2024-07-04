import React, { useState, useEffect } from "react";
import { Box, Container, Typography, Grid, Card, Divider, TextField, FormControl, InputLabel, MenuItem, Select, Dialog, DialogContent, Button, Chip } from "@mui/material";
import { ModuleCard } from "../cards/modulecard";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import GitHubIcon from "@mui/icons-material/GitHub";
import Fuse from "fuse.js";
import { useLocation, useParams } from "react-router-dom";
import CreateModule from "../Sub-Pages/createmodule";
import EditProject from "../Editpages/editproject";
import axios from "axios";
import { useNavigate } from "react-router-dom";
function Module() {
  const location = useLocation();
  const navigate=useNavigate()
  const [query, setQuery] = useState("");
  const [moduleList, setModuleList] = useState([]);
  const [status, setStatus] = useState("");
  const [open, setOpen] = useState(false);
  const [open1, setOpen1] = useState(false);
  const [projectDetails, setProjectDetails] = useState(null);
  const { projectId } = useParams();
  const permissionString = localStorage.getItem("permissions");
  const permissions = permissionString ? permissionString.split(",") : [];
  const isP005Allowed = permissions.includes("P005");
  const isP006Allowed = permissions.includes("P006");
  const isP001Allowed = permissions.includes("P001");
  const isP002Allowed = permissions.includes("P002")
  const isP003Allowed = permissions.includes("P003")
  const isP004Allowed = permissions.includes("P004")
  const orgId = localStorage.getItem("orgId"); // Retrieve orgId from local storage
  const [isNgo, setIsNgo] = useState(false);
  useEffect(() => {
    // Make a request to fetch organization data
    fetch(`http://10.8.0.12:5000/get-org/${orgId}`)
      .then(response => response.json())
      .then(data => {
        // Check if isNgo is true
        setIsNgo(data.isNgo === 'true');
      })
      .catch(error => console.error('Error fetching organization data:', error));
  }, [orgId]);
  

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen1 = () => {
    setOpen1(true);
  };

  const handleClose1 = () => {
    setOpen1(false);
  };

  useEffect(() => {
    async function fetchProjectDetails() {
      try {
        const response = await fetch(`http://10.8.0.12:5000/get-project/${projectId}`);
        const data = await response.json();
        setProjectDetails(data); // Set project details
      } catch (error) {
        console.error("Error fetching project details:", error);
      }
    }
  
    // async function fetchModules() {
    //   try {
    //     const response = await fetch(`http://10.8.0.12:5000/get-allmodules`);
    //     const data = await response.json();
  
    //     // Additional condition check
    //     if (isP002Allowed && !isP001Allowed && !isP003Allowed && !isP004Allowed && !isP005Allowed && !isP006Allowed) {
    //       // Retrieve userId from localStorage
    //       const userId = localStorage.getItem("userId");
  
    //       // Fetch user data using userId
    //       const userResponse = await fetch(`http://10.8.0.12:5000/get-user/${userId}`);
    //       const userData = await userResponse.json();
  
    //       // Extract teamIds from userData
    //       const userTeamIds = userData[0].teamId || [];
  
    //       // Filter modules based on teamIds
    //       const modules = data.data
    //         .filter(module => module.teamsAssigned && module.teamsAssigned.some(teamId => userTeamIds.includes(teamId)))
    //         .map(module => ({
    //           _id: module.moduleId,
    //           name: module.moduleName,
    //           description: module.moduleDescription,
    //           gitlabid: module.gitlabId,
    //           status: "Ongoing", // This status is assumed; replace with actual status if available
    //           status_bol: true,
    //           tags: module.skillsRequired.map(skill => skill.name),
    //           assigned_teams: module.workspaceIds.map(workspace => workspace.teamId),
    //           assigned_to: { name: "John Doe" }, // Replace with actual name if available
    //           created_at: module.moduleDateCreated,
    //           updated_at: module.moduleDateStart,
    //           noOfOngoingTasks: module.assigned, 
    //           noOfCompletedTasks: module.completed,
    //           project_name: "Sample Project",
    //           projectId: module.projectId,
    //           modulecreatedby: module.orgId,
    //           moduleDateCreated: module.moduleDateCreated,
    //           skills: module.skillsRequired,
    //           totalDevTimeRequired: module.totalDevTimeRequired,
    //           assigned: module.assigned,
    //           unassigned: module.unassigned,
    //           completed: module.completed,
    //           taskIds: "",
    //           requirementsDocument: module.requirementsDocument,
    //           uiMocks: module.uiMocks,
    //           apiDocument: module.apiDocument,
    //           dbDocument: module.dbDocument,
    //           workspaceinfo: module.workspaceIds
    //         }));
  
    //       setModuleList(modules);
    //     } else {
    //       // Default behavior if conditions not met
    //       const modules = data.data
    //         .filter(module => module.projectId === projectId)
    //         .map(module => ({
    //           _id: module.moduleId,
    //           name: module.moduleName,
    //           description: module.moduleDescription,
    //           gitlabid: module.gitlabId,
    //           status: "Ongoing", // This status is assumed; replace with actual status if available
    //           status_bol: true,
    //           tags: module.skillsRequired.map(skill => skill.name),
    //           assigned_teams: module.workspaceIds.map(workspace => workspace.teamId),
    //           assigned_to: { name: "John Doe" }, // Replace with actual name if available
    //           created_at: module.moduleDateCreated,
    //           updated_at: module.moduleDateStart,
    //           noOfOngoingTasks: module.assigned, 
    //           noOfCompletedTasks: module.completed,
    //           project_name: "Sample Project",
    //           projectId: module.projectId,
    //           modulecreatedby: module.orgId,
    //           moduleDateCreated: module.moduleDateCreated,
    //           skills: module.skillsRequired,
    //           totalDevTimeRequired: module.totalDevTimeRequired,
    //           assigned: module.assigned,
    //           unassigned: module.unassigned,
    //           completed: module.completed,
    //           taskIds: "",
    //           requirementsDocument: module.requirementsDocument,
    //           uiMocks: module.uiMocks,
    //           apiDocument: module.apiDocument,
    //           dbDocument: module.dbDocument,
    //           workspaceinfo: module.workspaceIds
    //         }));
  
    //       setModuleList(modules);
    //     }
    //   } catch (error) {
    //     console.error("Error fetching module data:", error);
    //   }
    // }
    async function fetchModules() {
      let data;
      try {
        // Retrieve projectId (assuming it's available in your component's scope) // or any other method to get projectId
    
        // Fetch modules from the new endpoint using the projectId
        if (isP002Allowed || isP001Allowed) {
          // Fetch module data for projectId
          const response = await fetch(`http://10.8.0.12:5000/get-module-DB/${projectId}`);
          data = await response.json();
        } else {
          // Fetch all modules data
          const response = await fetch(`http://10.8.0.12:5000/get-module-DB/${projectId}`);
          data = await response.json();
        }
    
    
        // Additional condition check for permissions
        if (isP002Allowed && !isP001Allowed && !isP003Allowed && !isP004Allowed && !isP005Allowed && !isP006Allowed) {
          // Retrieve userId from localStorage
          const userId = localStorage.getItem("userId");
    
          // Fetch user data using userId
          const userResponse = await fetch(`http://10.8.0.12:5000/get-user/${userId}`);
          const userData = await userResponse.json();
    
          // Extract teamIds from userData
          const userTeamIds = userData[0]?.teamId || [];
          
    
          // Filter modules based on teamIds
          const modules = data.filter(module => module.teamsAssigned && module.teamsAssigned.some(teamId => userTeamIds.includes(teamId)))
            .map(module => ({
              _id: module.moduleId,
              name: module.moduleName,
              description: module.moduleDescription,
              gitlabid: module.gitlabId,
              status: module.status || "Ongoing", // Use actual status if available
              status_bol: true,
              tags: module.skillsRequired?.map(skill => skill.name) || [],
              assigned_teams: module.workspaceIds?.map(workspace => workspace.teamId) || [],
              assigned_to: { name: "John Doe" }, // Replace with actual name if available
              created_at: module.moduleDateCreated,
              updated_at: module.moduleDateStart,
              noOfOngoingTasks: module.assigned, 
              noOfCompletedTasks: module.completed,
              project_name: module.projectName || "Sample Project",
              projectId: module.projectId,
              modulecreatedby: module.orgId,
              moduleDateCreated: module.moduleDateCreated,
              skills: module.skillsRequired || [],
              totalDevTimeRequired: module.totalDevTimeRequired,
              assigned: module.assigned,
              unassigned: module.unassigned,
              completed: module.completed,
              taskIds: "",
              requirementsDocument: module.requirementsDocument,
              uiMocks: module.uiMocks,
              apiDocument: module.apiDocument,
              dbDocument: module.dbDocument,
              workspaceinfo: module.workspaceIds || []
            }));
    
          setModuleList(modules);
        } else {
          // Default behavior if conditions not met
          const modules = data.map(module => ({
              _id: module.moduleId,
              name: module.moduleName,
              description: module.moduleDescription,
              gitlabid: module.gitlabId,
              status: module.status || "Ongoing", // Use actual status if available
              status_bol: true,
              tags: module.skillsRequired?.map(skill => skill.name) || [],
              assigned_teams: module.workspaceIds?.map(workspace => workspace.teamId) || [],
              assigned_to: { name: "John Doe" }, // Replace with actual name if available
              created_at: module.moduleDateCreated,
              updated_at: module.moduleDateStart,
              noOfOngoingTasks: module.assigned, 
              noOfCompletedTasks: module.completed,
              project_name: module.projectName || "Sample Project",
              projectId: module.projectId,
              modulecreatedby: module.orgId,
              moduleDateCreated: module.moduleDateCreated,
              skills: module.skillsRequired || [],
              totalDevTimeRequired: module.totalDevTimeRequired,
              assigned: module.assigned,
              unassigned: module.unassigned,
              completed: module.completed,
              taskIds: "",
              requirementsDocument: module.requirementsDocument,
              uiMocks: module.uiMocks,
              apiDocument: module.apiDocument,
              dbDocument: module.dbDocument,
              workspaceinfo: module.workspaceIds || []
            }));
    
          setModuleList(modules);
        }
      } catch (error) {
        console.error("Error fetching module data:", error);
      }
    }
    
  
    fetchProjectDetails();
    fetchModules();
  }, [projectId, isP002Allowed, isP001Allowed, isP003Allowed, isP004Allowed, isP005Allowed, isP006Allowed]);
  

  const [assignedTeamName, setAssignedTeamName] = useState("");

  const fetchTeamName = async () => {

    try {
      if (!projectDetails || !projectDetails.assignedTo) {
        return; // Exit early if projectDetails or assignedTo is null
      }
    console.log('fnm',projectDetails.assignedTo);
      const response = await axios.get(`http://10.8.0.12:5000/get-org/${projectDetails.assignedTo}`);
      const team = response.data;
      if (team) {
        setAssignedTeamName(team.orgName);
      } else { 
        console.error("Team not found for the specified ID");
      }
    } catch (error) {
      console.error("Error fetching team:", error);
    }
  };
  fetchTeamName() 
  


  const stringToDate = (dateString) => {
    if (dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } else {
      return "N/A"; // Handle cases where dateString is not available
    }
  };

  function handleOnSearch({ currentTarget = {} }) {
    const { value } = currentTarget;
    setQuery(value);
  }

  const fuse = new Fuse(moduleList, {
    keys: ["name"],
    threshold: 0.3, // Adjusted threshold for better matching
  });

  const results = fuse.search(query);
  const cResults = query ? results.map(result => result.item) : moduleList;

  const MyAddModule = (props) => {
    return <Button variant="outlined" onClick={handleOpen} disabled={!isP006Allowed && !isP005Allowed}>Add Module</Button>;
  };

  const pickProject = async () => {
    if (!projectId || !orgId) {
      alert("Project ID or Organization ID is missing.");
      return;
    }

    try {
      // API call to assign the project to the organization
      const response1 = await fetch(`http://10.8.0.12:5000/project/${projectId}/assign/${orgId}`, {
        method: 'PUT',
      });

      if (!response1.ok) {
        throw new Error('Failed to assign project');
      }

      // API call to pick the project for the organization
      const response2 = await fetch(`http://10.8.0.12:5000/organization/${orgId}/pick-project/${projectId}`, {
        method: 'PUT',
      });

      if (!response2.ok) {
        throw new Error('Failed to pick project');
      }

      alert("Project picked successfully!");
      window.location.reload()
    } catch (error) {
      console.error("Error picking project:", error);
      alert(`Error picking project: ${error.message}`);
    }
  };
  const handleDeleteProject = async () => {
    try {
      // Delete project in GitLab
      const response = await axios.delete(`http://10.8.0.12:5000/delete-subgroup/${projectDetails.gitlabId }`);
      console.log(response.data);
  
      // Delete project in database
      await axios.delete(`http://10.8.0.12:5000/delete-project/${projectId}`);
      console.log(`Project with ID ${projectId} deleted from database`);
  
      // Delete project ID from NGO collection
      await axios.delete(`http://10.8.0.12:5000/delete-project-from-ngo/${projectId}`);
      console.log(`Project with ID ${projectId} removed from NGO collection`);
  
      // Log successful project deletion
      const logData = {
        index: "badal",
        data: {
          message: `Project "${projectDetails.projectName}" deleted successfully from GitLab, local database, and NGO collection`,
          timestamp: new Date(),
        },
      };
      await axios.post(`http://10.8.0.12:5000/log`, logData);
  
      // Redirect to dashboard
      navigate('/rcts/badal/projects')
    } catch (err) {
      console.log(err);
  
      // Log the error
      const logData = {
        index: "badal",
        data: {
          message: `Error deleting project "${projectDetails.projectName}": ${err.message}`,
          timestamp: new Date(),
        },
      }; 
      await axios.post(`http://10.8.0.12:5000/log`, logData);
  
      // Show an error alert to the user
      alert(`Error deleting project "${projectDetails.projectName}": ${err.message}`);
    }
  };
 
  return (
    <>
      <Box component="main" sx={{ flexGrow: 1, paddingLeft: 10, paddingRight: 10 }}>
        <Typography style={{ paddingTop: 20, fontSize: "24px", fontWeight: "bold" }}>
          <center>Project Details Page</center>
        </Typography>
        <Divider sx={{ marginBottom: "20px" }} />
        {projectDetails && (
          <Card sx={{ width: "100%", backgroundColor: "#f7f9fe" }}>
            <Grid container sx={{ padding: "10px" }} justifyContent="space-between">
              <Typography style={{ fontSize: "24px", fontWeight: "bold" }}>{projectDetails.projectName}</Typography>
            </Grid>

            <Typography variant="h6" color="text.secondary" style={{ paddingLeft: 10, marginBottom: 20 }}>
              {projectDetails.projectDescription || "Description of the project"}
            </Typography>
            <Grid container>
              <Grid container sx={{ marginBottom: 3, flexDirection: "column", alignItems: "flex-end", paddingRight: "30px" }}>
                <Grid item xs={2}>
                  <ul>
                    <li>
                      <Typography display="flex" color="text.secondary" sx={{ paddingLeft: "10px", paddingTop: "16px", fontSize: "14px" }}>
                        Start Date: {stringToDate(projectDetails.projectDateStart)}
                      </Typography>
                    </li>
                  </ul>
                </Grid>

                <Grid item xs={2}>
                  <ul>
                    <li>
                      <Typography display="flex" color="text.secondary" sx={{ paddingLeft: "10px", paddingTop: "16px", fontSize: "14px" }}>
                        End Date: {stringToDate(projectDetails.projectDateEnd)}
                      </Typography>
                    </li>
                  </ul>
                </Grid>
                <Grid item xs={2}>
                  <ul>
                    <li>
                      <Typography display="flex" color="text.secondary" sx={{ paddingLeft: "10px", paddingTop: "16px", fontSize: "14px" }}>
                       Assigned to :  {assignedTeamName}
                      </Typography>
                    </li>
                  </ul>
                </Grid>
{!projectDetails.assignedTo && (
  <Button variant="outlined" size="small" onClick={pickProject} disabled={!isP001Allowed || isNgo}>
    Pick Project
  </Button>
)}

<Button variant="outlined" size="small" onClick={handleOpen1} sx={{marginTop:"5px"}}  disabled={( !isP005Allowed && !isP006Allowed)}>
    Edit Project 
  </Button>

  <Button variant="outlined" size="small" onClick={handleDeleteProject} sx={{marginTop:"5px"}} disabled={( !isP005Allowed && !isP006Allowed)}>
    Delete Project 
  </Button>
              </Grid>

              <Grid container sx={{ marginBottom: 3, flexDirection: "column", }}>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, marginTop: "-12vh", alignItems: 'center' }}>
                  <Typography variant="h6" sx={{ marginLeft: 2, marginRight: 2 }}>Skills</Typography>
                  {projectDetails.skillsRequired.map((skill, index) => (
                    <Chip
                      key={index}
                      label={skill.name}
                      variant="outlined"
                      color="primary"
                      sx={{ margin: '2px' }} // Add some margin for better spacing
                    />
                  ))}
                </Box>

                <Grid item xs={2} sx={{ justifyContent: "flex-end" }}>
                  <Typography display="flex" sx={{ paddingLeft: "10px", paddingTop: "16px" }}>
                    <GitHubIcon fontSize="large" sx={{ marginLeft: 1, marginTop: 2 }} onClick={() => {
                      window.open(projectDetails.gitWebUrl, "_blank");
                    }} />
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Card>
          
        )}
        <Typography variant="h5" style={{ paddingTop: 20 }}>
          <center>Modules</center>
        </Typography>
        <Divider />
        <Grid container justifyContent="flex-end" alignItems="flex-end">
          <Box sx={{ display: "flex", alignItems: "flex-end", marginLeft: 2, marginTop: 2 }}>
            <SearchOutlinedIcon sx={{ color: "active", mr: 1, my: 0.5 }} />
            <TextField
              id="search-modules"
              label="Search Modules"
              variant="standard"
              value={query}
              onChange={handleOnSearch}
            />
          </Box>
          <MyAddModule style={{ marginLeft: "20px" }} />
        </Grid>
        <Container maxWidth={false}>
          <Box sx={{ pt: 3 }}>
            <Grid container spacing={3}>
              {cResults.map((product) => (
                <Grid item key={product._id} lg={3} md={6} xs={12}>
                  <ModuleCard product={product} projectdata={projectDetails} /> {/* Change 'module' to 'product' */}
                </Grid>
              ))}
              <Box width="100%" />
            </Grid>
          </Box>
        </Container>
      </Box>
      <Dialog open={open} onClose={handleClose} maxWidth="md">
        <DialogContent>
          <CreateModule projectId={projectId} />
        </DialogContent>
      </Dialog>
      <Dialog open={open1} onClose={handleClose1} maxWidth="md">
        <DialogContent>
          <EditProject  projectId={projectId} />
        </DialogContent>
      </Dialog>
    </>
  );
}

export default Module;
