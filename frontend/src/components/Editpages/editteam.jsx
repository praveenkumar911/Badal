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
  FormControl,
  Chip,
  CircularProgress,
} from '@mui/material';
import axios from 'axios';
import InputLabel from '@mui/material/InputLabel';

const CheckBoxOutlineBlankIcon = () => <Checkbox icon={<span style={{ visibility: 'hidden' }}>1</span>} />;
const CheckBoxIcon = () => <Checkbox checked icon={<span style={{ visibility: 'hidden' }}>1</span>} />;

function EditTeam(props) {
  const teamId = props.teamId;
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [teamMembers, setTeamMembers] = useState([]);
  const [selectedTeamMembers, setSelectedTeamMembers] = useState([]);
  const [teamName, setTeamName] = useState('');
  const [devTime, setDevTime] = useState('');
  const [skillsList, setSkillsList] = useState([]);
  const [customSkill, setCustomSkill] = useState('');
  const [skillsRequired, setSkillsRequired] = useState([]);
  const [OrgGitID, setOrgGitID] = useState();
  const permissionString = localStorage.getItem('permissions');
  const permissions = permissionString ? permissionString.split(',') : [];
  const [permissionextra, setPermissionextra] = useState([]);
  const isP001Allowed = permissions.includes('P001');
  const isP005Allowed = permissions.includes('P005');
  const orgId = localStorage.getItem('orgId');
  const [ngosList, setNgosList] = useState([]);
  const [projectOrg, setProjectorg] = useState();
  const [teamDetails, setTeamDetails] = useState(null);
  const [loadingTeamMembers, setLoadingTeamMembers] = useState(true);
  const [errorTeamMembers, setErrorTeamMembers] = useState(null);
  const[subgroupid,setSubgroupId]=useState()
  useEffect(() => {
    console.log("useEffect triggered", selectedTeamMembers);
    console.log("skills", skillsRequired);
  }, [selectedTeamMembers]);

  useEffect(() => {
    const fetchTeamDetails = async () => {
      try {
        const response = await axios.get(`http://10.8.0.14:5000/get-team-by-id/${teamId}`);
        setTeamDetails(response.data);
        setTeamName(response.data.teamName);  
        setDevTime(response.data.availabilityTime);
        setProjectorg(response.data.orgId);
        setSubgroupId(response.data.teamGitId)
        setSkillsRequired(response.data.teamSkills.map(skill => ({ name: skill })));
        // Set selectedTeamMembers and skillsRequired here
        const userIds = response.data.userIds;
        
        // Fetch usernames based on user IDs
        const usernamesResponse = await axios.post('http://10.8.0.14:5000/get-usernames', { userIds });
        const usernames = usernamesResponse.data.usernames;

        // Set usernames in the state
        setSelectedTeamMembers(userIds.map(userId => ({ userId, username: usernames[userIds.indexOf(userId)] })));

      } catch (error) {
        console.error('Error fetching team details:', error);
      } finally {
        setLoadingTeamMembers(false);
      }
    }; 

    // Call the fetchTeamDetails function
    fetchTeamDetails(); 
  }, [props.teamId]);

  useEffect(() => {
    const fetchNgos = async () => {
      try {
        if (isP001Allowed) {
          const res = await axios.get(`http://10.8.0.14:5000/get-org/${orgId}`);
          setNgosList(res.data);
        } else if (isP005Allowed) {
          const res = await axios.get(`http://10.8.0.14:5000/org/role2`);
          setNgosList(res.data);
        } else {
          console.error("Neither P001 nor P005 is allowed");
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchNgos();
  }, [isP001Allowed, isP005Allowed, orgId]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (isP001Allowed) {
          const permissionsResponse = await axios.get('http://10.8.0.14:5000/get-extra-permissions');
          const permissions = permissionsResponse.data.permissions;
          setPermissionextra(permissions);

          if (permissions && Array.isArray(permissions) && permissions.length >= 2) {
            const teamSize = permissions[1].count;
            const teamMembersResponse = await axios.get(`http://10.8.0.14:5000/get-users-by-org-for-team/${orgId}/${teamSize}`);
            setTeamMembers(teamMembersResponse.data);
          } else {
            console.error('Invalid or missing permissions data.');
          } 

          const orgDetailsResponse = await axios.get(`http://10.8.0.14:5000/organizationbyid/${orgId}`);
          setOrgGitID(orgDetailsResponse.data['gitlabId']);
        } else if (isP005Allowed) {
          const permissionsResponse = await axios.get('http://10.8.0.14:5000/get-extra-permissions');
          const permissions = permissionsResponse.data.permissions;
          setPermissionextra(permissions);

          if (permissions && Array.isArray(permissions) && permissions.length >= 2) {
            const teamSize = permissions[1].count;
            const teamMembersResponse = await axios.get(`http://10.8.0.14:5000/get-users-by-org-for-team/${projectOrg}/${teamSize}`);
            setTeamMembers(teamMembersResponse.data);
          } else {
            console.error('Invalid or missing permissions data.');
          }

          const orgDetailsResponse = await axios.get(`http://10.8.0.14:5000/organizationbyid/${projectOrg}`);
          setOrgGitID(orgDetailsResponse.data['gitlabId']);
        } else {
          console.error('Invalid permissions.');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    // Call the fetchData function
    fetchData();
  }, [isP001Allowed, isP005Allowed, orgId, projectOrg]);

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

  const handleProjectOwnerChange = (event) => {
    const selectedValue = event.target.value;
    setProjectorg(selectedValue);
  };

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

  const handleSubmit = async () => {
    try {
      // Fetch user Git IDs when selected team members change
      const userIds = selectedTeamMembers.map(member => member.userId);
      const response = await axios.post('http://10.8.0.14:5000/get-usergitids', { userIds });
      const userGitIds = response.data.usergitIds; // Extract userGitIds from the response
  
      // Log the user Git IDs
      console.log("User Git IDs:", userGitIds);
  
      // Fetch deselected team member IDs
      const deselectedUserIds = teamMembers
        .filter(member => !selectedTeamMembers.some(selectedMember => selectedMember.userId === member.userId))
        .map(deselectedMember => deselectedMember.userId);
  
      // Log the deselected user IDs
      console.log("Deselected User IDs:", deselectedUserIds);
  
      // Your submit logic here
      // This is a placeholder, replace with your actual logic
      setLoading(true);
  
      // Send data to /edit-subgroup-users/:subgroupId
      const subgroupResponse = await axios.put(`http://10.8.0.14:5000/update-subgroup/${subgroupid}`, {
        userIds: userGitIds, // Pass userGitIds in the payload as userIds
        name: teamName.replace(/\s/g, "_"),
        description: "created in Badal"
      });
  
      // If the GitLab subgroup update was successful
      if (subgroupResponse.status === 200) {
  
        const teamUpdateResponse = await axios.put(`http://10.8.0.14:5000/update-team/${teamId}`, {
          teamName,
          userIds: userIds,
          teamSkills: skillsRequired.map(skill => skill.name), // Add the team skills
          availabilityTime: devTime // Add dev time
        });
  
        // If the team update was successful
        if (teamUpdateResponse.status === 200) {
          // Send data to /update-teamuser
          const updateTeamUserResponse = await axios.put('http://10.8.0.14:5000/update-teamuser', {
            userIds: selectedTeamMembers.map(member => member.userId),
            teamId: teamId,
          });
  
          // If the team update was successful
          if (updateTeamUserResponse.status === 200) {
            // Send data to /delete-teamuser
            const deleteTeamUserResponse = await axios.put('http://10.8.0.14:5000/delete-teamuser', {
              userIds: deselectedUserIds, // Pass deselectedUserIds in the payload as userIds
              teamId: teamId,
            });
  
            // Set loading, success, or any other state as needed
            setTimeout(() => {
              setLoading(false);
              setSuccess(true);
              window.location.reload()
            }, 1000);
          } else {
            console.error('Error updating team user:', updateTeamUserResponse.data);
            setError('Error updating team user. Please try again.');
          }
        } else {
          console.error('Error updating team:', teamUpdateResponse.data);
          setError('Error updating team. Please try again.');
        }
      } else {
        console.error('Error updating GitLab subgroup:', subgroupResponse.data);
        setError('Error updating GitLab subgroup. Please try again.');
      }
    } catch (error) {
      console.error('Error during submission:', error);
      setError('Error during submission. Please try again.');
    }
  };
  
  
  
  
  

  return (
    <Container>
      <Box mt={4}>
        <Card variant="outlined" sx={{ maxWidth: 500 }}>
          <CardContent>
            <Typography variant="h4" sx={{ textAlign: 'center' }}>
              Edit Team
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
                      height: '30px',
                    },
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 'none',
                    },
                  }}
                />
                <Typography variant="subtitle2" sx={{ color: 'red', fontSize: '20px' }}>
                  *
                </Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={2}>
  <Typography style={{ minWidth: 120, fontWeight: 'bold' }}>
    Select Members:
  </Typography>
  {loadingTeamMembers ? (
    <CircularProgress size={24} />
  ) : (
    <Autocomplete 
      multiple
      id="checkboxes-tags-demo"
      options={teamMembers}
      disableCloseOnSelect
      getOptionLabel={(option) => option.username || ''}
      renderOption={(props, option, { selected }) => (
        <li {...props}>
          <Checkbox
            icon={<CheckBoxOutlineBlankIcon />}
            checkedIcon={<CheckBoxIcon />}
            style={{ marginRight: 8 }}
            checked={selected}
          />
          {option.username}
        </li>
      )}
      style={{ width: 350 }}
      onChange={(event, newValues) => {
        // Find the deselected team member
        const deselectedMember = selectedTeamMembers.find(member => !newValues.some(value => value.username === member.username));
        if (deselectedMember) {
          console.log('Deselected team member ID:', deselectedMember.username);

          // Check if the member already exists in teamMembers
          const isDuplicate = teamMembers.some(member => member.username === deselectedMember.username);

          // Update teamMembers state if not a duplicate
          if (!isDuplicate) { 
            setTeamMembers(prevMembers => [...prevMembers, deselectedMember]);
          }
        }
        setSelectedTeamMembers(newValues);
      }}
      value={selectedTeamMembers}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Select Team Members"
          placeholder="Team Members"
        />
      )}
    />
  )}
</Box>              <Box display="flex" alignItems="center" gap={2}>
                <Typography style={{ minWidth: 120, fontWeight: 'bold' }}>
                  Select Skills:
                </Typography>
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
                        label={(option.name && option.name.length > 4) ? option.name.substring(0, 4) + '..' : option.name}
                        {...getTagProps({ index })}
                      />
                    ))
                  }
                />
                <Typography variant="subtitle2" sx={{ color: 'red', fontSize: '20px', marginLeft: '0.2vw' }}>
                  *
                </Typography>
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
                />
                <Typography variant="subtitle2" sx={{ color: 'red', fontSize: '20px' }}>
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
                  onClick={handleSubmit}
                >
                  Edit Team
                </Button>
                {loading && <CircularProgress style={{ marginLeft: '10px' }} />}
                {success && (
                  <div style={{ color: 'green', marginLeft: '10px' }}>
                    Team updated successfully!
                  </div>
                )}
                {error && <div style={{ color: 'red', marginLeft: '10px' }}>{error}</div>}
                {errorTeamMembers && (
                  <div style={{ color: 'red', marginLeft: '10px' }}>{errorTeamMembers}</div>
                )}
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}

export default EditTeam;
