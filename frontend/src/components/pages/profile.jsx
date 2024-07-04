// import React, { useEffect, useState, useRef } from "react";
// import {
//   Card,
//   Chip,
//   Grid,
//   Typography,
//   Stack,
//   Button,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogTitle,
// } from "@mui/material";
// import { Box } from "@mui/system";
// import Avatar from "@mui/material/Avatar";
// import List from "@mui/material/List";
// import ListItem from "@mui/material/ListItem";
// import ListItemText from "@mui/material/ListItemText";
// import { Cancel } from "@mui/icons-material";
// import { TextField } from "@mui/material";
// import axios from "axios";
// import AWS from "aws-sdk";
// const Tags = ({ data, handleDelete }) => {
//   return (
//     <Box
//       sx={{
//         background: "#283240",
//         height: "100%",
//         display: "flex",
//         padding: "0.4rem",
//         margin: "0 0.5rem 0 0",
//         justifyContent: "center",
//         alignContent: "center",
//         color: "#ffffff",
//       }}
//     >
//       <Stack direction="row" gap={1}>
//         <Typography>{data}</Typography>
//         <Cancel sx={{ cursor: "pointer" }} onClick={() => handleDelete(data)} />
//       </Stack>
//     </Box>
//   );
// };

// export default function Profile() {
//   const [tags, setTags] = useState([]);
//   const tagRef = useRef();
//   const userId = localStorage.getItem("userId");
//   const [open, setOpen] = useState(false);

//   const [userDetails, setUserDetails] = useState({
//     username: "",
//     email: "",
//     orgId: "",
//     roleId: "",
//     phone: "",
//     address: "",
//     imgUrl:""
//   });
//   AWS.config.update({
//     accessKeyId: "minioadmin",
//     secretAccessKey: "minioadmin",
//     endpoint: "pl-minio.iiit.ac.in", // Replace with your Minio endpoint
//     s3ForcePathStyle: true,
//   });



//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         const response = await axios.get(`http://10.8.0.12:5000/get-user/${userId}`);
//         if (response.data.length > 0) {
//           const userData = response.data[0];
//           setUserDetails({
//             username: userData.username,
//             email: userData.email,
//             orgId: userData.orgId,
//             roleId: userData.roleId,
//             phone: userData.phone,
//             address: userData.address,
//             imgUrl:userData.imgUrl,
//           });
//         }
//       } catch (error) {
//         console.error("Error fetching user data:", error);
//       }
//     };

//     fetchUserData();
//   }, []);

//   const handleDelete = (value) => {
//     const newTags = tags.filter((val) => val !== value);
//     setTags(newTags);
//   };

//   const handleOnSubmit = (e) => {
//     e.preventDefault();
//     if (tagRef.current.value) {
//       setTags([...tags, tagRef.current.value]);
//       tagRef.current.value = "";
//     }
//   };

//   const handleUpdate = async () => {
//     try {
//       const response = await axios.put(`http://10.8.0.12:5000/update-user/${userId}`, userDetails);
      
//       // Close the dialog after successful update
//       setOpen(false);
//     } catch (error) {
//       console.error("Error updating user:", error);
//     }
//   };
 
//   const handleOpen = () => {
//     setOpen(true);
//   };

//   const handleClose = () => {
//     setOpen(false);
//   };

 
//   const { username, email, orgId, address, phone, roleId ,imgUrl} = userDetails;
// let type = "";
// switch (roleId) {
//   case "R003":
//     type = "Developer";
//     break;
//   case "R002-B":
//     type = "Organization";
//     break;
//   default:
//     type = "RCTS";
//     break;
// }
// const name = username || "";
// const address1 = address || "No data available please add";

// const phone1 = phone || "No data available please add";


