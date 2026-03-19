import React, { useState, useEffect } from "react";
import { Box, Container, Grid, Typography, Divider, TextField } from "@mui/material";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import Fuse from "fuse.js";
import { useParams } from "react-router-dom"; // Import useParams to access route parameters
import { ProjectCard } from "../cards/projectcard";

function NgoProjects() {
  const { ngoId,Name } = useParams(); // Get ngoId from route parameters
  const [query, setQuery] = useState("");
  const [characterResults, setCharacterResults] = useState([]);
  console.log(Name);

  // Fetch projects from API using ngoId
  useEffect(() => { 
    async function fetchProjects() {
      try {
        const response = await fetch(`http://10.8.0.14:5000/get-projects-by-org/${ngoId}`);
        const data = await response.json();
        console.log("API Response:", data); // Log the data for inspection

        // Adjust this based on the actual structure of data
        const projects = Array.isArray(data) ? data : [data];
        
        const formattedProjects = projects.map(project => ({
          id: project.projectId,
          name: project.projectName,
          address: "",
          problem_statement: project.projectDescription,
          created_at: project.projectDateCreated,
          deleted_at: null,
          tags: project.skillsRequired.map(skill => skill.name),
          updated_at: project.projectDateStart,
          noOfModules: project.moduleIds.length,
          orgId: project.projectOwner,
          assignedTo: project.assignedTo,
          time: project.totalDevTimeRequired,
          field: project.projectField,
          gitweburl: project.gitWebUrl,
          projectImage:project.projectImage,
        }));

        setCharacterResults(formattedProjects);

      } catch (error) {
        console.error("Error fetching project data:", error);
      }
    }

    fetchProjects();
  }, [ngoId]);

  // Fuse.js for search
  const fuse = new Fuse(characterResults, {
    keys: ["name"],
    threshold: 0.3,
  });

  const results = fuse.search(query);
  const cResults = query ? results.map(result => result.item) : characterResults;

  // Event handlers
  const handleOnSearch = (event) => {
    setQuery(event.currentTarget.value);
  };

  return (
    <>
      <Box component="main" sx={{ flexGrow: 1, paddingLeft: 10, paddingRight: 10 }}>
        <Container maxWidth={false} style={{ padding: 0, marginRight: "24px" }}>
          <Typography style={{ paddingTop: 20, fontSize: "24px", fontWeight: "bold" }}>
            <center>{Name} Projects</center>
          </Typography>
          <Divider />
          <Grid container spacing={2} justifyContent="flex-end" alignItems="flex-end">
            <Box sx={{ display: "flex", alignItems: "flex-end", marginLeft: 2, marginTop: 2 }}>
              <SearchOutlinedIcon sx={{ color: "active", mr: 1, my: 0.5 }} />
              <TextField
                id="search-projects"
                label="Search Projects"
                variant="standard"
                value={query}
                onChange={handleOnSearch}
              />
            </Box>
          </Grid>
          <Box sx={{ pt: 3 }}>
            <Grid container spacing={3}>
              {cResults.map(product => (
                <Grid item key={product.id} lg={3} md={6} xs={12}>
                  <ProjectCard product={product} />
                </Grid>
              ))}
              <Box width="100%" />
            </Grid>
          </Box>
        </Container>
      </Box>
    </> 
  );
}

// Helper function to calculate project progress (simple linear estimation)
const calculateProjectProgress = (start, end) => {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const currentDate = new Date();

  if (currentDate < startDate) return 0;
  if (currentDate > endDate) return 100;

  const totalDuration = endDate - startDate;
  const elapsedDuration = currentDate - startDate;

  return Math.round((elapsedDuration / totalDuration) * 100);
};

export default NgoProjects;
