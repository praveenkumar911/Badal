import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  TextField,
  Divider,
  Dialog,
  DialogContent,
  Button,
} from "@mui/material";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import Fuse from "fuse.js";
import CustomCard from "../cards/customcard";
import SignUpComp from "../login/SignUpComp";
import axios from "axios";

function Companies() { 
  const [query, setQuery] = useState("");
  const [companiesList, setCompaniesList] = useState([]);
  const [allCompanies, setAllCompanies] = useState([]);
  const [open, setOpen] = useState(false);
  const permissionString = localStorage.getItem("permissions");
  const permissions = permissionString ? permissionString.split(",") : [];
  const isP005Allowed = permissions.includes("P005");
  const isP006Allowed = permissions.includes("P006");
  const isP001Allowed = permissions.includes("P001");
  const isP002Allowed = permissions.includes("P002");

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    // Fetch data from the API endpoint
    axios
      .get("http://10.8.0.12:5000/org/role2")
      .then((response) => {
        // Filter organizations where isNgo is false
        const filteredCompanies = response.data.filter(
          (company) => company.isNgo === "false"
        );
        setCompaniesList(filteredCompanies);
        setAllCompanies(filteredCompanies);
      })
      .catch((error) => {
        console.error("Error fetching company data:", error);
      });
  }, []);

  const fuse = new Fuse(allCompanies, {
    keys: ["orgName"],
  });

  const results = fuse.search(query);
  const characterResults = query ? results.map((result) => result.item) : allCompanies;

  function handleOnSearch({ currentTarget = {} }) {
    const { value } = currentTarget;
    setQuery(value);
  }

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
        <Container maxWidth={true} style={{ padding: 0, marginRight: "24px" }}>
          <Typography
            style={{ paddingTop: 20, fontSize: "24px", fontWeight: "bold" }}
          >
            <center>Companies & Colleges</center>
          </Typography>
          <Divider />
          <Grid
            container
            spacing={2}
            justifyContent="flex-end"
            alignItems="flex-end"
          >
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
                label="Search Companies"
                variant="standard"
                value={query}
                onChange={handleOnSearch}
              />
            </Box>
            <Button variant="outlined" onClick={handleOpen} disabled={!isP006Allowed && !isP005Allowed}>
              Add Company / NGO
            </Button>
          </Grid>
          <Box sx={{ pt: 3 }}>
            <Grid container spacing={3}>
              {characterResults.map((company) => (
                <Grid item key={company._id} lg={3} md={6} xs={12}>
                  <CustomCard product={company} />
                </Grid>
              ))}
            </Grid>
          </Box>
        </Container>
      </Box>
      <Dialog open={open} onClose={handleClose} maxWidth="md">
        <DialogContent>
          <SignUpComp />
        </DialogContent>
      </Dialog>
    </>
  );
}

export default Companies;