//   return (
//     <Box sx={{ p: 2, display: "flex", justifyContent: "center", alignItems: "center" }}>
//       <Card
//         sx={{
//           display: "flex",
//           width: "100%",
//           justifyContent: "center",
//           alignContent: "center",
//           backgroundColor: "#f4f8fd",
//         }}
//       >
//         <ul 
//           style={{
//             listStyleType: "none",
//             padding: 0,
//           }}
//         >
//           <li
//             style={{
//               display: "flex",
//               justifyContent: "center",
//               alignContent: "center",
//             }}
//           >
//             <Avatar sx={{ width: 120, height: 120, marginTop: "40px" }}>
//               {name.charAt(0).toUpperCase()}
//             </Avatar>
//           </li>
//           <li
//             style={{
//               display: "flex",
//               justifyContent: "center",
//               alignContent: "center",
//               marginTop: "10px",
//             }}
//           >
//             <Chip label={type} />
//           </li>
//           <li>
//             <Typography
//               variant="h4"
//               sx={{
//                 display: "flex",
//                 marginTop: "20px",
//                 justifyContent: "center",
//                 alignContent: "center",
//               }}
//             >
//               {name.split(" ")[0]}
//             </Typography>
//           </li>
//           <li>
//             <Typography
//               variant="body1"
//               sx={{
//                 display: "flex",
//                 marginTop: "10px",
//                 justifyContent: "center",
//                 alignContent: "center",
//               }}
//             >
//               {type}
//             </Typography>
//           </li>
          
//           <li>
//             <List sx={{ width: "600px" }}>
//               <ListItem divider>
//                 <ListItemText>Full Name</ListItemText>
//                 <ListItemText
//                   style={{ display: "flex", justifyContent: "flex-end" }}
//                 >
//                   {name}
//                 </ListItemText>
//               </ListItem>
//               <ListItem divider>
//                 <ListItemText>Email</ListItemText>
//                 <ListItemText
//                   style={{ display: "flex", justifyContent: "flex-end" }}
//                 >
//                   {email}
//                 </ListItemText>
//               </ListItem>
//               <ListItem divider>
//                 <ListItemText>Phone</ListItemText>
//                 <ListItemText
//                   style={{ display: "flex", justifyContent: "flex-end" }}
//                 >
//                   {phone1}
//                 </ListItemText>
//               </ListItem>
//               <ListItem>
//                 <ListItemText>Address</ListItemText>
//                 <ListItemText
//                   style={{
//                     display: "flex",
//                     justifyContent: "flex-end",
//                     marginLeft: "90px",
//                   }}
//                 >
//                   {address1}
//                 </ListItemText>
//               </ListItem>
//             </List>
//           </li>
//           <li style={{ marginTop: "10px", marginBottom: "40px" }}>
//             <Button variant="contained" onClick={handleOpen}>
//               Edit Details
//             </Button>
//             <Dialog open={open} onClose={handleClose}>
//               <DialogTitle>Edit Details</DialogTitle>
//               <DialogContent>
//                 <TextField
//                   margin="dense"
//                   id="username"
//                   label="Username"
//                   type="text"
//                   fullWidth
//                   value={username}
//                   onChange={(e) =>
//                     setUserDetails({ ...userDetails, username: e.target.value })
//                   }
//                 />
//                 <TextField
//                   margin="dense"
//                   id="phone"
//                   label="Phone"
//                   type="text"
//                   fullWidth
//                   value={phone}
//                   onChange={(e) =>
//                     setUserDetails({ ...userDetails, phone: e.target.value })
//                   }
//                 />
//                 <TextField
//                   margin="dense"
//                   id="address"
//                   label="Address"
//                   type="text"
//                   fullWidth
//                   value={address}
//                   onChange={(e) =>
//                     setUserDetails({ ...userDetails, address: e.target.value })
//                   }
//                 />
//               </DialogContent>
//               <DialogActions>
//                 <Button onClick={handleClose}>Cancel</Button>
//                 <Button onClick={handleUpdate}>Update</Button>
//               </DialogActions>
//             </Dialog>
//           </li>
//         </ul>
//       </Card>
//     </Box>
//   );
// }



