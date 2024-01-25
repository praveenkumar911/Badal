import * as React from "react";
import Grid from '@mui/material/Grid';
import healthcare from "../project/healthcare.svg";
import Vector from "../project/Vector.svg";
import info from "../project/info.svg";
import gitlab from "../project/gitlab.svg";
import axios from "axios";
import { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PieChartsRow from "./Chart";
import './project.css'
import tickDecagram from '../project/mdi_tick-decagram.png';
import swal from "sweetalert2";
import PieChartsTaskRow from "./charttask";


function Modulecard(props) {
  const navigate = useNavigate();
  const [moduledetails, setModuledetails] = useState([]);
  const [taskdetails, setTaskdetails] = useState([]);
  const project = props.project;
  const permissionString = sessionStorage.getItem('permissions');
  const permissions = permissionString ? permissionString.split(',') : [];
  const isP001Allowed = permissions.includes('P001'); 
  const isP002Allowed = permissions.includes('P002'); 
  const isP003Allowed = permissions.includes('P003');
  const isP004Allowed = permissions.includes('P004');
  const isP005Allowed= permissions.includes('P005')
  const orgId=sessionStorage.getItem('orgId') 
  const userId=sessionStorage.getItem('userId')
  const projectId=sessionStorage.getItem('projectId')
  const [permissionextra, setPermissionextra] = useState([]);
  const [teamDetails, setTeamDetails] = useState([]);

  useEffect(() => {
    const fetchTeamDetails = async () => {
      try {
        const response = await axios.get('http://localhost:5030/get-all-teams');
        setTeamDetails(response.data);
      } catch (error) {
        console.error('Error fetching team details:', error);
        // Handle errors as needed
      }
    };

    fetchTeamDetails();
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Make the API call to get extra permissions
        const response = await axios.get('http://localhost:5030/get-extra-permissions');

        // Extract the permissions from the response data
        const permissions = response.data.permissions;
 
        // Set the permissions to the state
        setPermissionextra(permissions);
        console.log((permissionextra));
      } catch (error) {
        console.error('Error fetching extra permissions:', error);
        // Handle errors as needed
      }
    };

    // Call the fetchData function
    fetchData();
  }, []); //
  var num = 1;
  function mapComplexityToNumber(complexity) {
    const complexityMap = {
      'a': 1,
      'b': 2,
      'c': 3,
      'd': 4,
      'e': 5,
    };
  
    return complexityMap[complexity] || 0;
  }
  
  const showTeamAlert = async (teams) => {
    const { value: selectedTeam } = await swal.fire({
      title: "Select a Team",
      input: "select",
      inputOptions: teams.reduce((options, team) => {
        options[team.TeamName] = team.TeamName;
        return options;
      }, {}),
      showCancelButton: true,
      inputPlaceholder: "Select a Team",
      confirmButtonText: "confirm",
    });

    if (selectedTeam) {
      // Handle the selected team (you can navigate or perform other actions)
      console.log(`Selected Team: ${selectedTeam}`);
    }
  };
  React.useEffect(() => {
    axios
      .get("http://localhost:5030/get-allmodules")
      .then((res) => {
        setModuledetails(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  const [selectedModuleId, setSelectedModuleId] = useState('');
  const handleModuleChange = async (event) => {
    const selectedTeam = event.target.value;
  
    // Find the module with the selected team
    const selectedModule = moduledetails.find((details) => details.teamsAssigned.includes(selectedTeam));
  
    if (selectedModule) {
      // Find the index of the selected team in the teamsAssigned array
      const teamIndex = selectedModule.teamsAssigned.indexOf(selectedTeam);
  
      // Check if the teamIndex is valid
      if (teamIndex !== -1 && teamIndex < selectedModule.workspaceIds.length) {
        const workspaceId = selectedModule.workspaceIds[teamIndex];
  
        // Make the API call with the selected workspaceId as payload
        try {
          const response = await axios.post("http://localhost:5030/get-task-DB-byworkspaceID", {
            moduleid: workspaceId,
          });
  
          // Update the task details state
          setTaskdetails(response.data);
          setSelectedModuleId(selectedModule.moduleId);
        } catch (error) {
          console.log(error);
        }
      } else {
        console.error('Invalid teamIndex or workspaceIds array');
      }
    }
  
  };
  
  const [isChecked, setIsChecked] = useState(false);

  /* const handleCircleClick = async (details) => {
    try {
    
      // Check if OrgID from user details matches OrgID in module details
      if (isP001Allowed) {
        const teamsResponse = await axios.get(`http://localhost:5030/get-org-teams/${orgId}`);
  
        if (teamsResponse.data && teamsResponse.data.length > 0) { 
          const { value: selectedTeam } = await swal.fire({
            title: "Select a Team", 
            input: "select", 
            inputOptions: teamsResponse.data.reduce((options, team) => {
              options[team.teamName] = team.teamName;
              return options;
            }, {}),
            showCancelButton: true,
            inputPlaceholder: "Select a Team",
            confirmButtonText: "Confirm",
          });
  
          if (selectedTeam) {
            // Find the selected team in the teamsResponse.data

            const selectedTeamDetails = teamsResponse.data.find(team => team.teamName === selectedTeam);
            if (selectedTeamDetails) {
              // Check if the selected team is already assigned to the module
              if (details.teamsAssigned && details.teamsAssigned.includes(selectedTeamDetails.teamId)) {
                  // Team is already assigned, show error prompt
                  swal.fire({
                      icon: "error",
                      title: "Team Already Assigned",
                      text: "The selected team is already assigned to  module.",
                  });
                  return;
                }}
            console.log(selectedTeamDetails._id);
            const teamAssignedModulesCount = selectedTeamDetails.assignedModules.length;
            const teamPermission = permissionextra.find(permission => permission.permission === 'team');

            if (teamPermission && teamAssignedModulesCount >= parseInt(teamPermission.count)) {
              // Team can be assigned to only one module, show error prompt
              swal.fire({
                icon: "error",
                title: "Assignment Limit Exceeded",
                text: "The selected team can be assigned to only one module.",
              });
              return;
            }
            if (selectedTeamDetails) {
              // You can get moduleGitID from your logic, assuming details._id is the moduleGitID
              const moduleGitID = details.gitlabId;
              const teamGitID = selectedTeamDetails.teamGitId;  
              // Make the API call to /fork-and-add-to-subgroup/modulegitid/teamgitid
              const forkAndAddToSubgroupResponse = await axios.post(
                `http://localhost:5030/fork-and-add-to-subgroup/${moduleGitID}/${teamGitID}`
              );
  
              // Handle the response and update forkedGitlabID and forkedGitlabUrl
              const { id, web_url } = forkAndAddToSubgroupResponse.data;
              console.log("Forked GitlabID:", id);
              console.log("Forked GitlabUrl:", web_url);
   
              // Create the payload for /create-workspace
              const createWorkspacePayload = {
               // projectObjectId: details.projectObjectId,
                projectId: details.projectId,
                moduleId:details.moduleId,
                moduleCreatedBy: details.moduleCreatedBy,
                assignedTeam: selectedTeamDetails.teamId,
                moduleDateCreated: details.moduleDateCreated,
                workspaceName: details.moduleName+project, 
                workspaceDescription: details.moduleDescription,
                moduleDateStart: details.moduleDateStart,
                moduleDateEnd: details.moduleDateEnd,
                skillsRequired: details.skillsRequired,
                totalDevTimeRequired: details.totalDevTimeRequired,
                moduleComplexity: details.moduleComplexity, 
                forkedGitlabId: id, // Updated with forked GitlabID
                forkedGitlabUrl: web_url, // Updated with forked GitlabUrl
                gitModuleName: details.Gitmodulename,
                numberOfTask: details.numberOfTask,
                moduleField: details.modulefield,
                assigned: details.assigned,
                unassigned: details.unassigned,
                completed: details.completed,
                taskIds: details.taskIds,
              };              
  
              // Make the API call to /create-workspace with the payload
              const createWorkspaceResponse = await axios.post(
                "http://localhost:5030/create-workspace",
                createWorkspacePayload
              );
  
              // Handle the response from /create-workspace
              console.log("Create Workspace Response:", createWorkspaceResponse.data);
  
              // Obtain the _id from the createWorkspaceResponse
              const createdWorkspaceId = createWorkspaceResponse.data.workspaceId;
  
              // Make the API call to /update-assigned-modules/:teamId
              const updateAssignedModulesResponse = await axios.put(
                `http://localhost:5030/update-assigned-modules/${selectedTeamDetails.teamId}`,
                { assignedModule: createdWorkspaceId }
              );
  
              // Handle the response from /update-assigned-modules/:teamId
             // console.log("Update Assigned Modules Response:", updateAssignedModulesResponse.data);
  
              const appendTeamsResponse = await axios.put(
                `http://localhost:5030/append-teams/${details.moduleId}`, 
                { teamIds: [selectedTeamDetails.teamId] }
              );
              const appendworkspaceResponse = await axios.put(
                `http://localhost:5030/append-workspaceIds/${details.moduleId}`, 
                { workspaceIds: [createdWorkspaceId] }
              );
    
              // Handle the response from /append-teams
              //console.log("Append Teams Response:", appendTeamsResponse.data);
  
              // Show success prompt
              swal.fire({
                icon: "success",
                title: "Success",
                text: "Workspace created successfully. Check your workspace.",
                
              });
  
              // You can update the state or perform other actions based on the response
            }
          }
        } else {
          swal.fire({
            icon: "info",
            title: "No Teams Found",
            text: "You are not part of any teams.",
          });
        }
      } else {
        swal.fire({
          icon: "error",
          title: "Access Denied",
          text: "You are not allowed to pick this module as a developer.",
        });
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
      // Handle errors as needed
    }
  }; */
  const[teamsResponse,setTeamResponse]=useState()
  const handleCircleClick = async (details) => {
    try {
      let teamsEndpoint;
  
      if (isP001Allowed) {
        // If P001 is allowed, get teams from the specific endpoint
        teamsEndpoint = `http://localhost:5030/get-org-teams/${orgId}`;
        const teamsResponse = await axios.get(teamsEndpoint);
        setTeamResponse(teamsResponse)
      } else if (isP005Allowed) {
        // If P005 is allowed, get all teams from a different endpoint
        teamsEndpoint = 'http://localhost:5030/get-all-teams';
        const teamsResponse = await axios.get(teamsEndpoint);
        setTeamResponse(teamsResponse)
      } else {
        // Handle other cases or show an error
        swal.fire({
          icon: 'error',
          title: 'Access Denied',
          text: 'You do not have permission to perform this action.',
        });
        return;
      }
  
      
  
      if (teamsResponse.data && teamsResponse.data.length > 0) {
        const { value: selectedTeam } = await swal.fire({
          title: 'Select a Team',
          input: 'select',
          inputOptions: teamsResponse.data.reduce((options, team) => {
            options[team.teamName] = team.teamName;
            return options;
          }, {}),
          showCancelButton: true,
          inputPlaceholder: 'Select a Team',
          confirmButtonText: 'Confirm',
        });
  
        if (selectedTeam) {
          // Find the selected team in the teamsResponse.data
          const selectedTeamDetails = teamsResponse.data.find((team) => team.teamName === selectedTeam);
          if (selectedTeamDetails) {
            // Check if the selected team is already assigned to the module
            if (details.teamsAssigned && details.teamsAssigned.includes(selectedTeamDetails.teamId)) {
              // Team is already assigned, show error prompt
              swal.fire({
                icon: 'error',
                title: 'Team Already Assigned',
                text: 'The selected team is already assigned to the module.',
              });
              return;
            }
          }
  
          const teamAssignedModulesCount = selectedTeamDetails.assignedModules.length;
          const teamPermission = permissionextra.find((permission) => permission.permission === 'team');
  
          if (teamPermission && teamAssignedModulesCount >= parseInt(teamPermission.count)) {
            // Team can be assigned to only one module, show error prompt
            swal.fire({
              icon: 'error',
              title: 'Assignment Limit Exceeded',
              text: 'The selected team can be assigned to only one module.',
            });
            return;
          }
  
          if (selectedTeamDetails) {
            // You can get moduleGitID from your logic, assuming details._id is the moduleGitID
            const moduleGitID = details.gitlabId;
            const teamGitID = selectedTeamDetails.teamGitId;
            // Make the API call to /fork-and-add-to-subgroup/modulegitid/teamgitid
            const forkAndAddToSubgroupResponse = await axios.post(
              `http://localhost:5030/fork-and-add-to-subgroup/${moduleGitID}/${teamGitID}`
            );
  
            // Handle the response and update forkedGitlabID and forkedGitlabUrl
            const { id, web_url } = forkAndAddToSubgroupResponse.data;
            console.log('Forked GitlabID:', id);
            console.log('Forked GitlabUrl:', web_url);
  
            // Create the payload for /create-workspace
            const createWorkspacePayload = {
              // projectObjectId: details.projectObjectId,
              projectId: details.projectId,
              moduleId: details.moduleId,
              moduleCreatedBy: details.moduleCreatedBy,
              assignedTeam: selectedTeamDetails.teamId,
              moduleDateCreated: details.moduleDateCreated,
              workspaceName: details.moduleName + project,
              workspaceDescription: details.moduleDescription,
              moduleDateStart: details.moduleDateStart,
              moduleDateEnd: details.moduleDateEnd,
              skillsRequired: details.skillsRequired,
              totalDevTimeRequired: details.totalDevTimeRequired,
              moduleComplexity: details.moduleComplexity,
              forkedGitlabId: id, // Updated with forked GitlabID
              forkedGitlabUrl: web_url, // Updated with forked GitlabUrl
              gitModuleName: details.Gitmodulename,
              numberOfTask: details.numberOfTask,
              moduleField: details.modulefield,
              assigned: details.assigned,
              unassigned: details.unassigned,
              completed: details.completed,
              taskIds: details.taskIds,
              uiMocks: details.requirementsDocument,
              apiDocument: details.apiDocument,
              dbDocument: details.dbDocument,
            };
  
            // Make the API call to /create-workspace with the payload
            const createWorkspaceResponse = await axios.post('http://localhost:5030/create-workspace', createWorkspacePayload);
  
            // Handle the response from /create-workspace
            console.log('Create Workspace Response:', createWorkspaceResponse.data);
  
            // Obtain the _id from the createWorkspaceResponse
            const createdWorkspaceId = createWorkspaceResponse.data.workspaceId;
   
            // Make the API call to /update-assigned-modules/:teamId
            const updateAssignedModulesResponse = await axios.put(
              `http://localhost:5030/update-assigned-modules/${selectedTeamDetails.teamId}`,
              { assignedModule: createdWorkspaceId }
            );
  
            // Handle the response from /update-assigned-modules/:teamId
            // console.log("Update Assigned Modules Response:", updateAssignedModulesResponse.data);
  
            const appendTeamsResponse = await axios.put(
              `http://localhost:5030/append-teams/${details.moduleId}`,
              { teamIds: [selectedTeamDetails.teamId] }
            );
            const appendworkspaceResponse = await axios.put(
              `http://localhost:5030/append-workspaceIds/${details.moduleId}`,
              { workspaceIds: [createdWorkspaceId] }
            );
  
            // Handle the response from /append-teams
            //console.log("Append Teams Response:", appendTeamsResponse.data);
  
            // Show success prompt
            swal.fire({
              icon: 'success',
              title: 'Success',
              text: 'Workspace created successfully. Check your workspace.',
            });
  
            // You can update the state or perform other actions based on the response
          }
        }
      } else {
        swal.fire({
          icon: 'info',
          title: 'No Teams Found',
          text: 'You are not part of any teams.',
        });
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
      // Handle errors as needed
    }
  };
  
  
  return (
    <div>
      <div>
        {moduledetails && moduledetails
          .filter((details) => details.projectId === projectId) 
          .map((details) => (
            <div key={details._id}>
              <Grid container spacing={0} sx={{
                maxWidth: '79.17vw', 
                marginLeft: "8vw",
                marginRight: "1vw", 
                marginTop: "2vw",
               
                border: '2px dotted #000',
                borderRadius: '8px',
                '@media (max-width: 1000px)': {
                  minWidth: '1200px',
                  overflowX: 'auto', 
                  overflowY: "hidden"
                },
              }}>
       <Grid
  item
  xs={12}
  sm={1.5}
  sx={{
    top: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center', 
    borderRadius: '50%',
    cursor: 'pointer',
    width: '120px',
    height: '120px',
    position: 'relative',
    marginTop: "2vw",
    pointerEvents: permissionextra && permissionextra.find(permission => permission.permission === 'modules') &&
      details.teamsAssigned.length >= parseInt(permissionextra.find(permission => permission.permission === 'modules').count) ? 'none' : 'auto',
    opacity: permissionextra && permissionextra.find(permission => permission.permission === 'modules') &&
      details.teamsAssigned.length >= parseInt(permissionextra.find(permission => permission.permission === 'modules').count) ? 0.5 : 1,
  }}
  container
  justifyContent="center" // Center content horizontally within the grid
  alignItems="center" // Center content vertically within the grid
  onClick={() => {
    // Check if click is allowed based on the condition
    if (!(permissionextra && permissionextra.find(permission => permission.permission === 'modules') &&
      details.teamsAssigned.length >= parseInt(permissionextra.find(permission => permission.permission === 'modules').count))) {
      // Handle circle click logic here
      handleCircleClick(details);
    }
  }}
>
  <svg
    width="100%"
    height="100%"
    viewBox="0 0 24 24"
    fill={isChecked ? '#FFF' : 'transparent'}
    stroke={isChecked ? '#000' : '#000'}
    strokeWidth="0.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" fill="#D5E8D4" />
  </svg>
  {permissionextra && permissionextra.find(permission => permission.permission === 'modules') &&
    details.teamsAssigned.length >= parseInt(permissionextra.find(permission => permission.permission === 'modules').count) ? (
    <img
      src={tickDecagram}
      alt="Tick Decagram"
      style={{
        width: '50%',
        height: '50%',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        display: 'block',
      }}
    />
  ) : null}
</Grid>


              <Grid container xs={12} sm={3} sx={{
                borderLeft: '1px dashed #000',
                borderRight: ['none', '1px dashed #000'],
                padding: ['8px', '10px', '12px'],
                display: 'flex',
                alignItems: 'flex-start',
              }}>
                <Grid item xs={12} sm={12} md={12} xl={12}>
                  <div style={{ display: 'flex', justifyContent: 'space between', alignItems: 'center',cursor:'pointer' }} /* onClick={() => {
                        navigate("/task/" + project + "/" + details._id);
                      }} */>
                    <h4>{details.moduleName}</h4>
                    
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: "flex-end" }}>
                      <img src={info} style={{ height: "30px", width: "30px", cursor: "pointer"}} onClick={() => {
                       // navigate("/task/" + project + "/" + details._id);
                      }} />
                    </div>
                  <p sx={{ width: "5px" }}>{details.moduleDescription.length > 100 ? details.moduleDescription.substring(0, 100) + "..." : details.moduleDescription} </p>
                </Grid>
                <Grid item xs={12} sm={12} md={12} xl={12} sx={{display: "flex",justifyContent: "flex-end"}}>
                  <img src={gitlab} style={{ height: "30px", width: "30px",  cursor: 'pointer' }} onClick={() => { window.open(details.gitWebUrl, '_blank') }} />
                </Grid>
                {/* <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginTop: "1rem",
                      marginBottom: "1rem",
                    }}
                  >
                    moduleComplexity
                      {[1, 2, 3, 4, 5].map((index) => ( 
                      <Radio
                        key={index}
                        value={`radio${index}`}
                        control={<Radio />}
                        checked={index <= mapComplexityToNumber(details.moduleComplexity)}
                      />
                    ))}
                  </div> */} 
              </Grid>
              
              <Grid item xs={12} sm={5} sx={{
                borderLeft: ['none', '1px dashed #000'],
                borderRight: ['none', '1px dashed #000'],
                position: 'relative',
                textAlign: ['left', 'center'],
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space between',
              }}>
                <div style={{
                  height: '40%',
                  borderBottom: '1px dashed #000',
                  display: 'flex',
                  flexDirection: 'column',
                  margin: '0 0 4px 0',
                  alignItems: 'flex-start',
                  justifyContent: 'flex-start',
                }}>
                  <p style={{
                    paddingLeft: '0.52vw',
                    paddingTop: '1.08vh',
                    marginTop: '-6px',
                    marginBottom: '4px',
                    fontWeight: '500'
                  }}>Skills Required</p>
                  <div   className="scrollable"style={{ display: 'flex', height: '40px',width: "91%", marginTop: '10px', marginLeft: '20px' }}>
                    {details.skillsRequired.map((item) => (
                      <p
                        key={item._id}
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
                        {item.name}
                      </p>
                    ))}
                  </div>
                </div>
                <div style={{ height: '60%' }}>
                  <div style={{
                    width: '25%',
                    height: '103%',
                    float: 'left',
                    borderRight: '1px dashed #000',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    textAlign: ['left', 'center']
                  }}>
                    <span style={{
                      fontSize: ['16px', '20px'],
                      marginTop: '0.5vh',
                      marginBottom: '0',
                      marginRight: ['-4px', '-10px', '-16px']
                    }}>Total Dev time Required </span>
                    <span style={{
                      fontSize: ['32px'],
                      marginTop: ['-8px', '-16px'],
                      marginLeft: ['-8px', '-12px'],
                      fontWeight: '500'
                    }}>
                      {details.totalDevTimeRequired}
                    </span>
                    <span style={{
                      fontSize: ['16px', '20px'],
                      marginTop: ['-8px', '-16px'],
                      marginLeft: ['-8px', '-12px']
                    }}>hours</span>
                  </div>
                  <div
                      style={{
                        width: "10%",
                        height: "103%",
                        float: "left",
                        borderRight: "1px dashed #000",
                        backgroundColor: "#D9D9D9",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "flex-end",
                        alignItems: "center",
                        marginTop: "-4px",
                      }}
                    >
                      <span
                        style={{
                          transform: "translateY(-60%) rotate(270deg)",
                          fontSize: ["21px"],
                          marginBottom: "1.6vh",
                          marginRight: "0.4vw",
                        }}
                      >
                          Status{" "}
                      </span>
                      <img
                        src={Vector}
                        style={{
                          marginBottom: "1vh",
                          // width: "1.25vw",
                          // height: "2.06vh",
                          height: "25px",
                          width: "25px"
                        }}
                      />
                    </div>
                

                   <div
                    className="scrollable"
                      style={{
                        display: "flex",
                        flexWrap: "nowrap",
                        // overflowX: "auto",
                        whiteSpace: "nowrap",
                        marginTop:"-1vw" 
                      }}
                    >
                             {taskdetails
                              .filter((d) => d.moduleId === details.moduleId)
                              .map((d, index) => (
                                <PieChartsTaskRow
                              moduleName={"Task"+(index + 1)}
                              completed={parseInt(d.completed)} assigned={parseInt(d.assigned)} unassigned={0} 
                              time={d.taskTime}
                            /> ))}
                </div> 
                </div>
                
              </Grid>
              <Grid item xs={12} sm={2.5} sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#D9D9D9',
                borderRadius: '0 8px 8px 0',
              }}>
                <div style={{
                  color: '#4E4E4E',
                  fontSize: '16px',
                  fontStyle: 'normal',
                  fontWeight: 500,
                  lineHeight: 'normal',
                  fontVariant: 'small-caps',
                  letterSpacing: '0.64px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  flexShrink: 0,
                  marginBottom: '8px',
                }}>
                  Due By
                </div>
                <div style={{
                  color: '#4E4E4E',
                  fontSize: '16px',
                  fontStyle: 'normal',
                  fontWeight: 500,
                  lineHeight: 'normal',
                  fontVariant: 'small-caps',
                  letterSpacing: '0.64px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  flexShrink: 0,
                  marginTop: '8px',
                  marginBottom: '8px',
                }}>
                 {details.moduleDateEnd.substring(0, 10)}
                </div> 
                {( ((isP001Allowed ) ||isP005Allowed) &&
                <select
                name="teams"
                id="teams"
                onChange={handleModuleChange}
                value={selectedModuleId}
                style={{
                  width: '145px',
                  height: '24px',
                  flexShrink: 0,
                  borderRadius: '4px',
                  background: '#FFF',
                  boxShadow: '2px 2px 4px 0px rgba(0, 0, 0, 0.25) inset, -2px -2px 4px 0px rgba(0, 0, 0, 0.25) inset',
                }}
              >
                <option value="" >Select team</option>
                {details.teamsAssigned.map((teamId) => {
                  const team = teamDetails.find((t) => t.teamId === teamId);
                  return (
                    <option key={teamId} value={teamId}>
                      {team ? team.teamName : teamId}
                    </option>
                  );
                })}
              </select>
                )}
              </Grid>
            </Grid> 
          </div>
        ))}
      </div>
    </div>
  );
}

export default Modulecard;
