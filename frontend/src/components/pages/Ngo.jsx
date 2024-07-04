import React, { useState, useEffect } from "react";
import { Box, Container, Grid, Typography } from "@mui/material";
import { NgoCard } from "../cards/ngocard";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import TextField from "@mui/material/TextField";
import Divider from "@mui/material/Divider";
import Fuse from "fuse.js";
import axios from "axios";

function Ngo() {
  const [query, setQuery] = useState(""); 
  const [ngos, setNgos] = useState([]);
  const [allNgos, setAllNgos] = useState([]);
  const [error, setError] = useState(null);

  // Fetch NGOs from the API
  useEffect(() => {
    axios.get('http://10.8.0.12:5000/org/role2')
      .then(response => { 
        const fetchedNgos = response.data.filter(org => org.isNgo === "true");
        setNgos(fetchedNgos);
        setAllNgos(fetchedNgos);
      })
      .catch(error => {
        console.error('Error fetching NGO data:', error);
        setError('Error fetching NGO data. Please try again later.');
      });
  }, []);

  // Search functionality using Fuse.js
  const fuse = new Fuse(allNgos, {
    keys: ["orgName"],
  });

  const results = fuse.search(query);
  const searchResults = query ? results.map(result => result.item) : allNgos;

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
            <center>NGOs</center>
          </Typography>
          <Divider />
          <Grid container spacing={2} justifyContent="flex-end">
            <Grid
              item
              sx={{ display: "flex", flexDirection: "row", alignItems: "flex-end" }}
            >
              <SearchOutlinedIcon
                sx={{ color: "active", my: "3px" }}
              />
              <TextField
                id="Search tile"
                label="Search NGOs"
                variant="standard"
                value={query}
                onChange={handleOnSearch}
                sx={{ flex: 1, margin: "0 20px", width: "250px" }}
              />
              {/* <AddNgo /> */}
            </Grid>
          </Grid>
          {error && <Typography color="error">{error}</Typography>}
          <Box sx={{ pt: 3 }}>
            <Grid container spacing={3}>
              {searchResults.map((ngo) => (
                <Grid item key={ngo._id} lg={3} md={6} xs={12}>
                  <NgoCard product={ngo} />
                </Grid>
              ))}
            </Grid>
          </Box>
        </Container>
      </Box>
    </>
  );
}

export default Ngo;
