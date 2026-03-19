import React, { useState,useEffect,useRef } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Card,
  CardContent, 
  Button,
  Radio,
  Grid,
  Chip,
  CircularProgress,Backdrop
} from '@mui/material';
import material from "../icons/material.svg";
import axios from 'axios';


import Autocomplete from '@mui/material/Autocomplete';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { FormHelperText } from '@material-ui/core';
import AWS from 'aws-sdk'; 


function CreateModule(props) {
  const permissionString = localStorage.getItem('permissions');
  const permissions = permissionString ? permissionString.split(',') : [];
  const isP001Allowed = permissions.includes('P001');
  const isP002Allowed = permissions.includes('P002');
  const isP003Allowed = permissions.includes('P003');
  const isP004Allowed = permissions.includes('P004');
  const isP005Allowed= permissions.includes('P005')
  const orgId=localStorage.getItem('orgId')
  const userId=localStorage.getItem('userId')
  const projectID=props.projectId
    
    const [customSkill, setCustomSkill] = useState('');
    
    const [usefulData, setUsefulData] = useState({
      projectid:projectID,
      moduleDateCreated:"2023-09-21",
      moduleName: '',
      moduleDescription: '',
      moduleDateStart: '',
      moduleDateEnd: '',
      skillsRequired: [],
      totalDevTimeRequired: '',
      moduleComplexity: 'a',
      completed:"0",
      assigned:"0",
      unassigned:"0",
    });
    const [validationErrors, setValidationErrors] = useState({});
    const [skillsList, setSkillsList] = useState([]);
    const [ngosList, setNgosList] = useState([]);
    const [projectData,setProjectData]=useState([])
    const [isLoading, setIsLoading] = useState(false); 
  
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
    const [gitProjectName, setGitProjectName] = useState('');
const [projectowner, setProjectOwner] = useState('');
useEffect(() => {
  const fetchSkills = async () => {
    try {
      const res = await axios.get(`http://10.8.0.14:5000/get-project/${projectID}`);
      setProjectData(res.data);
      setGitProjectName(res.data.Gitprojectname);
    } catch (error) {
      console.log(error);
    }
  }
  fetchSkills();
}, []);

 
    
  
    const handleEnter = (event) => {
      if (event.key === 'Enter' && customSkill && usefulData.skillsRequired.length < 10) {
        setUsefulData({ ...usefulData, skillsRequired: [...usefulData.skillsRequired, { name: customSkill }] });
        setCustomSkill('');
      }
    };
  
    const handleCustomSkillInput = (event) => {
      if (usefulData.skillsRequired.length < 10) {
        setCustomSkill(event.target.value);
     
      }
    };
  
    const handleProjectNameChange = (event) => {{
      setUsefulData({ ...usefulData, moduleName: event.target.value });
      setValidationErrors({ ...validationErrors, moduleName: '' })
    }};
    
    const handleProjectDescriptionChange = (event) => {{
      setUsefulData({ ...usefulData, moduleDescription: event.target.value });
      setValidationErrors({ ...validationErrors, moduleDescription: '' });
    }};
    
    const handleSkillsChange = (_, value) => {
      setUsefulData({ ...usefulData, skillsRequired: value });
    };
    
    const handleTotalDevTimeRequiredChange = (event) => {{
      setUsefulData({ ...usefulData, totalDevTimeRequired: event.target.value });
      setValidationErrors({ ...validationErrors, totalDevTimeRequired: '' });
    }};
  
    const handleStartDateChange = (event) => {{
      setUsefulData({ ...usefulData, moduleDateStart: event.target.value });
      
    }};
    
   
    
  
    const controlProps = (item) => ({
      checked: usefulData.moduleComplexity === item,
      onChange: handleChange,
      value: item,
      name: 'module-complexity-radio-button',
      inputProps: { 'aria-label': item },
    });
    
    const handleChange = (event) => {
      setUsefulData({ ...usefulData, moduleComplexity: event.target.value });
    };
   
  
   
    const handleCreateModule = async () => {
  
      
      setIsLoading(true);
        try {
          if (!usefulData.moduleName.trim()) {
            setValidationErrors({
              ...validationErrors,
              moduleName: 'module Name is required',
            });
            return;
          }
    
          // Validate Description
          if (!usefulData.moduleDescription.trim()) {
            setValidationErrors({
              ...validationErrors,
              moduleDescription: 'Description is required',
            });
            return;
          }
    // Validate Start Date
if (!usefulData.moduleDateStart) {
  setValidationErrors({
    ...validationErrors,
    moduleDateStart: 'Start Date is required',
  });
  return;
} else {
  const today = new Date();
  today.setHours(0, 0, 0, 0); 
  // Start Date is selected, check if it is today
  const startDate = new Date(usefulData.moduleDateStart);
  startDate.setHours(0, 0, 0, 0);

  if (startDate.getTime() < today.getTime()) {
    setValidationErrors({
      ...validationErrors,
      moduleDateStart: 'Start Date must be today or in the future',
    });
    return;
  }
}

// Validate End Date
if (!usefulData.moduleDateEnd) {
  setValidationErrors({
    ...validationErrors,
    moduleDateEnd: 'End Date is required',
  });
  return;
}

// Check if End Date is less than or equal to Start Date
const endDate = new Date(usefulData.moduleDateEnd);
endDate.setHours(0, 0, 0, 0);

if (endDate <= usefulData.moduleDateStart) {
  setValidationErrors({
    ...validationErrors,
    moduleDateEnd: 'End Date must be more than Start Date',
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
    
        // Create a project in GitLab with the specified name and description
        const gitProjectName = projectData.gitProjectName;
        const GitGroupID=projectData.gitlabId;
        const moduleIdsCount = projectData.moduleIds.length.toString().padStart(3, '0');
        const projectName = `${gitProjectName}-M-${moduleIdsCount}`;
        const projectDescription = usefulData.moduleDescription;
        
  
        const createRepoFolderData = {
          projectName: projectName,
          description: projectDescription.slice(0, 250),
        };

        
  
        const createRepoFolderRes = await axios.post(`http://10.8.0.14:5000/create-repo-folder/${GitGroupID}`, createRepoFolderData);
  
        console.log(`Module '${projectName}' created successfully with folders and README in GitLab.`);
        const { id: GitlabID, name: Gitprojectname, web_url: GitWebUrl } = createRepoFolderRes.data.project;
        const s3 = new AWS.S3({
          endpoint: 'pl-minio.iiit.ac.in',// Replace with your Minio endpoint
          accessKeyId: 'minioadmin',
          secretAccessKey: 'minioadmin',
          s3ForcePathStyle: true, // Required for Minio
        });
    
        const uploadImage = async (file, folderName) => {
          const params = { 
            Bucket: 'psuw001', // Replace with your Minio bucket name 
            Key: `modules/${gitProjectName}-M-${moduleIdsCount}/${folderName}/${file.name}`,
            Body: file,
          };
    
          const uploadResult = await s3.upload(params).promise();
          return uploadResult.Location; // This will be the link to the uploaded image
        };
    
        const requirementsDocument= selectedFile ? await uploadImage(selectedFile, 'Requirements') : '';
        const uiMocks = selectedFile1 ? await uploadImage(selectedFile1, 'UI Mocks') : '';
        const apiDocument = selectedFile2 ? await uploadImage(selectedFile2, 'API Documentation') : '';
        const dbDocument = selectedFile3 ? await uploadImage(selectedFile3, 'Database Documentation') : '';
     
        // Send POST request to server endpoint with module data and GitLab project ID
        const res = await axios.post('http://10.8.0.14:5000/create-module-DB', { ...usefulData, GitlabID, Gitprojectname, GitWebUrl,  requirementsDocument,
        uiMocks,
        apiDocument,
        dbDocument,OrgID:orgId});
        const moduleId = res.data.moduleId ;
        console.log('New module added to collectionModule collection: ', moduleId);
  
        // Send POST request to server endpoint to add the module id to the project's ModuleIds array
        const response = await axios.post(`http://10.8.0.14:5000/add-module-ids/${usefulData.projectid}`, { moduleIds: moduleId });
        console.log('Module id added to the project:', response.data);
  
        if (selectedFile) {
          try {
            const pushToFileFolderData = new FormData();
            pushToFileFolderData.append('file', selectedFile);
            await axios.post(`http://10.8.0.14:5000/push-to-folder/${GitlabID}/Requirements`, pushToFileFolderData);
            console.log('File uploaded successfully to GitLab project folder: Requirements');
          } catch (error) {
            console.log(`Error uploading file to GitLab project folder: Requirements: ${error.message}`);
          }
        }
    
        if (selectedFile1) {
          try {
            const pushToFileFolderData = new FormData();
            pushToFileFolderData.append('file', selectedFile1);
            await axios.post(`http://10.8.0.14:5000/push-to-folder/${GitlabID}/UI Mocks`, pushToFileFolderData);
            console.log('File uploaded successfully to GitLab project folder: UI Mocks');
          } catch (error) {
            console.log(`Error uploading file to GitLab project folder: UI Mocks: ${error.message}`);
          }
        }
    
        if (selectedFile2) {
          try {
            const pushToFileFolderData = new FormData();
            pushToFileFolderData.append('file', selectedFile2);
            await axios.post(`http://10.8.0.14:5000/push-to-folder/${GitlabID}/Database Documentation`, pushToFileFolderData);
            console.log('File uploaded successfully to GitLab project folder: Database Documentation');
          } catch (error) {
            console.log(`Error uploading file to GitLab project folder: Database Documentation: ${error.message}`);
          }
        }
    
        if (selectedFile3) {
          try {
            const pushToFileFolderData = new FormData();
            pushToFileFolderData.append('file', selectedFile3);
            await axios.post(`http://10.8.0.14:5000/push-to-folder/${GitlabID}/API Documentation`, pushToFileFolderData);
            console.log('File uploaded successfully to GitLab project folder: API Documentation');
          } catch (error) {
            console.log(`Error uploading file to GitLab project folder: API Documentation: ${error.message}`);
          }
        }
    
        if (selectedFile4) {
          try {
            const pushToFileFolderData = new FormData();
            pushToFileFolderData.append('file', selectedFile4);
            await axios.post(`http://10.8.0.14:5000/push-to-folder/${GitlabID}/Others`, pushToFileFolderData);
            console.log('File uploaded successfully to GitLab project folder: Others');
          } catch (error) {
            console.log(`Error uploading file to GitLab project folder: Others: ${error.message}`);
          }
        }
  
        const logData = {
          index: 'badal',
          data: {
            message: `Module ${usefulData.moduleName} created successfully in GitLab and added to NGO`,
            timestamp: new Date(),
          },
        };
        await axios.post('http://10.8.0.14:5000/log', logData);
  
        window.location.reload();
      } catch (error) {
        console.log(error);
        const logData = {
          index: 'badal',
          data: {
            message: `Error creating Module ${usefulData.moduleName}: ${error.message}`,
            timestamp: new Date(),
          },
        };
        await axios.post('http://10.8.0.14:5000/log', logData);
      }finally {
        setIsLoading(false); // Set loading state off
      }
    }; 
    const fileInputRef = useRef(null);
    const [selectedFile, setSelectedFile] = useState(null);
    
  
    const handleClick = (documentType) => {
      // Trigger file input click
      fileInputRef.current.click();
      // You can add logic to handle the documentType as needed
      console.log(`Clicked on ${documentType}`);
    };
  
    const [fileName1, setFileName1] = useState('');
const [fileName2, setFileName2] = useState('');
const [fileName3, setFileName3] = useState('');
const [fileName4, setFileName4] = useState('');
const [fileName5, setFileName5] = useState('');

// ... similarly for other files if u want to add more

// Update file name state variables when a file is uploaded
const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    file.originalname = file.name;
    setSelectedFile(file);
    setFileName1(file.name); // Set file name for the first file input
  }
};
    const fileInputRef1 = useRef(null);
    const [selectedFile1, setSelectedFile1] = useState(null);
    
  
    const handleClick1 = (documentType) => {
      // Trigger file input click
      fileInputRef1.current.click();
      // You can add logic to handle the documentType as needed
      console.log(`Clicked on ${documentType}`);
    };
  
    const handleFileChange1 = (event) => {
      const file = event.target.files[0];
      if (file) {
        file.originalname = file.name;
        setSelectedFile1(file);
        setFileName2(file.name)
      }
    };
    const fileInputRef2 = useRef(null);
    const [selectedFile2, setSelectedFile2] = useState(null);
    
  
    const handleClick2 = (documentType) => {
      // Trigger file input click
      fileInputRef2.current.click();
      // You can add logic to handle the documentType as needed
      console.log(`Clicked on ${documentType}`);
    };
  
    const handleFileChange2 = (event) => {
      const file = event.target.files[0];
      if (file) {
        file.originalname = file.name;
        setSelectedFile2(file);
        setFileName3(file.name)
      }
    };
    const fileInputRef3 = useRef(null);
    const [selectedFile3, setSelectedFile3] = useState(null);
    
  
    const handleClick3 = (documentType) => {
      // Trigger file input click
      fileInputRef3.current.click();
      // You can add logic to handle the documentType as needed
      console.log(`Clicked on ${documentType}`);
    };
  
    const handleFileChange3 = (event) => {
      const file = event.target.files[0];
      if (file) {
        file.originalname = file.name;
        setSelectedFile3(file);
        setFileName4(file.name)
      }
    };
    const fileInputRef4 = useRef(null);
    const [selectedFile4, setSelectedFile4] = useState(null);
    
  
    const handleClick4 = (documentType) => {
      // Trigger file input click
      fileInputRef4.current.click();
      // You can add logic to handle the documentType as needed
      console.log(`Clicked on ${documentType}`);
    };
  
    const handleFileChange4 = (event) => {
      const file = event.target.files[0];
      if (file) {
        file.originalname = file.name;
        setSelectedFile4(file);
        setFileName5(file.name)
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
            <Typography variant="h4" sx={{ textAlign: "center" }}>Add a new Module</Typography>

            <Box display="flex" flexDirection="column" gap={2}>
              <Box display="flex" alignItems="center" gap={2}>
                <Typography style={{ minWidth: 120, fontWeight: "bold" }}>Module Name:</Typography>
                <TextField
                id="outlined-basic"
                label="Module Name"
                variant="outlined"
                value={usefulData.projectName}
                onChange={handleProjectNameChange}
                // fullWidth
                sx={{
                  '& .MuiInputBase-input': {
                    height: '30px', // Adjust the height as needed
                  },
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 'none', // You can adjust the border radius or any other styles here
                  },
                  width: '300px'
                }}
              />
                <Typography variant="subtitle2" sx={{ color: 'red', fontSize: '20px' }}>*</Typography>
              </Box>
              {validationErrors.moduleName && (
        <FormHelperText style={{ color: 'red', fontSize: '14px',marginLeft:"8vw" }}>
          {validationErrors.moduleName}
        </FormHelperText>
      )}
              

              <Box display="flex" alignItems="center" gap={2} >
                <Typography style={{ minWidth: 120, fontWeight: "bold" }}>Description:</Typography>
                <TextField
                  id="outlined-multiline-static"
                  label="Description"
                  multiline
                  rows={4} // Set the number of rows as needed
                  defaultValue="" // Set your default value here
                  variant="outlined"
                  InputProps={{ style: { fontSize: '16px' }}}
                  value={usefulData.projectDescription}
                  onChange={handleProjectDescriptionChange}
                  // inputProps={{ maxLength: 250 }} 
                  // fullWidth
                 
                  sx={{
                    '& .MuiOutlinedInput-inputMultiline': {
                      minHeight: '72px', // Adjust the min-height as needed
                    },
                    '& .MuiOutlinedInput-multiline': {
                      borderRadius: 'none', // You can adjust the border radius or any other styles here
                    },
                    width: '300px'
                  }}
                /> 
                <Typography variant="subtitle2" sx={{ color: 'red', fontSize: '20px' }}>*</Typography>
              </Box>
              <div style={{marginLeft:"7vw"}}>
              {/* {usefulData.moduleDescription.length}/250   */}
              </div>
              {validationErrors.moduleDescription && (
        <FormHelperText style={{ color: 'red', fontSize: '14px',marginLeft:"8vw" }}>
          {validationErrors.moduleDescription}
        </FormHelperText>
      )}
                
              <Box display="flex" alignItems="center" gap={2} >
                <Typography style={{ minWidth: 120, fontWeight: "bold" }}>Start Date:</Typography>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                onChange={(newDate) => {
                  setUsefulData({ ...usefulData, moduleDateStart: newDate });
                  // Clear validation error when a date is selected
                  setValidationErrors({
                    ...validationErrors,
                    moduleDateStart: undefined,
                  });
                }}
                // format="dd/MM/yyyy"
                // locale="en-IN"
                sx={{ width: '300px' }}
              />

              </LocalizationProvider>
                <Typography variant="subtitle2" sx={{ color: 'red', fontSize: '20px' }}>*</Typography>
              </Box>
              {validationErrors.moduleDateStart && (
        <FormHelperText style={{ color: 'red', fontSize: '14px',marginLeft:"8vw" }}>
          {validationErrors.moduleDateStart}
        </FormHelperText>
      )}

              <Box display="flex" alignItems="center" gap={2} >
                <Typography style={{ minWidth: 120, fontWeight: "bold" }}>End Date:</Typography>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                onChange={(newDate) => {
                  setUsefulData({ ...usefulData, moduleDateEnd: newDate });
                  // Clear validation error when a date is selected
                  setValidationErrors({
                    ...validationErrors,
                    moduleDateEnd: undefined,
                  });
                }}
                  sx={{ width: '300px' }}
                />

              </LocalizationProvider>
                <Typography variant="subtitle2" sx={{ color: 'red', fontSize: '20px' }}>*</Typography>
              </Box>
              {validationErrors.moduleDateEnd && (
        <FormHelperText style={{ color: 'red', fontSize: '14px',marginLeft:"8vw" }}>
          {validationErrors.moduleDateEnd}
        </FormHelperText>
      )}

              <Box display="flex" alignItems="center" gap={2} >
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
            <Typography variant="subtitle2" sx={{ color: 'red', fontSize: '20px', }}>*</Typography>


              
              </Box>
              {validationErrors.skillsRequired && (
        <FormHelperText style={{ color: 'red', fontSize: '14px',marginLeft:"8vw" }}>
          {validationErrors.skillsRequired}
        </FormHelperText>
      )}
              <Box display="flex" alignItems="center" gap={2} sx={{marginTop:"0.1vw"}}>
                <Typography style={{ minWidth: 120, fontWeight: "bold" }}>Dev Time :</Typography>
                <TextField
                id="outlined-basic"
                label="Dev Time Required (in Hours)"
                variant="outlined"
                fullWidth
                value={usefulData.totalDevTimeRequired}
                onChange={handleTotalDevTimeRequiredChange}
                sx={{
                  '& .MuiInputBase-input': {
                    height: '20px', // Adjust the height as needed
                  },
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 'none', // You can adjust the border radius or any other styles here
                  },
                  width:"300px",
                  
                }}
              />
                <Typography variant="subtitle2" sx={{ color: 'red', fontSize: '20px' }}>*</Typography>
              </Box>
              {validationErrors.totalDevTimeRequired && (
        <FormHelperText style={{ color: 'red', fontSize: '14px',marginLeft:"8vw" }}>
          {validationErrors.totalDevTimeRequired}
        </FormHelperText>
      )}

             {/*  <Box display="flex" alignItems="center" gap={1}>
                <Typography style={{ minWidth: 120, fontWeight: "bold" }}>Module Complexity:</Typography>
                <RadioGroup
                  aria-label="moduleComplexity"
                  name="moduleComplexity"
                  value={moduleComplexity}
                  onChange={handleModuleComplexityChange}
                  style={{ display: 'flex', flexDirection: 'row' }}
                >
                  {[1, 2, 3, 4, 5].map((value) => (
                    <FormControlLabel key={value} value={value.toString()} control={<Radio />} label={value.toString()} />
                  ))}
                </RadioGroup>
                <Typography variant="subtitle2" sx={{ color: 'red', fontSize: '20px' }}>*</Typography>
              </Box> */}
              <Grid item xs={6} style={{ display: 'flex', alignItems: 'center' }}>
              <Typography style={{ minWidth: 120, fontWeight: "bold"}}>Module <br/>Complexity:</Typography>
  <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <label style={{ display: 'flex', alignItems: 'center' }}>
        <Radio {...controlProps('a')} />
        <span>1</span>
      </label>
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <label style={{ display: 'flex', alignItems: 'center' }}>
        <Radio {...controlProps('b')} />
        <span>2</span>
      </label>
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <label style={{ display: 'flex', alignItems: 'center' }}>
        <Radio {...controlProps('c')} />
        <span>3</span>
      </label>
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <label style={{ display: 'flex', alignItems: 'center' }}>
        <Radio {...controlProps('d')} />
        <span>4</span>
      </label>
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <label style={{ display: 'flex', alignItems: 'center' }}>
        <Radio {...controlProps('e')} />
        <span>5</span>
      </label>
    </div>
    <span style={{ color: 'red', marginLeft: '75px',fontSize:"20px" }}>*</span>
  </div>
</Grid>
<Grid container xs={12} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginLeft: '0.2vw' }}>
  {/* First Row */}
  <Grid item xs={12} style={{ fontSize: "16px", display: 'flex', alignItems: 'center', fontWeight: 'bold', marginLeft: "0.2vw" }}>
    Additional Information :
  </Grid>

  {/* First Row Elements - Requirements Document */}
  <Grid item xs={12} style={{ display: 'flex', alignItems: 'center', marginLeft: '0.2vw' }}>
    <input type="file" style={{ display: 'none' }} ref={fileInputRef} onChange={handleFileChange} />
    <div style={{ display: 'flex', alignItems: 'center', cursor: "pointer" }} onClick={() => handleClick('Requirements Document')}>
      <img src={material} alt="Requirements Document" style={{ width: '24px', height: '24px', marginRight: '8px' }} />
      <span style={{ fontSize: '14px', fontWeight: '500', marginRight: '20px' }}>Requirements Document</span>
      <div style={{marginLeft:"3vw"}}>
      {fileName1 && <span >{fileName1}</span>}
      </div>
    </div>
  </Grid>

  {/* Second Row - UI Mocks */}
  <Grid item xs={12} style={{ display: 'flex', alignItems: 'center', marginLeft: '0.2vw' }}>
    <input type="file" style={{ display: 'none' }} ref={fileInputRef1} onChange={handleFileChange1} />
    <div style={{ display: 'flex', alignItems: 'center', cursor: "pointer" }} onClick={() => handleClick1('UI Mocks')}>
      <img src={material} alt="UI Mocks" style={{ width: '24px', height: '24px', marginRight: '8px' }} />
      <span style={{ fontSize: '14px', fontWeight: '500', marginRight: '20px' }}>UI Mocks</span>
      <div style={{marginLeft:"8.5vw"}}>
      {fileName2 && <span>{fileName2}</span>}
      </div>
    </div>
  </Grid>

  {/* Third Row - API Document */}
  <Grid item xs={12} style={{ display: 'flex', alignItems: 'center', marginLeft: '0.2vw' }}>
    <input type="file" style={{ display: 'none' }} ref={fileInputRef2} onChange={handleFileChange2} />
    <div style={{ display: 'flex', alignItems: 'center', cursor: "pointer" }} onClick={() => handleClick2('API Document')}>
      <img src={material} alt="API Document" style={{ width: '24px', height: '24px', marginRight: '8px' }} />
      <span style={{ fontSize: '14px', fontWeight: '500', marginRight: '20px' }}>API Document</span>
      <div style={{marginLeft:"6.7vw"}}>
      {fileName3 && <span>{fileName3}</span>}
      </div>
    </div>
  </Grid>

  {/* Fourth Row - DB Document */}
  <Grid item xs={12} style={{ display: 'flex', alignItems: 'center', marginLeft: '0.2vw' }}>
    <input type="file" style={{ display: 'none' }} ref={fileInputRef3} onChange={handleFileChange3} />
    <div style={{ display: 'flex', alignItems: 'center', cursor: "pointer" }} onClick={() => handleClick3('DB Document')}>
      <img src={material} alt="DB Document" style={{ width: '24px', height: '24px', marginRight: '8px' }} />
      <span style={{ fontSize: '14px', fontWeight: '500', marginRight: '20px' }}>DB Document</span>
      <div style={{marginLeft:"6.8vw"}}>
      {fileName4 && <span>{fileName4}</span>}
      </div>
    </div>
  </Grid>
</Grid>
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
                onClick={handleCreateModule}
              >
                Add Module
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

export default CreateModule;