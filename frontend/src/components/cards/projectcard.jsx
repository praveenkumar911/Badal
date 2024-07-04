import React from 'react';
import { Card, CardContent, Typography, Box, Divider, Stack, Chip, CardMedia, CardActions, CardActionArea, CardHeader } from "@mui/material";
import { useNavigate } from "react-router-dom";
import tile from "../icons/projectPH.png";
import { useEffect,useState } from 'react';
import axios from 'axios';
import Button from '@mui/material/Button';
import Workspace from '../pages/workspace';
// Updated truncate function
import { Dialog, DialogContent } from "@mui/material";
const truncate = (desc = '') => {
  const num = 32;
  if (desc.length <= num) {
    return desc;
  }
  return desc.slice(0, num) + "...";
};
  
// Updated truncateTitle function
const truncateTitle = (desc = '') => {
  const num = 30;
  if (desc.length <= num) {
    return desc;
  }
  return desc.slice(0, num) + "...";
};
 
export const ProjectCard = ({ product, ...rest }) => {
  let navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const [assignedTeamName, setAssignedTeamName] = useState("");
  const permissionString = localStorage.getItem("permissions");
  const permissions = permissionString ? permissionString.split(",") : [];
  const isP005Allowed = permissions.includes("P005");
  const isP006Allowed = permissions.includes("P006");
  const isP001Allowed = permissions.includes("P001");
  const isP002Allowed = permissions.includes("P002");
  const isP003Allowed =permissions.includes('P003')
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };


  useEffect(() => {  
    const fetchTeamName = async () => {
      try {
        const response = await axios.get(`http://10.8.0.12:5000/get-org/${product.assignedTo}`);
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

    fetchTeamName();
  }, [product.assignedTo]);


  // const handleChange = async () => {
  //   try {
  //     const userId = localStorage.getItem('userId');
  //     const orgid=localStorage.getItem('orgId') 
      
      
  //     console.log(product.assignedTo,orgid);
  //     // Check if isP002 is uniquely allowed or if isP005 is allowed
  //     if (isP002Allowed && !isP005Allowed) {
  //       // Navigate only if isP002 is uniquely allowed
  //       if (orgid === product.assignedTo) {
  //         navigate(`/module/${product.id}`, {
  //           state: {
  //             id: product.id,
  //             name: product.name,
  //             desc: product.problem_statement,
  //             ngo: product.ngo,
  //             assignedTo: product.assignedTo,
  //           },
  //         });
  //       } else {
  //         // Don't navigate
  //         console.log("User is not assigned to this project's team");
  //       }
  //     } else if (isP005Allowed || isP001Allowed) {
  //       // Navigate if isP005 is allowed (old way)
  //       navigate(`/module/${product.id}`, {
  //         state: {
  //           id: product.id,
  //           name: product.name,
  //           desc: product.problem_statement,
  //           ngo: product.ngo,
  //           assignedTo: product.assignedTo,
  //         },
  //       });
  //     } else {
  //       // Permissions don't allow navigation
  //       console.log("User does not have the necessary permissions");
  //     }
  //   } catch (error) {
  //     console.error("Error fetching user data:", error);
  //   }
  // };
  const handleChange = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const orgid = localStorage.getItem('orgId');
  
  
      
      // Check if isP005 or isP001 is allowed
      if (isP005Allowed || isP001Allowed) {
        // Navigate if either P005 or P001 is allowed
        navigate(`/module/${product.id}`, {
          state: {
            id: product.id,
            name: product.name,
            desc: product.problem_statement,
            ngo: product.ngo,
            assignedTo: product.assignedTo,
          },
        });
      } else if (isP002Allowed && !isP005Allowed) {
        // Navigate only if isP002 is uniquely allowed and orgId matches
        if (orgid === product.assignedTo) {
          navigate(`/module/${product.id}`, {
            state: {
              id: product.id,
              name: product.name,
              desc: product.problem_statement,
              ngo: product.ngo,
              assignedTo: product.assignedTo,
            },
          });
        } else {
          // Don't navigate
          console.log("User is not assigned to this project's team");
        }
      } else {
        // Permissions don't allow navigation
        console.log("User does not have the necessary permissions");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };
  
  

  return (
    <>
    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#f2fffe",
        marginBottom: 5,
      }}
      {...rest} 
    >
      <CardActionArea >
        <CardMedia
          component="img"
          height="fit-content"
          image={product.projectImage || tile}
          sx={{
            borderBottomLeftRadius: "8%",
            borderBottomRightRadius: "8%",
            backgroundSize: "cover",
            height:'200px'
          }}
          onClick={handleChange}
        />
        <CardHeader
          title={truncateTitle(product.name)}
          subheader={product.ngo} 
          sx={{
            fontSize: "24px",
            fontWeight: "bold",
            height: 100,
            width: "100%",
          }}
        />
        <Box sx={{ flexGrow: 0 }}>
          <CardContent>
            <Typography
              style={{ fontSize: "22px", height: 100 }}
              color="text.secondary"
              sx={{ height: 75, width: "100%" }}
            >
              {truncate(product.problem_statement)}
            </Typography>
          </CardContent>
        </Box>
        <Button
        variant="text"
        onClick={handleClickOpen}  
        style={{ display: "flex", margin: "5px" }}
      >
        Read More
      </Button>
        <Stack
          direction="row"
          spacing={1}
          sx={{ marginLeft: 1, marginBottom: 3 }}
        >
          {product.tags && product.tags.map((pr, index) => (
            <Chip
              key={index}
              label={pr} 
              variant="outlined"
              size="small"
              style={{ width: "20%" }} 
            />
          ))}
        </Stack>
        <Divider />
        <CardActions disableSpacing style={{ marginBottom: 0 }}>
          <Typography
            color="textSecondary"
            sx={{ marginRight: "auto", marginLeft: "3px" }}
            variant="body2"
          >
            {`Picked By: ${assignedTeamName}`}
          </Typography>
          {/* <Typography
            color="textSecondary"
            sx={{ marginLeft: "auto", marginRight: "3px" }}
            variant="body2"
          >
            {`No Of Modules: ${product.noOfModules}`}
          </Typography> */}
        </CardActions>
      </CardActionArea>
      
    </Card>
    <Dialog
  open={open}
  onClose={handleClose}
  // maxWidth={false} // Disable the default maxWidth behavior
  sx={{ '& .MuiDialog-paper': { width: '83%', maxWidth: '100vw',  } }} // Adjust maxWidth for the paper
>
  <DialogContent sx={{ padding: 0, marginLeft: '-2.8vw', marginRight: '0', marginTop: '-3.4vh', width: '100%' }}> {/* Adjust margins */}
    <Workspace project={product} />
  </DialogContent>
</Dialog>
    </>
  );
};
