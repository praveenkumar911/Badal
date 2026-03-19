

import React from "react";
import {
  Box,
  Card,
  CardContent,
  Divider,
  Button,
  Typography,
} from "@mui/material";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardActions from "@mui/material/CardActions";
import NgoDetails from "../Sub-Pages/ngoDetails";
import { useNavigate } from "react-router-dom";

export function NgoCard({ product, ...rest }) {
  let navigate = useNavigate();

  const truncate = (desc) => {
    const num = 100;
    if (!desc || !desc.length) {
      return "";
    }
    if (desc.length <= num) {
      return desc;
    }
    return desc.slice(0, num) + "...";
  };

  const truncateName = (name) => {
    const num = 16;
    if (!name || !name.length) {
      return "";
    }
    if (name.length <= num) {
      return name;
    }
    return name.slice(0, num) + "...";
  };

  const handleChange = (id,Name) => {
    navigate(`/ngoprojects/${id}/${Name}`);
  };

  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#f2fffe",
        height: "90%",
      }}
      {...rest}
    >
      
          <CardMedia
      component="img"
      image={product.imgUrl}
      sx={{
        borderBottomLeftRadius: '8%',
        borderBottomRightRadius: '8%',
        width: '100%', // Ensures the image fills its container width
        height: '41%', // Allows the image to adjust its height proportionally
        maxHeight: '300px', // Limits the maximum height of the image
        objectFit: 'cover', // Ensures the image covers the container without stretching
        objectPosition: 'center', // Centers the image within the container
      }}
    />


      <CardHeader
        title={truncateName(product.orgName)}
        sx={{ fontSize: "24px", fontWeight: "bold" }}
      />
      <Box sx={{ flexGrow: 0 }}>
        <CardContent>
          <Typography
            style={{ fontSize: "17px", height: 100 }}
            color="text.secondary"
          >
            {truncate(product.description)}
            <NgoDetails id={product.id} ngo={product} />
          </Typography>
        </CardContent>
      </Box>
      <Divider />
      <CardActions disableSpacing>
        <Button
          variant="outlined"
          size="small"
          onClick={() => handleChange(product.orgId,product.orgName)} // Fixed line
          sx={{ marginRight: 1 }}
        >
          Projects
        </Button>
      </CardActions>
    </Card>
  );
}

