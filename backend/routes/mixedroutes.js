const express = require('express');
const router = express.Router();
const axios = require('axios');

// Assuming you have the projects model and other required variables declared
const accessToken = 'glpat-AoJxxL4SFhNj4JDArxBz'; 
const gitlabUrl = 'http://pl-git.iiit.ac.in/api/v4';


router.post('/create-subgroup-and-project', async (req, res) => {
  const { subgroupId } = req.params;
  const { name, description } = req.body;

  try {
    // Create the GitLab subgroup
    const createSubgroupResponse = await axios.post(`${gitlabUrl}/groups`, {
      name,
      path: name.toLowerCase(),
      parent_id: subgroupId,
      visibility: 'private',
      description
    }, {
      headers: {
        'PRIVATE-TOKEN': accessToken 
      }
    });

    // Save the new project to the projects collection
    const newProject = new projects({
      projectCreatedBy: req.body.projectCreatedBy,
      projectDateCreated: new Date(),
      projectName: req.body.projectName, 
      projectField: req.body.projectField,
      projectDescription: req.body.projectDescription,
      projectOwner: req.body.projectOwner,
      projectManager: req.body.projectManager,
      projectDateStart: req.body.projectDateStart,
      projectDateEnd: req.body.projectDateEnd,
      skillsRequired: req.body.skillsRequired,
      totalDevTimeRequired: req.body.totalDevTimeRequired, 
      gitlabID: createSubgroupResponse.data.id, // Use GitLab subgroup ID here
      gitWebUrl: createSubgroupResponse.data.web_url, // Use GitLab subgroup web URL here
      gitProjectName: req.body.Gitprojectname,
      gitGroupID: req.body.GitGroupID
    });
   
    newProject.save((err, project) => {
      if (err) { 
        console.log(err);
        res.status(500).send('An error occurred while saving the project to the database.');
      } else {
        console.log("New project added to projects collection!");
        res.status(200).json({
          subgroup: createSubgroupResponse.data,
          project
        });
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
