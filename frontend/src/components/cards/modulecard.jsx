import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Box,
  Typography,
  Divider,
  CardHeader,
  CardMedia,
  CardActions,
  CardActionArea,
  Chip,
} from "@mui/material";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import DonutSmallIcon from "@mui/icons-material/DonutSmall";
import tile from "../icons/placeHolder.jpg";
import axios from "axios";
import swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

export const ModuleCard = ({ product, projectdata }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [teamsResponse, setTeamResponse] = useState([]);
  const [assignedTeamName, setAssignedTeamName] = useState([]);
  const [permissionextra, setPermissionextra] = useState([]);

  const permissionString = localStorage.getItem("permissions");
  const permissions = permissionString ? permissionString.split(",") : [];
  const isP001Allowed = permissions.includes("P001");
  const isP002Allowed = permissions.includes("P002");
  const isP003Allowed = permissions.includes("P003");
  const isP004Allowed = permissions.includes("P004");
  const isP005Allowed = permissions.includes("P005");
  const orgId = localStorage.getItem("orgId");

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchExtraPermissions = async () => {
      try {
        const response = await axios.get("http://10.8.0.12:5000/get-extra-permissions");
        setPermissionextra(response.data.permissions);
      } catch (error) {
        console.error("Error fetching extra permissions:", error);
      }
    };
    fetchExtraPermissions();
  }, []);

  useEffect(() => {
    const fetchTeamNames = async () => {
      try {
        // Check if product.assigned_teams is not null or undefined
        if (product.assigned_teams && product.assigned_teams.length > 0) {
          // Array to hold promises for fetching team names
          const teamNamePromises = product.assigned_teams.map(async (teamId) => {
            const response = await axios.get(`http://10.8.0.12:5000/get-team-by-id/${teamId}`);
            const team = response.data;
            if (team) {
              return team.teamName;
            } else {
              console.error(`Team not found for ID: ${teamId}`);
              return null; // Return null for teams not found
            }
          });
  
          // Resolve all promises to get team names
          const teamNames = await Promise.all(teamNamePromises);
          
          // Filter out null values (teams not found)
          const validTeamNames = teamNames.filter(name => name !== null);
  
          // Set the list of team names
          setAssignedTeamName(validTeamNames);
        } else {
          console.error("Assigned team IDs are null or undefined");
        }
      } catch (error) {
        console.error("Error fetching team names:", error);
      }
    };
  
    fetchTeamNames();
  }, [product.assigned_teams]);
  
  

  const truncate = (desc) => {
    const num = 32;
    return desc.length <= num ? desc : `${desc.slice(0, num)}...`;
  };

  const truncateTitle = (name) => {
    const num = 18;
    return name.length <= num ? name : `${name.slice(0, num)}...`;
  };

  const handleImageClick = async () => {
    setIsLoading(true);
    try {
      let teamsEndpoint;
      if (isP001Allowed && projectdata.assignedTo === orgId) {
        teamsEndpoint = `http://10.8.0.12:5000/get-org-teams/${orgId}`;
      } else if (isP005Allowed) {
        teamsEndpoint = "http://10.8.0.12:5000/get-all-teams";
      } else {
        swal.fire({
          icon: 'error',
          title: 'Access Denied',
          text: 'You do not have permission to perform this action.',
        });
        return;
      }
     

      const teamsResponse = await axios.get(teamsEndpoint);
      setTeamResponse(teamsResponse);

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
          showLoaderOnConfirm: true,
        });

        if (selectedTeam) {
          const selectedTeamProduct = teamsResponse.data.find((team) => team.teamName === selectedTeam);

          if (product.assigned_teams.includes(selectedTeamProduct.teamId)) {
            swal.fire({
              icon: "error",
              title: "Team Already Assigned",
              text: "The selected team is already assigned to the module.",
            });
            return;
          }

          const teamAssignedModulesCount = selectedTeamProduct.assignedModules.length;
          const teamPermission = permissionextra.find((permission) => permission.permission === "team");
          if (teamPermission && teamAssignedModulesCount >= parseInt(teamPermission.count)) {
            swal.fire({
              icon: "error",
              title: "Assignment Limit Exceeded",
              text: "The selected team can be assigned to only one module.",
            });
            return;
          }

          const moduleGitID = product.gitlabid;
          const teamGitID = selectedTeamProduct.teamGitId;
          const forkAndAddToSubgroupResponse = await axios.post(
            `http://10.8.0.12:5000/fork-and-add-to-subgroup/${moduleGitID}/${teamGitID}`
          );
          const { id: forkedGitlabId, web_url: forkedGitlabUrl } = forkAndAddToSubgroupResponse.data;

          const createWorkspacePayload = {
            projectId: product.projectId,
            moduleId: product._id,
            moduleCreatedBy: product.modulecreatedby,
            assignedTeam: selectedTeamProduct.teamId,
            moduleDateCreated: product.moduleDateCreated,
            workspaceName: product.name,
            workspaceDescription: product.description,
            moduleDateStart: product.created_at,
            moduleDateEnd: product.updated_at,
            skillsRequired: product.skills,
            totalDevTimeRequired: product.totalDevTimeRequired,
            moduleComplexity: "3",
            forkedGitlabId,
            forkedGitlabUrl,
            gitModuleName: product.gitlabid,
            numberOfTask: product.numberOfTask,
            moduleField: "",
            assigned: product.assigned,
            unassigned: product.unassigned,
            completed: product.completed,
            taskIds: product.taskIds,
            requirementsDocument: product.requirementsDocument,
            uiMocks: product.uiMocks,
            apiDocument: product.apiDocument,
            dbDocument: product.dbDocument,
          };

          const createWorkspaceResponse = await axios.post(
            "http://10.8.0.12:5000/create-workspace",
            createWorkspacePayload
          );
          const appendTeamsResponse = await axios.put(
            `http://10.8.0.12:5000/append-teams/${product._id}`,
            { teamIds: [selectedTeamProduct.teamId] }
          );

          const createdWorkspaceId = createWorkspaceResponse.data.savedWorkspace.workspaceId;
          const baseurl=createWorkspaceResponse.data.savedWorkspace.forkedGitlabUrl;

          await axios.post(`http://10.8.0.12:5000/migrate-tasks/${createdWorkspaceId}/${product._id}` ,{ baseUrl: baseurl });

          setIsLoading(false);
          swal.fire({
            icon: "success",
            title: "Success",
            text: "Module successfully assigned to the selected team.",
          });
        }
        window.location.reload()
      } else {
        swal.fire({
          icon: "info",
          title: "No Teams Found",
          text: "You are not part of any teams.",
        });
      }
    } catch (error) {
      console.error("Error handling image click:", error);
      setIsLoading(false);
      swal.fire({
        icon: "error",
        title: "Error",
        text: "An error occurred. Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClick = async () => {
    try {
      // Fetch user data
      const userId = localStorage.getItem('userId');
      const userResponse = await axios.get(`http://10.8.0.12:5000/get-user/${userId}`);
      const userData = userResponse.data[0];  // Assuming userData is an array with one object
      const userTeams = userData.teamId || [];
  
      // Check if P002 is the only permission allowed
      const isOnlyP002Allowed = isP002Allowed && !isP001Allowed && !isP003Allowed && !isP004Allowed;
  
      if (isOnlyP002Allowed) {
        // Find a matching workspace for the user's teams
        const matchedWorkspace = product.workspaceinfo.find(workspace => userTeams.includes(workspace.teamId));
  
        if (matchedWorkspace) {
          // Navigate to task workspace if a match is found
          navigate(`/taskworkspace/${matchedWorkspace.workspaceId}`);
        } else {
          // Navigate to task details if no match is found
          navigate(`/tasks/${product._id}`, {
            state: {
              id: product._id,
              name: product.name,
              desc: product.description,
              status: product.status,
              tag: product.tags,
              assigned_to: product.assigned_to,
              created_at: product.created_at,
              updated_at: product.updated_at,
            },
          });
        }
      } else {
        // Navigate to the task details page for all other conditions
        navigate(`/tasks/${product._id}`, {
          state: {
            id: product._id,
            name: product.name,
            desc: product.description,
            status: product.status,
            tag: product.tags,
            assigned_to: product.assigned_to,
            created_at: product.created_at,
            updated_at: product.updated_at,
          },
        });
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      // Handle error gracefully
      swal.fire({
        icon: "error",
        title: "Error",
        text: "An error occurred. Please try again later.",
      });
    }
  };
  
  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#f2fffe",
        marginBottom: 5,
      }}
    >
      <CardActionArea>
        <CardMedia
          component="img"
          height="fit-content"
          image={tile}
          sx={{
            borderBottomLeftRadius: "8%",
            borderBottomRightRadius: "8%",
            backgroundSize: "cover",
          }}
          onClick={handleImageClick}
        />
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginX: 1,
            marginTop: 2,
          }}
          onClick={handleClick}
        >
          <Typography variant="body2" color="text.secondary">
  {assignedTeamName.length > 0 ? (
    assignedTeamName.map((teamName, index) => (
      <Chip
        key={index}
        icon={<PeopleAltIcon />}
        label={`Assigned To: ${teamName}`}
        variant="outlined"
        style={{ marginRight: '5px' }}
      />
    ))
  ) : (
    <Chip label="Not Allotted" variant="outlined" />
  )}
</Typography>

          <Typography variant="body2" color="text.secondary">
            {product.status_bol ? (
              <Chip
                icon={<DonutSmallIcon />}
                label={product.status}
                variant="outlined"
              />
            ) : null}
          </Typography>
        </Box>
        <CardHeader
          title={truncateTitle(product.name)}
          sx={{
            fontSize: "24px",
            fontWeight: "bold",
            height: 50,
            width: "100%",
          }}
          onClick={handleClick}
        />
        <Box sx={{ flexGrow: 0 }}>
          <CardContent>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontSize: "22px", height: 75, width: "100%" }}
              onClick={handleClick}
            >
              {truncate(product.description)}
            </Typography>
          </CardContent>
        </Box>
      </CardActionArea>
      <Divider />
      <CardActions disableSpacing style={{ marginBottom: 0 }} onClick={handleClick}>
        <Typography
          color="textSecondary"
          sx={{ marginLeft: "auto" }}
          variant="body2"
        >
          {`Ongoing: ${product.noOfOngoingTasks}`}
          &nbsp; &nbsp;
          {`Done: ${product.noOfCompletedTasks}`}
        </Typography>
      </CardActions>
    </Card>
  );
};

