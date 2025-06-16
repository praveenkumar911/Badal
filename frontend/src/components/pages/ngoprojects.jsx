import React, { useState, useEffect } from "react";
import { Box, Container, FormControl, Grid, Typography, Button, Divider, TextField, Dialog, DialogContent } from "@mui/material";
import Select from "react-select";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import Fuse from "fuse.js";
import { ProjectCard } from "../cards/projectcard";
import Createproject from "../Sub-Pages/createproject";
import { useParams } from "react-router-dom"; // Import useParams to get orgId from params

function NGOProjects() {
  const { orgId } = useParams(); // Extract orgId from URL parameters
  const [query, setQuery] = useState("");
  const [characterResults, setCharacterResults] = useState([]);
  const [Company, setCompany] = useState([]);
  const [filterSelect, setFilterSelect] = useState({});
  const [selectedOption, setselectedOption] = useState("");
  const [selectedOption2, setselectedOption2] = useState("");
  const [open, setOpen] = useState(false);

  // Get permissions from local storage
  const permissionString = localStorage.getItem("permissions");
  const permissions = permissionString ? permissionString.split(",") : [];
  const isP005Allowed = permissions.includes("P005");
  const isP006Allowed = permissions.includes("P006");
  const isP001Allowed = permissions.includes("P001");

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    async function fetchProjects() {
      try {
        const response = await fetch("http://10.8.0.14:5000/get-project-DB");
        const data = await response.json();

        // Map the API data to the format expected by your component
        const projects = data.map((project) => ({
          id: project.projectId,
          name: project.projectName,
          address: "",
          problem_statement: project.projectDescription,
          created_at: project.projectDateCreated,
          deleted_at: null,
          tags: project.skillsRequired.map((skill) => skill.name),
          updated_at: project.projectDateStart,
          noOfModules: project.moduleIds.length,
          orgId: project.projectOwner, // Ensure to match with localStorage orgId
          progress: calculateProjectProgress(
            project.projectDateStart,
            project.projectDateEnd
          ),
        }));

        // Filter projects based on orgId parameter and permissions
        const filteredProjects =
          isP005Allowed || isP006Allowed
            ? projects
            : projects.filter((project) => project.orgId === orgId);

        // Log filtered projects to debug
       

        setCharacterResults(filteredProjects);

        // Simulate fetching company data (replace this with actual API if needed)
        const dummyNGOs = [
          { value: "1", label: "NGO A" },
          { value: "2", label: "NGO B" },
        ];
        setCompany(dummyNGOs);

        // Set initial filter selection if session storage has ngoId
        const ngoId = localStorage.getItem("ngoId");
        if (ngoId) {
          const selectedNGO = dummyNGOs.find((ngo) => ngo.value === ngoId);
          if (selectedNGO) {
            setFilterSelect(selectedNGO);
          }
        }
      } catch (error) {
        console.error("Error fetching project data:", error);
      }
    }

    fetchProjects();
  }, [isP005Allowed, isP006Allowed, orgId]);

  const fuse = new Fuse(characterResults, {
    keys: ["name"],
    threshold: 0.3,
  });

  const results = fuse.search(query);
  const cResults = query
    ? results.map((result) => result.item)
    : characterResults;

  function handleOnSearch(event) {
    setQuery(event.currentTarget.value);
  }

  const handleChange1 = (sOption) => {
    setselectedOption(sOption);
    localStorage.setItem("type", sOption.value);
  };

  const handleChange2 = (sOption) => {
    setselectedOption2(sOption);
    localStorage.setItem("entity", sOption.value);
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

            <Button
              variant="outlined"
              onClick={handleOpen}
              disabled={!isP001Allowed && !isP005Allowed}
            >
              Add Project
            </Button>
          </Grid>
          <Box sx={{ pt: 3 }}>
            <Grid container spacing={3}>
              {cResults.map((product) => (
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

export default NGOProjects;
