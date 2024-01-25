const express = require('express');
const router = express.Router();
const axios = require('axios'); // Import the 'axios' library to make HTTP requests
const multer = require('multer');
const accessToken = 'glpat-AoJxxL4SFhNj4JDArxBz'; 
const gitlabUrl = 'http://pl-git.iiit.ac.in/api/v4';
const fs = require('fs');
const path = require('path');
const subgroupGitId="340"
//const gitlabUrl='http://pl-git.iiit.ac.in/api/v4';

// Gitlab API
router.post('/create-user', async (req, res) => {
  const { email, password } = req.body;

  // Extract username from email (whatever is before @)
  const username = email.substring(0, email.indexOf('@'));

  try {
    // Create the GitLab user with extracted username and email
    const createUserResponse = await axios.post(`${gitlabUrl}/users`, {
      email,
      password,
      name: username, // Use extracted username as the name
      username, // Use extracted username as the GitLab username
      skip_confirmation: true, // Skip confirmation for the created user
    }, {
      headers: {
        'PRIVATE-TOKEN': accessToken,
      },
    });

    res.json(createUserResponse.data);
  } catch (error) {
    // Log error for debugging
    console.error('Error:', error);

    // Handle errors
    if (error.response && error.response.status === 409) {
      // 409 Conflict status indicates that the email or username is already taken
      res.status(409).json({ error: 'Email or username is already taken.' });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});
router.delete('/delete-user/:username', async (req, res) => {
  const { username } = req.params;

  // Log request data for debugging
  console.log('Request Data:', { username });

  try {
    // Find the user by username
    const findUserResponse = await axios.get(`${gitlabUrl}/users`, {
      params: {
        username,
      },
      headers: {
        'PRIVATE-TOKEN': accessToken,
      },
    });

    if (findUserResponse.data.length === 0) {
      // If user not found, send a response
      return res.status(404).json({ error: 'User not found.' });
    }

    // Get the user ID
    const userId = findUserResponse.data[0].id;

    // Delete the user by ID
    const deleteUserResponse = await axios.delete(`${gitlabUrl}/users/${userId}`, {
      headers: {
        'PRIVATE-TOKEN': accessToken,
      },
    });

    // Log response for debugging
    console.log('GitLab API Response:', deleteUserResponse.data);

    res.json({ message: `User '${username}' deleted successfully.` });
  } catch (error) {
    // Log error for debugging
    console.error('Error:', error);

    // Handle errors
    if (error.response && error.response.status === 404) {
      res.status(404).json({ error: 'User not found.' });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});
router.get('/list-projects', async (req, res) => {
    try {
      const response = await axios.get(`${gitlabUrl}/projects`, {
        headers: {
          'Private-Token': accessToken,
        },
      });
      res.json(response.data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  router.post('/create-project/:subgroupId', async (req, res) => {
    const { subgroupId } = req.params;
    const { name, description } = req.body;
  
    try {
      // Create the GitLab project
      const createProjectResponse = await axios.post(`${gitlabUrl}/projects`, {
        name,
        description,
        namespace_id: subgroupId
      }, {
        headers: {
          'PRIVATE-TOKEN': accessToken
        }
      });
  
      // If the project was created successfully, create a README file with the provided description
      if (createProjectResponse.data.id) {
        const projectId = createProjectResponse.data.id;
        await createReadmeFile(projectId, description);
  
        res.json(createProjectResponse.data);
      } else {
        res.json(createProjectResponse.data);
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  async function createReadmeFile(projectId, description) {
    const readmeContent = `# ${description}\n\n${description}`;
  
    try {
      await axios.post(
        `${gitlabUrl}/projects/${projectId}/repository/files/README.md`,
        {
          branch: 'main',
          content: readmeContent,
          commit_message: 'Create README.md',
        },
        {
          headers: {
            'PRIVATE-TOKEN': accessToken,
            'Content-Type': 'application/json',
          },
        }
      );
    } catch (error) {
      throw new Error(`Error creating README file: ${error.message}`);
    }
  }
  router.put('/edit-group-description/:id', (req, res) => {
    const groupId = req.params.id;
    const newDescription = req.body.newDescription;

    // Update the GitLab group with the specified description
    axios.put(`${gitlabUrl}/groups/${groupId}`, {
        description: newDescription,
    }, {
        headers: {
            'Private-Token': accessToken,
            'Content-Type': 'application/json',
        },
    })
        .then(response => {
            const data = response.data;
            // If the group was updated successfully, return the updated data
            if (data.id) {
                res.json(data);
            } else {
                res.json(data);
            }
        })
        .catch(error => res.status(500).json({ error: error.message }));
});  
router.delete('/delete-group/:id', (req, res) => {
  const groupId = req.params.id;

  // Delete the GitLab group with the specified ID
  axios.delete(`${gitlabUrl}/groups/${groupId}`, {
      headers: {
          'Private-Token': accessToken,
          'Content-Type': 'application/json',
      },
  })
      .then(() => {
          res.json({ message: 'Group deleted successfully' });
      })
      .catch(error => res.status(500).json({ error: error.message }));
});

router.put('/edit-repo/:id', async (req, res) => {
  const projectId = req.params.id;
  const newDescription = req.body.newDescription;

  if (!projectId || !newDescription) {
    return res.status(400).json({ error: 'Missing project ID or new description' });
  }

  try {
    // Create or update the project's README with the new description
    const response = await axios.put(`${gitlabUrl}/projects/${projectId}/repository/files/README.md`, {
      branch: 'main', // Specify the branch where you want to update the README
      content: newDescription, // Use the new description as the content of the README
      commit_message: 'Update README with new description', // Provide a commit message
    }, {
      headers: {
        'Private-Token': accessToken,
        'Content-Type': 'application/json',
      },
    });

    const data = response.data;

    // Check if the README was updated successfully
    if (data.file_path) {
      res.json(data);
    } else {
      res.status(500).json({ error: 'Failed to update README' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/create-repo-folder/:subfolderId', async (req, res) => {
  const { projectName, description } = req.body;
  const subfolderId = req.params.subfolderId; 

  try {
    // Create project within the specified subfolder
    const projResponse = await axios.post(
      `${gitlabUrl}/projects`,
      {
        name: projectName,
        description: description,
        visibility: 'private',
        namespace_id: subfolderId // Set the subfolder ID as the namespace_id
      },
      {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      }
    );

    // Create folders and files
    const actions = [
      { action: 'create', file_path: 'Database Documentation/Database Document.md', content: '', encoding: 'text' },
      { action: 'create', file_path: 'API Documentation/API Document.md', content: '', encoding: 'text' },
      { action: 'create', file_path: 'UI Mocks/UI Mocks Document.md', content: '', encoding: 'text' },
      { action: 'create', file_path: 'Requirements/Requirements Document.md', content: '', encoding: 'text' },
    ];

    const commitResponse = await axios.post(
      `${gitlabUrl}/projects/${projResponse.data.id}/repository/commits`,
      {
        branch: 'main',
        commit_message: `Create project '${projectName}'`,
        actions: actions
      },
      {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      }
    );

    // Create README file with project description
    const readmeContent = `# ${projectName}\n\n${description}`;
    const readmeUrl = `${gitlabUrl}/projects/${projResponse.data.id}/repository/files/README.md`;

    const readmeResponse = await axios.post(
      readmeUrl,
      {
        branch: 'main',
        content: readmeContent,
        commit_message: `Create README for project '${projectName}'`
      },
      {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      }
    );

    const response = {
      project: projResponse.data,
      readme: readmeResponse.data,
      message: `Project '${projectName}' created successfully with folders and README.`
    };

    res.status(200).json(response);
  } catch (err) {
    console.error(err);
    res.status(err?.response?.status || 500).json({
      message: err.message || 'Something went wrong.',
      error: err?.response?.data || {},
    });
  }
});



router.delete('/delete-repo/:id', (req, res) => {
    const projectId = req.params.id;

    // Send DELETE request to GitLab API to delete the project
    axios.delete(`${gitlabUrl}/projects/${projectId}`, {
        headers: {
            'Private-Token': accessToken,
        },
    })
        .then(response => {
            const data = response.data;
            // If the project was deleted successfully, return a success message
            if (response.status === 204) {
                res.json({ message: `Project ${projectId} has been deleted.` });
            } else {
                res.json(data);
            }
        })
        .catch(error => res.status(500).json({ error: error.message }));
});
router.post('/create-issue/:id', (req, res) => {
  const projectId = req.params.id;
  const title = req.body.title;
  const description = req.body.description || ''; // Get the description from the request or set it to an empty string if not provided

  // Create the GitLab issue with the specified title and description
  axios.post(`${gitlabUrl}/projects/${projectId}/issues`, {
      title: title,
      description: description,
  }, {
      headers: {
          'Private-Token': accessToken,
          'Content-Type': 'application/json',
      },
  })
      .then(response => res.json(response.data))
      .catch(error => res.status(500).json({ error: error.message }));
});

router.put('/edit-issue/:projectId/:issueIid', (req, res) => {
  const projectId = req.params.projectId;
  const issueIid = req.params.issueIid;
  const { description, taskName } = req.body;

  // Build the data object to send in the request
  const requestData = {
      description: description || '', // Set to an empty string if not provided
      title: taskName || '', // Set to an empty string if not provided
  };

  // Update the GitLab issue with the specified ID and new description/task name
  axios.put(`${gitlabUrl}/projects/${projectId}/issues/${issueIid}`, requestData, {
      headers: {
          'Private-Token': accessToken,
          'Content-Type': 'application/json',
      },
  })
      .then(response => res.json(response.data))
      .catch(error => res.status(500).json({ error: error.message }));
});

router.post('/push-to-folder/:projectId/:folderName', multer().single('file'), async (req, res) => {
  const projectId = req.params.projectId;
  const folderName = req.params.folderName;
  const file = req.file;
  
  try {
    // create file path
    const filePath = `${folderName}/${file.originalname}`;
    
    // check if folder already exists
    const folderExists = await axios.get(`${gitlabUrl}/projects/${projectId}/repository/tree`, {
      params: {
        path: folderName,
        ref: 'main',
      },
      headers: { 'Authorization': `Bearer ${accessToken}` }
    });
    
    if (folderExists.data && folderExists.data.some(file => file.type === 'tree' && file.name === folderName)) {
      // folder exists, upload file to folder
      const fileUploadResponse = await axios.post(
        `${gitlabUrl}/projects/${projectId}/repository/files/${encodeURIComponent(filePath)}`,
        {
          branch: 'main',
          content: file.buffer.toString('base64'),
          commit_message: `Upload file '${file.originalname}' to folder '${folderName}'`,
        },
        {
          headers: { 'Authorization': `Bearer ${accessToken}` }
        }
      );
  
      const response = {
        file: fileUploadResponse.data,
        message: `File '${file.originalname}' uploaded successfully to folder '${folderName}'.`
      };
      
      res.status(200).json(response);
    } else {
      // folder does not exist, create the folder and upload file to it
      const actions = [
        { 
          action: 'create',
          file_path: `${folderName}/${file.originalname}`,
          content: file.buffer.toString('base64'),
          encoding: 'base64'
        },
      ];
  
      const commitResponse = await axios.post(
        `${gitlabUrl}/projects/${projectId}/repository/commits`,
        {
          branch: 'main',
          commit_message: `Upload file '${file.originalname}' to new folder '${folderName}'`,
          actions: actions
        },
        {
          headers: { 'Authorization': `Bearer ${accessToken}` }
        }
      );
  
      const response = {
        file: commitResponse.data,
        message: `New folder '${folderName}' created with file '${file.originalname}'.`
      };
      
      res.status(200).json(response);
    }
  } catch (err) {
    console.error(err);
    res.status(err?.response?.status || 500).json({
      message: err.message || 'Something went wrong.',
      error: err?.response?.data || {},
    });
  }
})
router.post('/upload/:projectId/:folderName', async (req, res) => {
  const projectId = req.params.projectId;
  const folderName = req.params.folderName;
  const fileContent = req.body.file;
  
  try {
    // create file path
    const file = await Buffer.from(fileContent, 'base64');
    const filePath = `${folderName}/${file.originalname}`;
    
    // check if folder already exists
    const folderExists = await axios.get(`${gitlabUrl}/projects/${projectId}/repository/tree`, {
      params: {
        path: folderName,
        ref: 'main',
      },
      headers: { 'Authorization': `Bearer ${accessToken}` }
    });
    
    if (folderExists.data && folderExists.data.some(file => file.type === 'tree' && file.name === folderName)) {
      // folder exists, upload file to folder
      const fileUploadResponse = await axios.post(
        `${gitlabUrl}/projects/${projectId}/repository/files/${encodeURIComponent(filePath)}`,
        {
          branch: 'main',
          content: file.buffer.toString('base64'),
          commit_message: `Upload file '${file.originalname}' to folder '${folderName}'`,
        },
        {
          headers: { 'Authorization': `Bearer ${accessToken}` }
        }
      );
  
      const response = {
        file: fileUploadResponse.data,
        message: `File '${file.originalname}' uploaded successfully to folder '${folderName}'.`
      };
      
      res.status(200).json(response);
    } else {
      // folder does not exist, create the folder and upload file to it
      const actions = [
        { 
          action: 'create',
          file_path: `${folderName}/${file.originalname}`,
          content: file.buffer.toString('base64'),
          encoding: 'base64'
        },
      ];
  
      const commitResponse = await axios.post(
        `${gitlabUrl}/projects/${projectId}/repository/commits`,
        {
          branch: 'main',
          commit_message: `Upload file '${file.originalname}' to new folder '${folderName}'`,
          actions: actions
        },
        {
          headers: { 'Authorization': `Bearer ${accessToken}` }
        }
      );
  
      const response = {
        file: commitResponse.data,
        message: `New folder '${folderName}' created with file '${file.originalname}'.`
      };
      
      res.status(200).json(response);
    }
  } catch (err) {
    console.error(err);
    res.status(err?.response?.status || 500).json({
      message: err.message || 'Something went wrong.',
      error: err?.response?.data || {},
    });
  }
})
router.post('/create-subgroup/:subgroupId', async (req, res) => {
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
    res.json(createSubgroupResponse.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/create-org-subgroup', async (req, res) => {
  const  subgroupId  = subgroupGitId;
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
    res.json(createSubgroupResponse.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  } 
});


router.post('/create-subgroup-with-users/:gitgroupId', async (req, res) => {
  const gitgroupId = req.params.gitgroupId;
  const { name, description, userIds } = req.body;

  try {
    // Create the GitLab subgroup
    const createSubgroupResponse = await axios.post(`${gitlabUrl}/groups`, {
      name,
      path: name.toLowerCase(),
      parent_id: gitgroupId,
      visibility: 'private',
      description
    }, {
      headers: {
        'PRIVATE-TOKEN': accessToken
      }
    });

    const subgroup = createSubgroupResponse.data;
    const subgroupId = subgroup.id;

    // Associate users with the subgroup
    if (userIds && userIds.length > 0) {
      const addUserPromises = userIds.map(async (userId) => {
        try {
          await axios.post(`${gitlabUrl}/groups/${subgroupId}/members`, {
            user_id: userId,
            access_level: 30 // Access level: 30 provides Developer access. Adjust as needed.
          }, {
            headers: {
              'PRIVATE-TOKEN': accessToken
            }
          });
        } catch (error) {
          console.error(`Error adding user ${userId} to subgroup:`, error.message);
        }
      });

      // Wait for all user addition promises to resolve
      await Promise.all(addUserPromises);
    }

    res.json(subgroup);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.post('/fork-and-add-to-subgroup/:repoGitlabId/:subgroupId', async (req, res) => {
  const repoGitlabId = req.params.repoGitlabId;
  const subgroupId = req.params.subgroupId;

  try {
    // Fork the repository
    const forkRepoResponse = await axios.post(`${gitlabUrl}/projects/${repoGitlabId}/fork`, null, {
      headers: {
        'PRIVATE-TOKEN': accessToken
      }
    });

    const forkedRepoId = forkRepoResponse.data.id;

    // Add the forked repository to the subgroup
    const addRepoToSubgroupResponse = await axios.post(`${gitlabUrl}/groups/${subgroupId}/projects/${forkedRepoId}`, null, {
      headers: {
        'PRIVATE-TOKEN': accessToken
      }
    });

    // Return details of the forked repository as the response
    res.json(forkRepoResponse.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}); 
router.post('/assign-issue', async (req, res) => {
  try {
    // Extract data from the request body
    const { projectId, issueId, userId } = req.body;

    // Validate the presence of required fields
    if (!projectId || !issueId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Use GitLab API to assign or unassign the issue to the user
    const gitlabApiUrl = `${gitlabUrl}/projects/${projectId}/issues/${issueId}`;
    const gitlabAccessToken = accessToken; // Replace with your GitLab access token

    // Prepare the request payload based on the presence of userId
    const payload = userId ? { assignee_ids: [userId] } : { assignee_ids: [] };

    // Make a request to update the issue
    const response = await axios.put(
      gitlabApiUrl,
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
          'PRIVATE-TOKEN': gitlabAccessToken,
        },
      }
    );

    // Check the GitLab API response
    if (response.status === 200) {
      return res.json({ success: true, message: 'Issue assignment updated successfully' });
    } else {
      return res.status(response.status).json({ error: 'Failed to update issue assignment' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});


module.exports = router;