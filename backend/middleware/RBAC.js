const express = require('express');
const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { sendRegistrationEmail } = require('./nodemailer');
const router = express.Router();
const secretKey = "iedbwb67698$%$#@%^&ghgevhgfi";
const { Role, Permission, RolePermission, User, PermissionsExtra } = require('../Schemas/collectionUser'); 
const Organization =require('../Schemas/collectionOrg');
const bodyParser = require('body-parser');
  router.use(bodyParser.json());
  async function createCollections() {
    try {
      const rolesCount = await Role.countDocuments();
      const permissionsCount = await Permission.countDocuments();
      const rolePermissionsCount = await RolePermission.countDocuments();
      const PermissionsExtraCount = await PermissionsExtra.countDocuments();
  
      if (rolesCount === 0 && permissionsCount === 0 && rolePermissionsCount === 0 && PermissionsExtraCount === 0) {
        await Role.insertMany([
          { roleId: 'R001', roleName: 'Admin' },
          { roleId: 'R002', roleName: 'Manager' },
          { roleId: 'R002-A', roleName: 'CoreManager' },
          { roleId: 'R002-B', roleName: 'OrgManager' },
          { roleId: 'R003', roleName: 'Developer' },
          { roleId: 'R003-A', roleName: 'CoreDeveloper' },
          { roleId: 'R003-B', roleName: 'OrgDeveloper' },
        ]);
  
        await Permission.insertMany([
          { permissionId: 'P001', permissionName: 'Create', description: 'Allows the role to create Project, Module, Task, & Team' },
          { permissionId: 'P002', permissionName: 'Read', description: 'Allows the role to have a component visible or not for Project, Module, Task, & Team' },
          { permissionId: 'P003', permissionName: 'Update', description: 'Allows the role to update Project, Module, Task, & Team' },
          { permissionId: 'P004', permissionName: 'Delete', description: 'Allows the role to delete Project, Module, Task, & Team' },
          { permissionId: 'P005', permissionName: 'Admin', description: 'Allows the role permissions' },
        ]); 
  
        await RolePermission.insertMany([
          { roleId: 'R001', permissionId: ['P001', 'P002', 'P003'] },
          { roleId: 'R002', permissionId: ['P001', 'P002', 'P003', 'P004'] },
          { roleId: 'R002-A', permissionId: ['P001', 'P002', 'P003', 'P004'] },
          { roleId: 'R002-B', permissionId: ['P001', 'P002', 'P003', 'P004'] },
          { roleId: 'R003', permissionId: ['P002'] },
          { roleId: 'R003-A', permissionId: ['P002'] },
          { roleId: 'R003-B', permissionId: ['P002'] },
          { roleId: 'R001', permissionId: ['P005'] } 
        ]);

        await PermissionsExtra.insertMany([
          { count: '3',  permission: 'modules', description:'Allows a module can pick by only 3 teams' },
          { count: '1',  permission: 'team',description:'Allows a team can pick by only 1 Module' },
          {count:'1',permission:'user',description:'Allows a user be added into only 1 Team '}
        ]); 
      } 
  
      console.log('Collections and initial data created successfully.');
    } catch (error) {
      console.error('Error creating collections and initial data:', error);
      throw error;
    }
  }
  
  router.post('/signup', async (req, res) => {
    try {
        const { username, email, password, roleName,GitlabID,OrgID,teamId} = req.body;  

        // Check if email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already exists' });
        }

        // Find roleID based on roleName
        const role = await Role.findOne({ roleName });
        if (!role) {
            return res.status(400).json({ error: 'Invalid role name' });
        }

        // Count existing users
        const userCount = await User.countDocuments();

        // Generate userID based on userCount
        const userID = `U${String(userCount + 1).padStart(3, '0')}`;

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await User.create({
            userId:userID,
            username,
            email,
            password: hashedPassword,
            roleId: role.roleId,
            gitlabId :GitlabID,
            orgId: OrgID,
            teamId
        });

        res.json({ userID: user.userId, username: user.username, email: user.email, roleID: user.roleId });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/org-signup', async (req, res) => {
    try {
        const {
            OrgName,
            email,
            password,
            projects,
            WebsiteUrl,
            GitlabID,
            ImgUrl,
            Address1,
            Address2,
            AreaName,
            City,
            state,
            country,
            pincode,
            access,
            roleName,
            IsNgo // Make sure this field is present in your request body
        } = req.body;

        // Check if email already exists in Organization collection
        const existingOrganization = await Organization.findOne({ email });
        if (existingOrganization) {
            return res.status(400).json({ error: 'Email already exists' });
        }

        // Find roleID based on roleName
        const role = await Role.findOne({ roleName });
        if (!role) {
            return res.status(400).json({ error: 'Invalid role name' });
        }

        // Count existing organizations
        const orgCount = await Organization.countDocuments();

        // Generate organizationID based on orgCount
        const orgID = `ORG${String(orgCount + 1).padStart(3, '0')}`;

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create organization
        const organization = await Organization.create({
            orgId:orgID,
            orgName:OrgName,
            email:email,
            password: hashedPassword,
            projects:projects,
            websiteUrl:WebsiteUrl,
            roleId: role.roleId, // Corrected field name
            gitlabId :GitlabID,
            imgUrl:ImgUrl,
           address1: Address1,
           address2: Address2,
           areaName: AreaName,
          city:  City,
           state,
            country:country,
           pincode:  pincode,
            access,
           isNgo: IsNgo
        });
        const userCount = await User.countDocuments();
        // Store organization details in User collection
        const userOrg = await User.create({
            userId: `U${String(userCount + 1).padStart(3, '0')}`, // Generate userID based on orgCount
            username: OrgName,
            email,
            password: hashedPassword,
            roleId: role.roleId,
            orgId: orgID,
            gitlabId:GitlabID
        });

        res.json({
            orgID: organization.orgId,
            OrgName: organization.orgName,
            email: organization.email,
            roleID: organization.roleId,
            gitlabId:organization.gitlabId // Corrected field name
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

   
router.post('/login', async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Try to find the user in the User collection
      const user = await User.findOne({ email });
      if (user) {
        // Compare passwords
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (isPasswordValid) {
          // Generate JWT token for user
          const token = jwt.sign({ id: user._id, userType: 'user' }, secretKey, { expiresIn: '1h' });
          return res.json({ token });
        }
      }
  
      // If no user is found, return an error
      res.status(401).json({ error: 'Invalid email or password' });
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });
  
  router.get('/get-permissions', async (req, res) => {
    try {
      // Check if the Authorization header is present
      if (!req.headers.authorization) {
        return res.status(401).json({ error: 'Authorization header is missing' });
      }
  
      // Extract the token from the request headers
      const token = req.headers.authorization.split(' ')[1];
  
      // Verify the token
      const decodedToken = jwt.verify(token, secretKey);
  
      // Check the user type (expecting 'user')
      const { userType, id } = decodedToken;
  
      if (userType !== 'user') {
        return res.status(401).json({ error: 'Invalid user type' });
      }
  
      // Find the user in the User collection
      const user = await User.findById(id);
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Fetch the role ID from the user
      const roleID = user.roleId;
  
      // Find permissions based on the role ID
      const rolePermissions = await RolePermission.findOne({ roleId: roleID });
  
      if (!rolePermissions) {
        return res.status(404).json({ error: 'Permissions not found for the given role ID' });
      }
  
      res.json({ userId: user.userId, permissions: rolePermissions.permissionId ,orgId:user.orgId});
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });
  router.get('/get-extra-permissions', async (req, res) => {
    try {
        // Fetch all documents from PermissionsExtra collection
        const allPermissions = await PermissionsExtra.find();

        // Return the list of all permissions
        res.json({ permissions: allPermissions });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

  createCollections()
module.exports = router;
