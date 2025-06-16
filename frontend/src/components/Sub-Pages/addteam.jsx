import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Card,
  CardContent,
  Button,
  Autocomplete,
  Checkbox,
  Select,
  MenuItem,
  Radio,
  FormControl,
  FormControlLabel,
  
  Chip, // Add Chip from MUI
} from '@mui/material';
import axios from 'axios';
import InputLabel from '@mui/material/InputLabel';
import CircularProgress from '@mui/material/CircularProgress';
import Swal from 'sweetalert2';

const CheckBoxOutlineBlankIcon = () => <Checkbox icon={<span style={{ visibility: 'hidden' }}>1</span>} />;
const CheckBoxIcon = () => <Checkbox checked icon={<span style={{ visibility: 'hidden' }}>1</span>} />;

function CreateTeam() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [teamMembers, setTeamMembers] = useState([]);
  const [selectedTeamMembers, setSelectedTeamMembers] = useState([]);
  const [teamName, setTeamName] = useState('');
  const [devTime, setDevTime] = useState('');
  const [skillsList, setSkillsList] = useState([]);
  const [customSkill, setCustomSkill] = useState(''); // Add customSkill state
  const [skillsRequired, setSkillsRequired] = useState([]); 
  const [OrgGitID,setOrgGitID]=useState()
  const permissionString = localStorage.getItem('permissions');
  const permissions = permissionString ? permissionString.split(',') : [];
  const [permissionextra, setPermissionextra] = useState([]);
  const isP001Allowed = permissions.includes('P001');
  const isP002Allowed = permissions.includes('P002');
  const isP003Allowed = permissions.includes('P003');
  const isP004Allowed = permissions.includes('P004');
  const isP005Allowed= permissions.includes('P005')
  const orgId=localStorage.getItem('orgId')
  const userId=localStorage.getItem('userId')
  const [ngosList, setNgosList] = useState([]);
  const[projectOrg,setProjectorg]=useState()
  useEffect(() => { 
    const fetchNgos = async () => {
      try { 
        if (isP001Allowed) {
          const res = await axios.get(`http://10.8.0.14:5000/get-org/${orgId}`); 
          setNgosList([res.data]);
          console.log("erdfgh", ngosList);
        } else if (isP005Allowed) {
          const res = await axios.get(`http://10.8.0.14:5000/org/role2`);
          setNgosList(res.data);
          console.log("erdfgh", res.data); 
        } else {
          // Handle the case where neither P001 nor P005 is allowed
          console.error("Neither P001 nor P005 is allowed"); 
        }
      } catch (error) {
        console.log(error);
      } 
    };
  
    fetchNgos();
  }, [isP001Allowed,isP005Allowed, orgId]); 
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (isP001Allowed) {
          // Make the API call to get extra permissions
          const permissionsResponse = await axios.get('http://10.8.0.14:5000/get-extra-permissions');
          const permissions = permissionsResponse.data.permissions;
          setPermissionextra(permissions);
  
          // Make the API call to get team members
          if (permissions && Array.isArray(permissions) && permissions.length >= 2) {
            const teamSize = permissions[2].count;
            const teamMembersResponse = await axios.get(`http://10.8.0.14:5000/get-users-by-org-for-team/${orgId}/${teamSize}`);
            setTeamMembers(teamMembersResponse.data);
          } else {
            console.error('Invalid or missing permissions data.');
          }
  
          // Make the API call to get organization by ID
          const orgDetailsResponse = await axios.get(`http://10.8.0.14:5000/organizationbyid/${orgId}`);
          setOrgGitID(orgDetailsResponse.data['gitlabId']);
        } else if (isP005Allowed) {
          // Make the API call to get extra permissions for P005
          const permissionsResponse = await axios.get('http://10.8.0.14:5000/get-extra-permissions');
          const permissions = permissionsResponse.data.permissions;
          setPermissionextra(permissions);
  
          // Make the API call to get team members
          if (permissions && Array.isArray(permissions) && permissions.length >= 2) {
            const teamSize = permissions[1].count;
            const teamMembersResponse = await axios.get(`http://10.8.0.14:5000/get-users-by-org-for-team/${projectOrg}/${teamSize}`);
            setTeamMembers(teamMembersResponse.data);
          } else {
            console.error('Invalid or missing permissions data.');
          }
  
          // Make the API call to get organization by ID
          const orgDetailsResponse = await axios.get(`http://10.8.0.14:5000/organizationbyid/${projectOrg}`);
          setOrgGitID(orgDetailsResponse.data['gitlabId']);
        } else {
          console.error('Invalid permissions.');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        // Handle errors as needed
      }
    };
  
    // Call the fetchData function
    fetchData();
  }, [isP001Allowed, isP005Allowed, orgId, projectOrg]);  // Include projectOrg in the dependency array
  
  const handleProjectOwnerChange = (event) => {
    const selectedValue = event.target.value;
    setProjectorg(selectedValue);
  };
  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const res = await axios.get('http://10.8.0.14:5000/api/skills');
        setSkillsList(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchSkills();
  }, []);

  const handleEnter = (event) => {
    if (event.key === 'Enter' && customSkill && skillsRequired.length < 10) {
      setSkillsRequired([...skillsRequired, { name: customSkill }]);
      setCustomSkill('');
    }
  };

  const handleCustomSkillInput = (event) => {
    if (skillsRequired.length < 10) {
      setCustomSkill(event.target.value);
    }
  };
  const handleAddTeam = async () => {
    try {
      setLoading(true);
      // Step 1: Create subgroup with users
      const createSubgroupResponse = await axios.post(`http://10.8.0.14:5000/create-subgroup-with-users/${OrgGitID}`, {
        name: teamName.replace(/\s/g, "_"), // Replace with an appropriate name
        description: 'Created In Badal ', // Replace with an appropriate description
        userIds: selectedTeamMembers.map(member => member.gitlabId),
      });
  
      const gitgroupId = createSubgroupResponse.data.id;
      const GitWebUrl = createSubgroupResponse.data.web_url;
  
      // Step 2: Create team
      
      if (isP001Allowed) {
        const createTeamPayload = {
          TeamName: teamName,
          UserIDs: selectedTeamMembers.map(member => member.userId),
          TeamGitID: gitgroupId,
          AvailabilityTime: devTime,
          TeamSkills: skillsRequired.map(skill => skill.name),
          web_url: GitWebUrl,
          OrgId:orgId,
          AssignedModules: [], // You may include assigned modules if applicable
        };
        const createTeamResponse = await axios.post('http://10.8.0.14:5000/create-team', createTeamPayload);
  
        const teamId = createTeamResponse.data.teamId;
    
        // Step 3: Update team users
        const updateTeamUserResponse = await axios.put('http://10.8.0.14:5000/update-teamuser', {
          userIds: selectedTeamMembers.map(member => member.userId),
          teamId: teamId,
        });
    
        console.log('Team created successfully!', updateTeamUserResponse.data);
        //window.location.reload();
      } else if (isP005Allowed) {
        // If P005 is allowed, include projectOrg in the payload
        const createTeamPayload = {
          TeamName: teamName,
          UserIDs: selectedTeamMembers.map(member => member.userId),
          TeamGitID: gitgroupId,
          AvailabilityTime: devTime,
          TeamSkills: skillsRequired.map(skill => skill.name),
          web_url: GitWebUrl,
          OrgId:projectOrg, 
          AssignedModules: [], // You may include assigned modules if applicable
        };
        const createTeamResponse = await axios.post('http://10.8.0.14:5000/create-team', createTeamPayload);
  
        const teamId = createTeamResponse.data.teamId;
    
        // Step 3: Update team users
        const updateTeamUserResponse = await axios.put('http://10.8.0.14:5000/update-teamuser', {
          userIds: selectedTeamMembers.map(member => member.userId),
          teamId: teamId,
        });
    
        console.log('Team created successfully!', updateTeamUserResponse.data);
        setSuccess(true);
        setError('');
        // Reload the page or perform any other action upon success
        window.location.reload();
      }
     window.location.reload();
    } catch (error) {
      console.error('Error creating team:', error);
      setSuccess(false); 
      setError(`Failed to create! Team-Name Already Exists.`);
    } finally {
      setLoading(false);
     window.location.reload();
    }
  };
  
  
  
  return (
    <Container>
      <Box mt={4}>
        <Card variant="outlined" sx={{ maxWidth: 500 }}>
          <CardContent>
            <Typography variant="h4" sx={{ textAlign: 'center' }}>
              Add a new Team
            </Typography>
            <Box display="flex" flexDirection="column" gap={2}>
              
              <Box display="flex" alignItems="center" gap={2}>
       

                <Typography style={{ minWidth: 120, fontWeight: 'bold' }}>
                  Team Name:
                </Typography>
                <TextField
                  id="outlined-basic"
                  label="Team Name"
                  variant="outlined"
                  fullWidth
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  sx={{
                    '& .MuiInputBase-input': {
                      height: '30px', // Adjust the height as needed
                    },
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 'none', // You can adjust the border radius or any other styles here
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



<Box display="flex" alignItems="center" gap={2} style={{ width: '100%' }}>
  {isP005Allowed && (
    <Box display="flex" alignItems="center" gap={2} style={{ width: '100%' }}>
      <Typography style={{ minWidth: 120, fontWeight: 'bold' }}>
        Team Owner:
      </Typography>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Select Org</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={projectOrg}
          onChange={handleProjectOwnerChange}
          label="Select Org"
        >
          {ngosList.map((ngo) => (
            <MenuItem key={ngo._id} value={ngo.orgId}>
              {ngo.orgName}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Typography
                  variant="subtitle2"
                  sx={{ color: 'red', fontSize: '20px' }}
                >
                  *
                </Typography>
    </Box>
  )}
</Box>

              <Box display="flex" alignItems="center" gap={2}>
                <Typography style={{ minWidth: 120, fontWeight: 'bold' }}>
                  Select Members:
                </Typography>
                <Autocomplete
                  multiple
                  id="checkboxes-tags-demo"
                  options={teamMembers}
                  disableCloseOnSelect
                  getOptionLabel={(option) =>
                    `${option.username}`
                  }
                  renderOption={(props, option, { selected }) => (
                    <li {...props}>
                      <Checkbox
                        icon={<CheckBoxOutlineBlankIcon />}
                        checkedIcon={<CheckBoxIcon />}
                        style={{ marginRight: 8 }}
                        checked={selected}
                      />
                      {`${option.username}`}
                    </li>
                  )}
                  style={{ width: 350 }}
                  onChange={(event, newValue) =>
                    setSelectedTeamMembers(newValue)
                  }
                  value={selectedTeamMembers}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select Team Members"
                      placeholder="Team Members"
                    />
                  )}
                />
                <Typography
                  variant="subtitle2"
                  sx={{ color: 'red', fontSize: '20px' }}
                >
                  *
                </Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={2}>
        <Typography style={{ minWidth: 120, fontWeight: "bold" }}>Select Skills:</Typography>

        <Autocomplete
          multiple
          id="tags-standard"
          options={skillsList}
          getOptionLabel={(option) => option.name}
          value={skillsRequired}
          onChange={(_, v) => {
            setSkillsRequired(v);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              onKeyDown={handleEnter}
              onChange={handleCustomSkillInput}
              value={customSkill}
            />
          )}
          style={{ width: 300, maxHeight: 150, overflowY: 'auto' }}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip
                key={index}
                label={option.name.length > 4 ? option.name.substring(0, 4) + ".." : option.name}
                {...getTagProps({ index })}
              />
            ))
          }
        />
        <Typography variant="subtitle2" sx={{ color: 'red', fontSize: '20px', marginLeft: "0.2vw" }}>*</Typography>
      </Box>
              <Box display="flex" alignItems="center" gap={2}>
                <Typography style={{ minWidth: 120, fontWeight: 'bold' }}>
                  Availability
                </Typography>
                <TextField
                  id="outlined-basic"
                  label=" Availability(in hours)"
                  variant="outlined"
                  fullWidth
                  value={devTime}
                  onChange={(e) => setDevTime(e.target.value)}
                  sx={{
                    '& .MuiInputBase-input': {
                      height: '20px', // Adjust the height as needed
                    },
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 'none', // You can adjust the border radius or any other styles here
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

              <Box mt={2} display="flex" justifyContent="center">
          
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: '#0e66ac',
                    '&:hover': {
                      backgroundColor: '#66abe3',
                    },
                  }}
                  onClick={handleAddTeam}
                >
                  Add Team
                </Button>
                {loading && <CircularProgress style={{ marginLeft: '10px' }} />}
        {success && <div style={{ color: 'green', marginLeft: '10px' }}>Team created successfully!</div>}
        {error && <div style={{ color: 'red', marginLeft: '10px' }}>{error}</div>}
      
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}

export default CreateTeam;
