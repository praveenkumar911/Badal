import React from "react";
import { Box, Button, Typography } from "@mui/material";
import Divider from "@mui/material/Divider";
import {
  TableContainer,
  Table,
  TableBody,
  TableCell,
  TableHead,
  Chip,
  Grid,
  Paper,
  TableRow,
  FormControl,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { makeStyles } from "@mui/styles";
import { useState, useEffect } from "react";
import Select from "react-select";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import TextField from "@mui/material/TextField";
import { tableCellClasses } from "@mui/material/TableCell"; 
import Fuse from "fuse.js";
import { Dialog, DialogContent } from "@mui/material";
import CreateTeam from "../Sub-Pages/addteam";
import axios from "axios";
import SignupDev from "../login/SignUpDev";
import EditTeam from '../Editpages/editteam'
const useStyles = makeStyles({
  table: {
    minWidth: 100,
  },
});

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
    fontSize: 18,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

function Team() {
  const classes = useStyles();
  const [teams, setTeams] = useState([]);
  const [usernames, setUsernames] = useState({});
  const [open, setOpen] = useState(false);
  const [open1, setOpen1] = useState(false);
  const [open2, setOpen2] = useState(false);
  const permissionString = localStorage.getItem("permissions");
  const permissions = permissionString ? permissionString.split(",") : [];
  const isP005Allowed = permissions.includes("P005");
  const isP006Allowed = permissions.includes("P006");
  const isP001Allowed = permissions.includes("P001");
  const isP002Allowed = permissions.includes("P002");
  const isP003Allowed =permissions.includes('P003')
  const [teamId,setTeamId]=useState('')

  const orgId = localStorage.getItem("orgId");
  const [isNgo, setIsNgo] = useState(false);
  useEffect(() => {
    // Make a request to fetch organization data
    fetch(`http://10.8.0.12:5000/get-org/${orgId}`)
      .then(response => response.json())
      .then(data => {
        // Check if isNgo is true
        setIsNgo(data.isNgo === 'true');
      })
      .catch(error => console.error('Error fetching organization data:', error));
  }, []);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen1 = () => {
    setOpen1(true);
  };

  const handleClose1 = () => {
    setOpen1(false);
  };
  const handleOpen2 = (teamId) => {
    setTeamId(teamId);
    setOpen2(true);
  };
  const handleClose2 = () => {
    setOpen2(false);
  };

  useEffect(() => {
    // Fetch all teams data
    axios
      .get("http://10.8.0.12:5000/get-all-teams")
      .then((response) => {
        const allTeams = response.data;

        // Filter teams based on orgId if P005 or P006 is not allowed
        const filteredTeams = isP005Allowed || isP006Allowed
          ? allTeams
          : allTeams.filter((team) => team.orgId === orgId);

        setTeams(filteredTeams);
      })
      .catch((error) => {
        console.error("Error fetching teams data:", error);
      });
  }, [isP005Allowed, isP006Allowed, orgId]);

  useEffect(() => {
    if (teams && teams.length > 0) {
      const userIds = teams.flatMap((team) => team?.userIds || []);

      if (userIds.length > 0) {
        axios
          .post("http://10.8.0.12:5000/get-usernames", { userIds })
          .then((response) => {
            const fetchedUsernames = response.data.usernames;

            const userToUsernameMap = {};
            userIds.forEach((userId, index) => {
              if (fetchedUsernames[index]) {
                userToUsernameMap[userId] = fetchedUsernames[index];
              }
            });

            setUsernames(userToUsernameMap);
          })
          .catch((error) => {
            console.error("Error fetching usernames:", error);
          });
      }
    }
  }, [teams]);
 

  return (
    <>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          paddingLeft: 10,
          paddingRight: 10,
        }}
      >
        <Typography
          style={{ paddingTop: 20, fontSize: "24px", fontWeight: "bold" }}
        >
          <center>Teams</center>
        </Typography>
        <Divider />
        <Grid container justifyContent="flex-end" alignItems="flex-end">
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-end",
              marginLeft: 2,
              marginTop: 2,
            }}
          >
            <SearchOutlinedIcon sx={{ color: "active", mr: 1, my: 0.5 }} />
            <TextField
              id="Search tile"
              label="Search Teams"
              variant="standard"
            />
          </Box>
          <Button
  variant="outlined"
  onClick={handleOpen}
  disabled={(isP001Allowed && isNgo) || (!isP001Allowed && !isP005Allowed && !isP006Allowed)}
