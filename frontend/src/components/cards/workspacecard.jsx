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
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const Workspacecard = ({ product }) => {
  const navigate = useNavigate();
  const [assignedTeamName, setAssignedTeamName] = useState("");

  useEffect(() => {
    const fetchTeamName = async () => {
      try {
        const response = await axios.get(`http://10.8.0.12:5000/get-team-by-id/${product.assignedTeam}`);
        const team = response.data;
        if (team) {
          setAssignedTeamName(team.teamName);
        } else {
          console.error("Team not found for the specified ID");
        }
      } catch (error) {
        console.error("Error fetching team:", error);
      }
    };

    fetchTeamName();
  }, [product.assignedTeam]);

  const handleClick = (workspaceId) => {
    navigate(`/taskworkspace/${workspaceId}`);
  };

  const truncate = (desc, num) => {
    if (desc && desc.length <= num) {
      return desc;
    }
    return desc.slice(0, num) + "...";
  };

  return (
    <>
      <Card
        key={product._id}
        sx={{
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#f2fffe",
          marginBottom: 5,
        }}
      >
        <CardActionArea onClick={() => handleClick(product.workspaceId)}>
          <CardMedia
            component="img"
            height="fit-content"
            image={tile}
            sx={{
              borderBottomLeftRadius: "8%",
              borderBottomRightRadius: "8%",
              backgroundSize: "cover",
            }}
          />
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginX: 1,
              marginTop: 2,
            }}
          >
            <Typography variant="body2" color="text.secondary">
              <Chip
                icon={<PeopleAltIcon />}
                label={`Assigned Team: ${assignedTeamName}`}
                variant="outlined"
              />
            </Typography>
            {product.status_bol && (
              <Typography variant="body2" color="text.secondary">
                <Chip
                  icon={<DonutSmallIcon />}
                  label={product.status}
                  variant="outlined"
                />
              </Typography>
            )}
          </Box>
          <CardHeader
            title={product.workspaceName}
            sx={{
              fontSize: "24px",
              fontWeight: "bold",
              height: 50,
              width: "100%",
            }}
          />
          <Box sx={{ flexGrow: 0 }}>
            <CardContent>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontSize: "22px", height: 75, width: "100%" }}
              >
                {truncate(product.workspaceDescription, 100)}
              </Typography>
            </CardContent>
          </Box>
        </CardActionArea>
        <Divider />
        <CardActions disableSpacing style={{ marginBottom: 0 }}>
          <Typography
            color="textSecondary"
            sx={{ marginLeft: "auto" }}
            variant="body2"
          >
            {`Ongoing: ${product.unassigned}`}
            &nbsp; &nbsp;
            {`Done: ${product.completed}`}
          </Typography>
        </CardActions>
      </Card>
    </>
  );
};