import React, { useEffect, useState, useRef } from "react";
import {
  Card,
  Chip,
  Grid,
  Typography,
  Stack,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Box,
  Avatar,
  List,
  ListItem,
  ListItemText,
  TextField
} from "@mui/material";
import { Cancel } from "@mui/icons-material";
import axios from "axios";
import AWS from "aws-sdk";

const Tags = ({ data, handleDelete }) => {
  return (
    <Box
      sx={{
        background: "#283240",
        height: "100%",
        display: "flex",
        padding: "0.4rem",
        margin: "0 0.5rem 0 0",
        justifyContent: "center",
        alignContent: "center",
        color: "#ffffff",
      }}
    >
      <Stack direction="row" gap={1}>
        <Typography>{data}</Typography>
        <Cancel sx={{ cursor: "pointer" }} onClick={() => handleDelete(data)} />
      </Stack>
    </Box>
  );
};

export default function Profile() {
  const [tags, setTags] = useState([]);
  const tagRef = useRef();
  const userId = localStorage.getItem("userId");
  const [open, setOpen] = useState(false);

  const [userDetails, setUserDetails] = useState({
    username: "",
    email: "",
    orgId: "",
    roleId: "",
    phone: "",
    address: "",
    imgUrl: ""
  });

  const [selectedFile, setSelectedFile] = useState(null); // State to hold selected file
  const [filePreview, setFilePreview] = useState(null); // State for file preview

  AWS.config.update({
    accessKeyId: "minioadmin",
    secretAccessKey: "minioadmin",
    endpoint: "https://pl-minio.iiit.ac.in", // Ensure the correct MinIO endpoint is used
    s3ForcePathStyle: true,
    signatureVersion: 'v4', // Use this for compatibility
  });

  const s3 = new AWS.S3();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://10.8.0.12:5000/get-user/${userId}`);
        if (response.data.length > 0) {
          const userData = response.data[0];
          setUserDetails({
            username: userData.username,
            email: userData.email,
            orgId: userData.orgId,
            roleId: userData.roleId,
            phone: userData.phone,
            address: userData.address,
            imgUrl: userData.imgUrl,
          });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [userId]);

  const handleDelete = (value) => {
    const newTags = tags.filter((val) => val !== value);
    setTags(newTags);
  };

  const handleOnSubmit = (e) => {
    e.preventDefault();
    if (tagRef.current.value) {
      setTags([...tags, tagRef.current.value]);
      tagRef.current.value = "";
    }
  };

  const handleUpdate = async () => {
    try {
      let updatedUserDetails = { ...userDetails }; // Create a copy of userDetails
  
      // If a file is selected, upload it to MinIO first
      if (selectedFile) {
        const fileName = `${selectedFile.name}`; // Generate a unique file name
        const params = {
          Bucket: 'psuw001', // Replace with your MinIO bucket name
          Key: fileName,
          Body: selectedFile,
          ContentType: selectedFile.type 
        };
  
        // Upload the file to MinIO
        const { Location } = await s3.upload(params).promise();
        updatedUserDetails.imgUrl = Location; // Update imgUrl with the uploaded file's URL
      }
  
      // Send the updated user details to the server
      await axios.put(`http://10.8.0.12:5000/update-user/${userId}`, updatedUserDetails);
      
      // Update userDetails state after successful update
      setUserDetails(updatedUserDetails);
  
      // Close the dialog after successful update
      setOpen(false);
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };
  
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setFilePreview(URL.createObjectURL(file)); // Create a preview URL for the selected file
  };

  const { username, email, orgId, address, phone, roleId, imgUrl } = userDetails;
  let type = "";
  switch (roleId) {
    case "R003":
      type = "Developer";
      break;
    case "R002-B":
      type = "Organization";
      break;
    default:
      type = "RCTS";
      break;
  }
  const name = username || "";
  const address1 = address || "No data available please add";
  const phone1 = phone || "No data available please add";

  return (
    <Box sx={{ p: 2, display: "flex", justifyContent: "center", alignItems: "center" }}>
      <Card
        sx={{
          display: "flex",
          width: "100%",
          justifyContent: "center",
          alignContent: "center",
          backgroundColor: "#f4f8fd",
        }}
      >
        <ul 
          style={{
            listStyleType: "none",
            padding: 0,
          }}
        >
          <li
            style={{
              display: "flex",
              justifyContent: "center",
              alignContent: "center",
            }}
          >
            <Avatar
              sx={{ width: 120, height: 120, marginTop: "40px" }}
              src={imgUrl || filePreview} // Use uploaded image URL or preview
              alt={name.charAt(0).toUpperCase()}
            >
              {!imgUrl && !filePreview && name.charAt(0).toUpperCase()}
            </Avatar>
          </li>
          <li
            style={{
              display: "flex",
              justifyContent: "center",
              alignContent: "center",
              marginTop: "10px",
            }}
          >
            <Chip label={type} />
          </li>
          <li>
            <Typography
              variant="h4"
              sx={{
                display: "flex",
                marginTop: "20px",
                justifyContent: "center",
                alignContent: "center",
              }}
            >
              {name.split(" ")[0]}
            </Typography>
          </li>
          <li>
            <Typography
              variant="body1"
              sx={{
                display: "flex",
                marginTop: "10px",
                justifyContent: "center",
                alignContent: "center",
              }}
            >
              {type}
            </Typography>
          </li>
          <li>
            <List sx={{ width: "600px" }}>
              <ListItem divider>
                <ListItemText>Full Name</ListItemText>
                <ListItemText
                  style={{ display: "flex", justifyContent: "flex-end" }}
                >
                  {name}
                </ListItemText>
              </ListItem>
              <ListItem divider>
                <ListItemText>Email</ListItemText>
                <ListItemText
                  style={{ display: "flex", justifyContent: "flex-end" }}
                >
                  {email}
                </ListItemText>
              </ListItem>
              <ListItem divider>
                <ListItemText>Phone</ListItemText>
                <ListItemText
                  style={{ display: "flex", justifyContent: "flex-end" }}
                >
                  {phone1}
                </ListItemText>
              </ListItem>
              <ListItem>
                <ListItemText>Address</ListItemText>
                <ListItemText
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    marginLeft: "90px",
                  }}
                >
                  {address1}
                </ListItemText>
              </ListItem>
            </List>
          </li>
          <li style={{ marginTop: "10px", marginBottom: "40px" }}>
            <Button variant="contained" onClick={handleOpen}>
              Edit Details
            </Button>
            <Dialog open={open} onClose={handleClose}>
              <DialogTitle>Edit Details</DialogTitle>
              <DialogContent>
                <TextField
                  margin="dense"
                  id="username"
                  label="Username"
                  type="text"
                  fullWidth
                  value={username}
                  onChange={(e) =>
                    setUserDetails({ ...userDetails, username: e.target.value })
                  }
                />
                <TextField
                  margin="dense"
                  id="phone"
                  label="Phone"
                  type="text"
                  fullWidth
                  value={phone}
                  onChange={(e) =>
                    setUserDetails({ ...userDetails, phone: e.target.value })
                  }
                />
                <TextField
                  margin="dense"
                  id="address"
                  label="Address"
                  type="text"
                  fullWidth
                  value={address}
                  onChange={(e) =>
                    setUserDetails({ ...userDetails, address: e.target.value })
                  }
                />
                <Button
                  variant="contained"
                  component="label"
                  sx={{ mt: 2 }}
                >
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
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={handleUpdate}>Update</Button>
              </DialogActions>
            </Dialog>
          </li>
        </ul>
      </Card>
    </Box>
  );
}