>
  Add Team
</Button>

<Button
  variant="outlined"
  onClick={handleOpen1} 
  disabled={(isP001Allowed && isNgo) || (!isP001Allowed && !isP005Allowed && !isP006Allowed)}
>
  Add Developer
</Button>

        </Grid>

        {/* <TableContainer component={Paper} sx={{ marginTop: 3 }}>
          <Table className={classes.table} aria-label="a dense table">
            <TableHead>
              <TableRow>
                <StyledTableCell align="center">Team Name</StyledTableCell>
                <StyledTableCell align="center">Participants</StyledTableCell>
                <StyledTableCell align="center">Skills</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {teams.map((team) => (
                <StyledTableRow key={team.teamId}>
                  <TableCell align="center">{team.teamName}</TableCell>
                  <TableCell align="center">
                    {team.userIds.map((userId) => (
                      <Chip
                        key={userId}
                        label={usernames[userId] || userId} // Use the username if available, otherwise fallback to the user ID
                        variant="outlined"
                        size="small"
                        style={{
                          width: "min-content",
                          marginLeft: 1,
                          marginTop: 2,
                        }}
                      />
                    ))}
                  </TableCell>
                  <TableCell align="center">
                    {team.teamSkills.map((skill) => (
                      <Chip
                        key={skill}
                        label={skill}
                        variant="outlined"
                        size="small"
                        style={{
                          width: "min-content",
                          marginLeft: 1,
                          marginTop: 2,
                        }}
                      />
                    ))}
                  </TableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer> */}
        <TableContainer component={Paper} sx={{ marginTop: 3 }}>
  <Table className={classes.table} aria-label="a dense table">
    <TableHead>
      <TableRow>
        <StyledTableCell align="center">Team Name</StyledTableCell>
        <StyledTableCell align="center">Participants</StyledTableCell>
        <StyledTableCell align="center">Skills</StyledTableCell>
        <StyledTableCell align="center"></StyledTableCell> {/* Add an empty cell for the button */}
      </TableRow>
    </TableHead>
    <TableBody>
      {teams.map((team) => (
        <StyledTableRow key={team.teamId}>
          <TableCell align="center">{team.teamName}</TableCell>
          <TableCell align="center">
            {team.userIds.map((userId) => (
              <Chip
                key={userId}
                label={usernames[userId] || userId}
                variant="outlined"
                size="small"
                style={{
                  width: "min-content",
                  marginLeft: 1,
                  marginTop: 2,
                }}
              />
            ))}
          </TableCell>
          <TableCell align="center">
            {team.teamSkills.map((skill) => (
              <Chip
                key={skill}
                label={skill}
                variant="outlined"
                size="small"
                style={{
                  width: "min-content",
                  marginLeft: 1,
                  marginTop: 2,
                }}
              />
            ))}
          </TableCell>
          <TableCell align="center">
            <Button variant="contained" onClick={() => handleOpen2(team.teamId)} disabled={!isP003Allowed && !isP005Allowed} >Edit Team</Button>
          </TableCell>
        </StyledTableRow>
      ))}
    </TableBody>
  </Table> 
</TableContainer>

      </Box>
      <Dialog open={open} onClose={handleClose} maxWidth="md">
        <DialogContent>
          <CreateTeam />
        </DialogContent>
      </Dialog>
      <Dialog open={open1} onClose={handleClose1} maxWidth="md">
        <DialogContent>
          <SignupDev />
        </DialogContent>
      </Dialog>
      <Dialog open={open2} onClose={handleClose2} maxWidth="md">
        <DialogContent>
     
       < EditTeam teamId={teamId}/>
     
        </DialogContent>
      </Dialog>
    </>
  );
}

export default Team;
