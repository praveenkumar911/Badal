// import * as React from "react";
// import Box from "@mui/material/Box";
// import Button from "@mui/material/Button";
// import Dialog from "@mui/material/Dialog";
// import DialogActions from "@mui/material/DialogActions";
// import DialogContent from "@mui/material/DialogContent";
// import DialogTitle from "@mui/material/DialogTitle";
// import Grid from "@mui/material/Grid";
// import TextField from "@mui/material/TextField";
// import { Typography, IconButton } from "@mui/material";
// import CloseIcon from "@mui/icons-material/Close";
// import LocationOnIcon from "@mui/icons-material/LocationOn";
// import CallIcon from "@mui/icons-material/Call";
// import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
// import WorkIcon from "@mui/icons-material/Work";

// export default function NgoDetails(props) {
//   const ngo = props.ngo;
//   const [open, setOpen] = React.useState(false);

//   const handleClickOpen = () => {
//     setOpen(true);
//   };

//   const handleClose = () => {
//     setOpen(false);
//   };

//   return (
//     <React.Fragment>
//       <Button
//         variant="text"
//         onClick={handleClickOpen}
//         style={{ display: "flex", margin: "5px" }}
//       >
//         Read More
//       </Button>
//       <Dialog
//         fullWidth={true}
//         maxWidth="sm"
//         open={open}
//         onClose={handleClose}
//         style={{ cursor: "pointer" }}
//       >
//         <Typography
//           display="flex"
//           color="#808080"
//           sx={{
//             justifyContent: "right",
//             marginTop: 2,
//             marginRight: 2,
//             alignContent: "right",
//           }}
//         >
//           <IconButton>
//             <CloseIcon fontSize="large" onClick={handleClose} />
//           </IconButton>
//         </Typography>
//         <DialogTitle
//           display="flex"
//           sx={{
//             justifyContent: "center",
//             alignContent: "center",
//             paddingBottom: "0px",
//           }}
//         >
//           {ngo.name}
//         </DialogTitle>
//         <DialogContent dividers>
//           <Box
//             noValidate
//             component="form"
//             sx={{
//               display: "flex",
//               flexDirection: "column",
//               justifyContent: "center",
//               alignItems: "center",
//               m: "auto",
//               width: "100%",
//             }}
//           >
//             <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: 2 }}>
//               Email
//             </Typography>
//             <TextField
//               value={ngo.email}
//               fullWidth
//               variant="outlined"
//               sx={{ marginBottom: 2 }}
//               InputProps={{
//                 readOnly: true,
//               }}
//             />
//             <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: 2 }}>
//               City
//             </Typography>
//             <TextField
//               value={ngo.city}
//               fullWidth
//               variant="outlined"
//               sx={{ marginBottom: 2 }}
//               InputProps={{
//                 readOnly: true,
//               }}
//             />
//             <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: 2 }}>
//               Phone number
//             </Typography>
//             <TextField
//               value={ngo.phone}
//               fullWidth
//               variant="outlined"
//               sx={{ marginBottom: 2 }}
//               InputProps={{
//                 readOnly: true,
//               }}
//             />
//             <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: 2 }}>
//               Description
//             </Typography>
//             <TextField
//               value={ngo.description}
//               fullWidth
//               multiline
//               rows={4}
//               variant="outlined"
//               sx={{ marginBottom: 2 }}
//               InputProps={{
//                 readOnly: true,
//               }}
//             />
//             <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: 2 }}>
//               NGO Size
//             </Typography>
//             <TextField
//               value={ngo.size}
//               fullWidth
//               variant="outlined"
//               sx={{ marginBottom: 2 }}
//               InputProps={{
//                 readOnly: true,
//               }}
//             />
            
//             <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: 2 }}>
//               Website
//             </Typography>
//             <TextField
//               value={ngo.websiteUrl}
//               fullWidth
//               variant="outlined"
//               sx={{ marginBottom: 2 }}
//               InputProps={{
//                 readOnly: true,
//               }}
//             />
           
//             <DialogActions>
//               <Button onClick={handleClose}>Done</Button>
//             </DialogActions>
//           </Box>
//         </DialogContent>
//       </Dialog>
//     </React.Fragment>
//   );
// }
import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import { Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import axios from "axios";
import AWS from "aws-sdk";

const s3 = new AWS.S3({
  accessKeyId: "minioadmin",
  secretAccessKey: "minioadmin",
  endpoint: "https://pl-minio.iiit.ac.in", // Replace with your Minio endpoint
  s3ForcePathStyle: true,
});

export default function NgoDetails({ ngo }) {
  const [open, setOpen] = React.useState(false);
  const [isEditMode, setIsEditMode] = React.useState(false);
  const [editedNgo, setEditedNgo] = React.useState({ ...ngo });
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


  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setIsEditMode(false); // Reset edit mode when closing dialog
    setEditedNgo({ ...ngo }); // Reset editedNgo state to original ngo data
  };

  const toggleEditMode = () => {
    setIsEditMode((prevEditMode) => !prevEditMode);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setEditedNgo({ ...editedNgo, [name]: value });
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setFilePreview(URL.createObjectURL(file)); // Preview selected file
  };

  const handleSave = async () => {
    try {
      let updatedNgo = { ...editedNgo };

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
        updatedNgo.imgUrl = Location; // Update imageUrl with the uploaded file's URL
      }else {
        // If no file is selected, keep the existing imageUrl
        updatedNgo.imgUrl = ngo.imgUrl; // Preserve the existing imageUrl
      }

      // Update NGO details in backend
      await axios.put(`http://10.8.0.14:5000/update-org/${updatedNgo.orgId}`, updatedNgo);

      // Update ngo state with updatedNgo
      setEditedNgo(updatedNgo);

      // Close the dialog and exit edit mode
      setOpen(false);
      setIsEditMode(false);
      window.location.reload()
    } catch (error) {
      console.error("Error updating NGO:", error);
    }
  };
  console.log(ngo);

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
              value={editedNgo.orgName}
              onChange={handleInputChange}
              variant="outlined"
            />
          ) : (
            editedNgo.orgName
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
              value={isEditMode ? editedNgo.email : ngo.email}
              fullWidth
              variant="outlined"
              sx={{ marginBottom: 2 }}
              InputProps={{
                readOnly: !isEditMode,
              }}
              onChange={handleInputChange}
            />
            <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: 2 }}>
              City
            </Typography>
            <TextField
              name="city"
              value={isEditMode ? editedNgo.city : ngo.city}
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
              value={isEditMode ? editedNgo.phone : ngo.phone}
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
              value={isEditMode ? editedNgo.description : ngo.description}
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
              NGO Size
            </Typography>
            <TextField
              name="size"
              value={isEditMode ? editedNgo.size : ngo.size}
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
              value={isEditMode ? editedNgo.websiteUrl : ngo.websiteUrl}
              fullWidth
              variant="outlined"
              sx={{ marginBottom: 2 }}
              InputProps={{
                readOnly: !isEditMode,
              }}
              onChange={handleInputChange}
            />
            {isEditMode && (
              <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <Button variant="contained" component="label" sx={{ mt: 2 }}>
                  Upload Image
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleFileChange}
                  />
                </Button>
                {filePreview && (
                  <Box sx={{ mt: 2 }}>
                    <img
                      src={filePreview}
                      alt="Selected file"
                      style={{ maxWidth: "100%", height: "auto" }}
                    />
                  </Box>
                )}
              </Box>
            )}
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
