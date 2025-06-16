import React, { useState, useEffect } from "react";
import { Box, Container, Grid, Typography, Button, Divider, TextField, Dialog, DialogContent } from "@mui/material";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import Fuse from "fuse.js";
import { ProjectCard } from "../cards/projectcard";
import Createproject from "../Sub-Pages/createproject";

function Projects() {
  const [query, setQuery] = useState("");
  const [characterResults, setCharacterResults] = useState([]);
  const [open, setOpen] = useState(false);

  // Session storage variables
  const orgId = localStorage.getItem('orgId');
  const isP001Allowed = true;  // Always allow project creation
  const permissionString = localStorage.getItem("permissions");
  const permissions = permissionString ? permissionString.split(",") : [];
  const isP005Allowed = permissions.includes("P005");
  const isP006Allowed = permissions.includes("P006");
  const isP004Allowed = permissions.includes("P004");
  const isP002Allowed = permissions.includes("P002");
  const isP003Allowed =permissions.includes('P003')
  const [isNgo, setIsNgo] = useState(false);
  useEffect(() => {
    // Make a request to fetch organization data
    fetch(`http://10.8.0.14:5000/get-org/${orgId}`)
      .then(response => response.json())
      .then(data => {
        // Check if isNgo is true
        setIsNgo(data.isNgo === 'true');
      })
      .catch(error => console.error('Error fetching organization data:', error));
  }, []);
  // Fetch projects from API
  useEffect(() => {
    async function fetchProjects() {
      try {
        const response = await fetch("http://10.8.0.14:5000/get-project-DB");
        const data = await response.json();

        // Map API data to the format expected by the component
        const projects = data.map(project => ({
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
          assignedTo:project.assignedTo ,//calculateProjectProgress(project.projectDateStart, project.projectDateEnd),
          time:project.totalDevTimeRequired,
          field:project.projectField,
          gitweburl:project.gitWebUrl,
          projectImage:project.projectImage,
        }));

        setCharacterResults(projects);

      } catch (error) {
        console.error("Error fetching project data:", error);
      }
    }

    fetchProjects();
  }, []);

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

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Box component="main" sx={{ flexGrow: 1, paddingLeft: 10, paddingRight: 10 }}>
        <Container maxWidth={false} style={{ padding: 0, marginRight: "24px" }}>
          <Typography style={{ paddingTop: 20, fontSize: "24px", fontWeight: "bold" }}>
            <center>Projects</center>
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

            <Button variant="outlined" onClick={handleOpen}   disabled={!(isP001Allowed && isNgo) && !isP005Allowed && !isP006Allowed} >
  Add Project
</Button>

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
      <Dialog open={open} onClose={handleClose} maxWidth="md">
        <DialogContent>
          <Createproject />
        </DialogContent>
      </Dialog>
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

export default Projects;

