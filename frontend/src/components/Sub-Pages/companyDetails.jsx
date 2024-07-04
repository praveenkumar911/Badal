


import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import { Typography, IconButton, Stack } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import LinkIcon from "@mui/icons-material/Link";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import axios from "axios";
import AWS from "aws-sdk";

const s3 = new AWS.S3({
  accessKeyId: "minioadmin",
  secretAccessKey: "minioadmin",
  endpoint: "https://pl-minio.iiit.ac.in", // Replace with your Minio endpoint
  s3ForcePathStyle: true,
});

export default function CompanyDetails({ company }) {
  const [open, setOpen] = React.useState(false);
  const [isEditMode, setIsEditMode] = React.useState(false);
  const [editedCompany, setEditedCompany] = React.useState({ ...company });
  const [selectedFile, setSelectedFile] = React.useState(null);
  const [filePreview, setFilePreview] = React.useState(null);
  const permissionString = localStorage.getItem('permissions');
  const permissions = permissionString ? permissionString.split(',') : [];
  const isP001Allowed = permissions.includes('P001');
  const isP002Allowed = permissions.includes('P002');
  const isP003Allowed = permissions.includes('P003');
  const isP004Allowed = permissions.includes('P004');
  const isP005Allowed= permissions.includes('P005');
  const isP006Allowed= permissions.includes('P006');
  console.log((isP006Allowed));


  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setIsEditMode(false); // Reset edit mode when closing dialog
    setEditedCompany({ ...company }); // Reset editedCompany state to original company data
  };

  const toggleEditMode = () => {
    setIsEditMode((prevEditMode) => !prevEditMode);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setEditedCompany({ ...editedCompany, [name]: value });
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setFilePreview(URL.createObjectURL(file)); // Preview selected file
  };

  const handleSave = async () => {
    try {
      let updatedCompany = { ...editedCompany };
  
      // If a file is selected, upload it to MinIO first
      if (selectedFile) {
        const fileName = `${selectedFile.name}`;
        const params = {
          Bucket: "psuw001", // Replace with your Minio bucket name
          Key: fileName,
          Body: selectedFile,
          ContentType: selectedFile.type,
        };
  
        // Upload the file to MinIO
        const { Location } = await s3.upload(params).promise();
        updatedCompany.imgUrl = Location; // Update imageUrl with the uploaded file's URL
      } else {
        // If no file is selected, keep the existing imageUrl
        updatedCompany.imgUrl = company.imgUrl; // Preserve the existing imageUrl
      }
  
      // Update Company details in backend
      await axios.put(`http://10.8.0.12:5000/update-org/${updatedCompany.orgId}`, updatedCompany);
  
      // Update company state with updatedCompany
      setEditedCompany(updatedCompany);
  
      // Close the dialog and exit edit mode
      setOpen(false);
      setIsEditMode(false);
      window.location.reload()
    } catch (error) {
      console.error("Error updating Company:", error);
    }
  };
  
  
  return (
    <React.Fragment>
      <Button variant="text" onClick={handleClickOpen} style={{ display: "flex", margin: "5px" }}>
        Read More
      </Button>
      <Dialog fullWidth={true} maxWidth="sm" open={open} onClose={handleClose} style={{ cursor: "pointer" }}>
        <Typography
          display="flex"
          color="#808080"
          sx={{ justifyContent: "right", marginTop: 2, marginRight: 2, alignContent: "right" }}
        >
          <IconButton onClick={handleClose}>
            <CloseIcon fontSize="large" />
          </IconButton>
        </Typography>
        <DialogTitle
          display="flex"
          sx={{ justifyContent: "center", alignContent: "center", paddingBottom: "0px" }}
        >
          {isEditMode ? (
            <TextField
              fullWidth
              name="orgName"
              value={editedCompany.orgName}
              onChange={handleInputChange}
              variant="outlined"
            />
          ) : (
            editedCompany.orgName
          )}
        </DialogTitle>
        <DialogContent dividers>
          <Box
            noValidate
            component="form"
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              m: "auto",
              width: "100%",
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: 2 }}>
              Email
            </Typography>
            <TextField
              name="email"
              value={isEditMode ? editedCompany.email : company.email}
              fullWidth
              variant="outlined"
              sx={{ marginBottom: 2 }}
              InputProps={{
                readOnly: !isEditMode,
              }}
              onChange={handleInputChange}
            />
            <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: 2 }}>
              Phone number
            </Typography>
            <TextField
              name="phone"
              value={isEditMode ? editedCompany.phone : company.phone}
              fullWidth
              variant="outlined"
              sx={{ marginBottom: 2 }}
              InputProps={{
                readOnly: !isEditMode,
              }}
              onChange={handleInputChange}
            />
            <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: 2 }}>
              Description
            </Typography>
            <TextField
              name="description"
              value={isEditMode ? editedCompany.description : company.description}
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              sx={{ marginBottom: 2 }}
              InputProps={{
                readOnly: !isEditMode,
              }}
              onChange={handleInputChange}
            />
            <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: 2 }}>
              Company Size
            </Typography>
            <TextField
              name="size"
              value={isEditMode ? editedCompany.size : company.size}
              fullWidth
              variant="outlined"
              sx={{ marginBottom: 2 }}
              InputProps={{
                readOnly: !isEditMode,
              }}
              onChange={handleInputChange}
            />
            <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: 2 }}>
              Website
            </Typography>
            <TextField
              name="websiteUrl"
              value={isEditMode ? editedCompany.websiteUrl : company.websiteUrl}
              fullWidth
              variant="outlined"
              sx={{ marginBottom: 2 }}
              InputProps={{
                startAdornment: (
                  <LinkIcon color="action" />
                ),
                readOnly: !isEditMode,
              }}
              onChange={handleInputChange}
            />
            <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: 2 }}>
              Location
            </Typography>
            <TextField
              name="city"
              value={isEditMode ? editedCompany.city : company.city}
              fullWidth
              variant="outlined"
              sx={{ marginBottom: 2 }}
              InputProps={{
                startAdornment: (
                  <LocationOnIcon color="action" />
                ),
                readOnly: !isEditMode,
              }}
              onChange={handleInputChange}
            />
            {isEditMode && (
              <React.Fragment>
                <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: 2 }}>
                  Upload Logo
                </Typography>
                <Stack direction="row" alignItems="center" spacing={2} sx={{ marginBottom: 2 }}>
                  <input
                    accept="image/*"
                    style={{ display: "none" }}
                    id="upload-button"
                    type="file"
                    onChange={handleFileChange}
                  />
                  <label htmlFor="upload-button">
                    <Button variant="outlined" component="span" startIcon={<CloudUploadIcon />}>
                      Upload
                    </Button>
                  </label>
                  {filePreview && (
                    <Typography variant="body2" color="textSecondary">
                      {selectedFile.name}
                    </Typography>
                  )}
                </Stack>
              </React.Fragment>
            )}
            {/* <DialogActions>
              {isEditMode ? (
                <Button onClick={handleSave} startIcon={<SaveIcon />} >
                  Save
                </Button>
              ) : (
                <Button 
        onClick={toggleEditMode} 
        startIcon={<EditIcon />} 
        disabled={(!isP006Allowed) }
        style={{ display: 'block', visibility: 'visible' }} // Ensure visibility in case of CSS issues
      >
        Edit
      </Button>
              )}
              <Button onClick={handleClose}>Done</Button>
            </DialogActions> */}
            <DialogActions>
  {isEditMode ? (
    <Button onClick={handleSave} startIcon={<SaveIcon />}>
      Save
    </Button>
  ) : (
    // Conditional rendering for the Edit button
    (isP005Allowed || isP006Allowed) && (
      <Button 
        onClick={toggleEditMode} 
        startIcon={<EditIcon />} 
        style={{ display: 'block', visibility: 'visible' }} // Ensure visibility in case of CSS issues
      >
        Edit
      </Button>
    )
  )}
  <Button onClick={handleClose}>Done</Button>
</DialogActions>

          </Box>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
}
