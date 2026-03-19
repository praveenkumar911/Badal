import React, { useState,useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Card,
  CardContent,
  Button,
  Select,
  MenuItem,
  Radio,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Backdrop, CircularProgress,
} from '@mui/material';
import Chip from '@mui/material/Chip';
import { FormHelperText } from '@material-ui/core';
import AWS from "aws-sdk";
import axios from 'axios';
import material from "../icons/material.svg";
import InputLabel from '@mui/material/InputLabel';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import healthcare from "../icons/healthcare.svg";
import education from "../icons/education.svg";
import livelihood from "../icons/rural.svg"

import Checkbox from '@mui/material/Checkbox';

import Autocomplete from '@mui/material/Autocomplete';


function Createproject() {
  const permissionString = localStorage.getItem('permissions');
  const permissions = permissionString ? permissionString.split(',') : [];
  const isP001Allowed = permissions.includes('P001');
  const isP002Allowed = permissions.includes('P002');
  const isP003Allowed = permissions.includes('P003');
  const isP004Allowed = permissions.includes('P004');
  const isP005Allowed= permissions.includes('P005');
  const isP006Allowed= permissions.includes('P006')
  console.log(permissions);
  const orgId=localStorage.getItem('orgId')
  const userId=localStorage.getItem('userId')
  const [customSkill, setCustomSkill] = useState('');
  const [selectedImage, setSelectedImage] = useState('');
  const [isLoading, setIsLoading] = useState(false); 
  AWS.config.update({
    accessKeyId: "minioadmin",
    secretAccessKey: "minioadmin",
    endpoint: "https://pl-minio.iiit.ac.in", // Ensure this is correct
    s3ForcePathStyle: true, // Set to true for MinIO
  });
  
  const [usefulData, setUsefulData] = useState({
    projectName: '',
    projectField: '',
    projectDescription: '',
    projectOwner: '',
    projectManager: '',
    projectDateStart: '',
    projectDateEnd: '', 
    skillsRequired: [],
    totalDevTimeRequired: '',
    projectDateStart: '',
    projectDateEnd: '',
    completed:"0",
    assigned:"0",
    unassigned:"0",
    latitude:'',
    longitude:'',
    projectImage:'',
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [skillsList, setSkillsList] = useState([]);
  const [ngosList, setNgosList] = useState([]);
  

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const res = await axios.get('http://10.8.0.14:5000/api/skills');
        setSkillsList(res.data);
      } catch (error) {
        console.log(error);
      }
    }
    fetchSkills();
  }, []);

  useEffect(() => {
    const fetchNgos = async () => {
      try {
        console.log("isP005Allowed:", isP005Allowed); // Debugging
        console.log("isP006Allowed:", isP006Allowed); // Debugging
  
        if (isP005Allowed) {
          console.log("Fetching data for P005...");
          const res = await axios.get(`http://10.8.0.14:5000/org/role2`);
          setNgosList(res.data);
        } else if (isP006Allowed) {
          console.log("Fetching data for P006...");
          const res = await axios.get(`http://10.8.0.14:5000/org/role2`);
          setNgosList(res.data);
        } else {
          console.error("Neither P005 nor P006 is allowed");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    fetchNgos();
  }, [isP005Allowed, isP006Allowed]); // Only depend on isP005Allowed and isP006Allowed
  
  

  const [projectManagers, setProjectManagers] = useState([]);

  const fetchUsersByOrg = async (projectOwner) => {
    try {
      const res = await axios.get(`http://10.8.0.14:5000/get-users-by-org/${projectOwner}`);
      setProjectManagers(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  // const handleProjectOwnerChange = (event) => {
  //   const selectedValue = event.target.value;
  //   setUsefulData({ ...usefulData, projectOwner: selectedValue });
  //   setValidationErrors({ ...validationErrors, projectOwner: '' });
  //   fetchUsersByOrg(selectedValue);
  // };
  const handleProjectOwnerChange = (event) => {
    const selectedValue = event.target.value;
    const selectedNgo = ngosList.find((ngo) => ngo.orgId === selectedValue);
    setUsefulData({
      ...usefulData,
      projectOwner: selectedValue,
      latitude: selectedNgo.latitude,
      longitude: selectedNgo.longitude,
    });
    setValidationErrors({ ...validationErrors, projectOwner: '' });
    fetchUsersByOrg(selectedValue);
  };
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    
    // Prepare S3 params
    const s3 = new AWS.S3();
    const params = {
      Bucket: "psuw001", // Replace with your MinIO bucket name
      Key: `uploads/${file.name}`, // Define the path where the file should be stored
      Body: file,
      ACL: 'public-read', // Set access control for the uploaded file
      ContentType: file.type, // Set content type based on file type
    };
  
    // Upload file to MinIO
    s3.upload(params, (err, data) => {
      if (err) {
        console.error("Error uploading file:", err);
        // Handle error (e.g., show error message)
      } else {
        console.log("File uploaded successfully:", data.Location);
        // Update the state with the uploaded image URL or any other necessary data
        setUsefulData({ ...usefulData, projectImage: data.Location });
      }
    });
  };
  

  const handleManager = (event) => {
    setUsefulData({ ...usefulData, projectManager: event.target.value });
    setValidationErrors({ ...validationErrors, projectManager: '' });
  };

  const handleEnter = (event) => {
    if (event.key === 'Enter' && customSkill && usefulData.skillsRequired.length < 10) {
      setUsefulData({ ...usefulData, skillsRequired: [...usefulData.skillsRequired, { name: customSkill }] });
      setCustomSkill('');
    }
  };

  const handleCustomSkillInput = (event) => {
    if (usefulData.skillsRequired.length < 10) {
      setCustomSkill(event.target.value);
    //  setValidationErrors({ ...validationErrors, skillsRequired: '' });
    }
  };
  const handleField = (value) => {
    setSelectedImage(value);
    setUsefulData({ ...usefulData, projectField: value });
    setValidationErrors({ ...validationErrors, projectField: '' });
  };
  
  
  const handleCreateProject = async () => {
    setIsLoading(true);
    try {
      if (!usefulData.projectName.trim()) {
        setValidationErrors({
          ...validationErrors,
          projectName: 'Project Name is required',
        });
        return;
      }

      // Validate Description
      if (!usefulData.projectDescription.trim()) {
        setValidationErrors({
          ...validationErrors,
          projectDescription: 'Description is required',
        });
        return;
      }

      // Validate Project Field
      if (!usefulData.projectField.trim()) {
        setValidationErrors({
          ...validationErrors,
          projectField: 'Project Field is required',
        });
        return;
      }

      // Validate Project Owner
      if (!usefulData.projectOwner) {
        setValidationErrors({
          ...validationErrors,
          projectOwner: 'Project Owner is required',
        });
        return;
      }

      // Validate Project Manager
      if (!usefulData.projectManager) {
        setValidationErrors({
          ...validationErrors, 
          projectManager: 'Project Manager is required',
        });
        return;
      }
        if (!usefulData.projectDateStart) {
          setValidationErrors({
            ...validationErrors,
            projectDateStart: 'Start Date is required',
          });
          return;
        } else {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          // Start Date is selected, check if it is today
          const startDate = new Date(usefulData.projectDateStart);
          startDate.setHours(0, 0, 0, 0);

          if (startDate.getTime() < today.getTime()) {
            setValidationErrors({
              ...validationErrors,
              projectDateStart: 'Start Date must be today',
            });
            return;
          }
        }
 
      if (!usefulData.projectDateEnd) {
        setValidationErrors({
          ...validationErrors,
          projectDateEnd: 'End Date is required',
        });
        return;
      }

      // Check if End Date is less than or equal to Start Date
      const endDate = new Date(usefulData.projectDateEnd);
      endDate.setHours(0, 0, 0, 0);

      if (endDate <= usefulData.projectDateStart) {
        setValidationErrors({
          ...validationErrors,
          projectDateEnd: 'End Date must be more than Start Date',
        });
        return;
      }

      // Validate Skills (You may customize this validation based on your requirements)
      if (usefulData.skillsRequired.length === 0) {
        setValidationErrors({
          ...validationErrors,
          skillsRequired: 'At least one skill is required',
        });
        return;
      }

      // Validate Dev Time
      if (!usefulData.totalDevTimeRequired.trim()) {
        setValidationErrors({
          ...validationErrors,
          totalDevTimeRequired: 'Dev Time is required',
        });
        return;
      }

      // Create project in GitLab
      const projectField = usefulData.projectField;
    let ngoAbbreviation = '';
    switch (projectField) {
      case 'healthcare':
        ngoAbbreviation = 'PM';
        break;
      case 'education':
        ngoAbbreviation = 'PE';
        break;
      case 'livelihood':
        ngoAbbreviation = 'PL';
        break;
      default:
        break;
    }
      const {  projectOwner } = usefulData;
      const ngo = ngosList.find((ngo) => ngo.orgId === projectOwner);
      const GitGroupID=ngo.gitlabId
      const ngoFirstLetter = ngo.orgName.charAt(0).toUpperCase();
      const projectCount = ngo.projects.length + 1;
      const projectName = `${ngoAbbreviation}${ngoFirstLetter}${projectCount.toString().padStart(3, '0')}`;
      const createProjectRes = await axios.post(`http://10.8.0.14:5000/create-subgroup/${GitGroupID}`, {
        name:projectName,
        description: `BOT: Project created as  [**${usefulData.projectName}**](http://10.8.0.14:5000:3000/module/${usefulData.projectName}) \n \n \n${usefulData.projectDescription.slice(0, 125)}...`, 
        //groupId:GitGroupID,
      }); 
      const gitlabProjectId = createProjectRes.data.id;
      const gitlabProjectWebUrl = createProjectRes.data.web_url;
      const name1= createProjectRes.data.name;
  
      // Create project in local database with GitLab ID and web URL
      const createProjectDbRes = await axios.post('http://10.8.0.14:5000/create-project-DB', {
        ...usefulData,
        //projectField: ngo.ngoName,
        GitlabID: gitlabProjectId,  
        GitWebUrl: gitlabProjectWebUrl, 
        Gitprojectname:name1,
        GitGroupID:GitGroupID,
      });
      const projectId = createProjectDbRes.data.projectId;
  
      // Add project to NGO in local database
      await axios.post('http://10.8.0.14:5000/update-project-org', {
        orgId: usefulData.projectOwner,
        projectId: projectId,
      });
      const updateProjectManagerRes = await axios.put(`http://10.8.0.14:5000/update-role/${usefulData.projectManager}`, {
      roleId: 'R002-B',
    });

  
      // Log the successful project creation
      const logData = {
        index: 'badal',
        data: {
          message: `Project ${usefulData.projectName} created successfully in GitLab and added to NGO`,
          timestamp: new Date(),
        },
      };
      await axios.post('http://10.8.0.14:5000/log', logData);

  
      window.location.reload();
    } catch (err) {
      console.log(err);
  
      // Log the error
      const logData = {
        index: 'badal',
        data: {
          message: `Error creating project ${usefulData.projectName}: ${err.message}`,
          timestamp: new Date(),
        },
      };
      await axios.post('http://10.8.0.14:5000/log', logData);
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
        <Card variant="outlined" sx={{ maxWidth: 500,size:"sm" }} >
          <CardContent>
            <Typography variant="h4" sx={{ textAlign: "center" }}>Add a new Project</Typography>

            <Box display="flex" flexDirection="column" gap={2}>
            <Box display="flex" alignItems="center" gap={2}>
  <Typography style={{ minWidth: 120, fontWeight: "bold" }}>Project Name:</Typography>
  <TextField
    id="outlined-basic"
    label="Project Name:"
    variant="outlined"
    fullWidth
    value={usefulData.projectName}
    onChange={(e) => {
      setUsefulData({ ...usefulData, projectName: e.target.value });
      setValidationErrors({ ...validationErrors, projectName: '' });
    }}
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
{validationErrors.projectName && (
        <FormHelperText style={{ color: 'red', fontSize: '14px',marginLeft:"8vw" }}>
          {validationErrors.projectName}
        </FormHelperText>
      )}
      <Box display="flex" alignItems="center" gap={2}>
  <Typography style={{ minWidth: 120, fontWeight: "bold" }}>Upload Image:</Typography>
  <input
    type="file"
    onChange={handleFileChange}
  />
</Box>


<Box display="flex" alignItems="center" gap={2}>
  <Typography style={{ minWidth: 120, fontWeight: "bold" }}>Description:</Typography>
  <TextField
    id="outlined-multiline-static"
    label="Description"
    multiline
    rows={4} // Set the number of rows as needed
    defaultValue="" // Set your default value here
    variant="outlined"
    fullWidth
    // inputProps={{ maxLength: 125 }} 
    value={usefulData.projectDescription}
    onChange={(e) => {
      setUsefulData({ ...usefulData, projectDescription: e.target.value });
      setValidationErrors({ ...validationErrors, projectDescription: '' });
     
    }}
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
{/* <div style={{marginLeft:"7vw"}}>
{usefulData.projectDescription.length}/125
</div>   */}
{validationErrors.projectDescription && (
        <FormHelperText style={{ color: 'red', fontSize: '14px',marginLeft:"8vw" }}>
          {validationErrors.projectDescription}
          
        </FormHelperText>
      )}

              
              <Box display="flex" alignItems="center" gap={2}>
      <Typography style={{ minWidth: 125, fontWeight: "bold" }}>Project Field:</Typography>
     

      <img
        src={healthcare}
        alt="Healthcare"
        style={{
          width: '24px',
          height: '24px',
          border: selectedImage === 'healthcare' ? '1px solid #000' : '',
          transition: 'transform 0.3s', // Add a transition for smooth scaling
          cursor: 'pointer', // Add a pointer cursor to indicate it's clickable
          transform: selectedImage === 'healthcare' ? 'scale(1.5)' : 'scale(1)', // Scale up when selected
        }}
        onClick={() => handleField('healthcare')}
      />

      <img
        src={education}
        alt="education"
        style={{
          width: '24px',
          height: '24px',
          border: selectedImage === 'education' ? '1px solid #000' : '',
          transition: 'transform 0.3s', // Add a transition for smooth scaling
          cursor: 'pointer', // Add a pointer cursor to indicate it's clickable
          transform: selectedImage === 'education' ? 'scale(1.5)' : 'scale(1)', // Scale up when selected
        }}
        onClick={() => handleField('education')}
      />

      <img
        src={livelihood}
        alt="livelihood"
        style={{
          width: '24px',
          height: '24px',
          border: selectedImage === 'livelihood' ? '1px solid #000' : '',
          transition: 'transform 0.3s', // Add a transition for smooth scaling
          cursor: 'pointer', // Add a pointer cursor to indicate it's clickable
          transform: selectedImage === 'livelihood' ? 'scale(1.5)' : 'scale(1)', // Scale up when selected
        }}
        onClick={() => handleField('livelihood')}
      />
       <Typography variant="subtitle2" sx={{ color: 'red', fontSize: '20px' }}>*</Typography>
    </Box>
    {validationErrors.projectField && (
        <FormHelperText style={{ color: 'red', fontSize: '14px',marginLeft:"8vw" }}>
          {validationErrors.projectField}
        </FormHelperText>
      )}

    <Box display="flex" alignItems="center" gap={2} >
                <Typography style={{ minWidth: 120,fontWeight:"bold" }}>Project Owner:</Typography>
                <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label"> Project Owner</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={usefulData.projectOwner}
            onChange={handleProjectOwnerChange}
            label="Project Owner"
          >
            {ngosList.map((ngo) => (
              <MenuItem key={ngo._id} value={ngo.orgId}>
                {ngo.orgName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
                <Typography variant="subtitle2" sx={{ color: 'red', fontSize: '20px' }}>*</Typography>
              </Box>
              {validationErrors.projectOwner && (
        <FormHelperText style={{ color: 'red', fontSize: '14px',marginLeft:"8vw" }}>
          {validationErrors.projectOwner}
        </FormHelperText>
      )}
              <Box display="flex" alignItems="center" gap={2}>
              <Typography style={{ minWidth: 120, fontWeight: "bold" }}>Project Manager:</Typography>
              <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label"> Project Manager</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            label="Project Manager"
            value={usefulData.projectManager}
            onChange={handleManager}
          >
            {projectManagers.map((manager) => (
              <MenuItem key={manager.userId} value={manager.userId}>
                {manager.username}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
              <Typography variant="subtitle2" sx={{ color: 'red', fontSize: '20px' }}>*</Typography>
            </Box>
            {validationErrors.projectManager && (
        <FormHelperText style={{ color: 'red', fontSize: '14px',marginLeft:"8vw" }}>
          {validationErrors.projectManager}
        </FormHelperText>
      )}

            <Box display="flex" alignItems="center" gap={2} >
                <Typography style={{ minWidth: 120, fontWeight: "bold" }}>Start Date:</Typography>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
               
   onChange={(newDate) => {
    setUsefulData({ ...usefulData, projectDateStart: newDate });
    // Clear validation error when a date is selected
    setValidationErrors({
      ...validationErrors,
      projectDateStart: undefined,
    });
  }}
  sx={{ width: '300px' }}
/> 

              </LocalizationProvider>
                <Typography variant="subtitle2" sx={{ color: 'red', fontSize: '20px' }}>*</Typography>
              </Box>
              {validationErrors.projectDateStart && (
        <FormHelperText style={{ color: 'red', fontSize: '14px',marginLeft:"8vw" }}>
          {validationErrors.projectDateStart}
        </FormHelperText>
      )}

              <Box display="flex" alignItems="center" gap={2} >
                <Typography style={{ minWidth: 120, fontWeight: "bold" }}>End Date:</Typography>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
            onChange={(newDate) => {
              setUsefulData({ ...usefulData, projectDateEnd: newDate });
              // Clear validation error when a date is selected
              setValidationErrors({
                ...validationErrors,
                projectDateEnd: undefined,
              });
            }}
  sx={{ width: '300px' }}
/>

              </LocalizationProvider>
                <Typography variant="subtitle2" sx={{ color: 'red', fontSize: '20px' }}>*</Typography>
              </Box>
              {validationErrors.projectDateEnd && (
        <FormHelperText style={{ color: 'red', fontSize: '14px',marginLeft:"8vw" }}>
          {validationErrors.projectDateEnd}
        </FormHelperText>
      )}
             

              <Box display="flex" alignItems="center" gap={2}>
              <Typography style={{ minWidth: 120, fontWeight: "bold" }}>Select Skills:</Typography>
  
           <Autocomplete
  multiple
  id="tags-standard"
  options={skillsList}
  getOptionLabel={(option) => option.name}
  value={usefulData.skillsRequired}
  onChange={(_, v) => {
    setUsefulData({ ...usefulData, skillsRequired: v });
    // Clear validation error when skills are selected
    setValidationErrors({
      ...validationErrors,
      skillsRequired: undefined,
    });
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
              <Typography variant="subtitle2" sx={{ color: 'red', fontSize: '20px', marginLeft:"-0.2vw" }}>*</Typography>
            </Box> 
            {validationErrors.skillsRequired && (
        <FormHelperText style={{ color: 'red', fontSize: '14px',marginLeft:"8vw" }}>
          {validationErrors.skillsRequired}
        </FormHelperText>
      )}
            <Box display="flex" alignItems="center" gap={2}>
                <Typography style={{ minWidth: 120, fontWeight: "bold" }}>Dev time:</Typography>
                <TextField
                id="outlined-basic"
                label="Dev Time Required (in Hours)"
                variant="outlined"
                // fullWidth
                style={{ width: 300 }}
                value={usefulData.totalDevTimeRequired}
                onChange={(e) => {
                  setUsefulData({ ...usefulData, totalDevTimeRequired: e.target.value });
                  // Clear validation error when user starts typing
                  setValidationErrors({
                    ...validationErrors,
                    totalDevTimeRequired: undefined,
                  });
                }}
              
                // helperText={<Typography variant="subtitle2" sx={{ color: 'red' }}>Enter time required</Typography>}
                sx={{
                  '& .MuiInputBase-input': {
                    height: '20px', // Adjust the height as needed
                  },
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 'none', // You can adjust the border radius or any other styles here
                  },
                }}
              />
                <Typography variant="subtitle2" sx={{ color: 'red', fontSize: '20px',marginLeft:"-0.2vw" }}>*</Typography>
              </Box>
              {validationErrors.totalDevTimeRequired && (
        <FormHelperText style={{ color: 'red', fontSize: '14px',marginLeft:"8vw" }}>
          {validationErrors.totalDevTimeRequired}
        </FormHelperText>
      )}



              <Box mt={2} display="flex" justifyContent="flex-end">
              {/* <Button variant='outlined' sx={{ marginRight: '8px' }}>Cancel</Button> */}
              <Button
                variant="contained"
                sx={{
                  backgroundColor: '#0e66ac',
                  '&:hover': {
                    backgroundColor: '#66abe3',
                  },
                }}
                onClick={handleCreateProject}
              >
                Add Project
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

export default Createproject;