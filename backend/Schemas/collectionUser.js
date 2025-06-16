const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({ 
  roleId: String,
  roleName: String,
});

const permissionSchema = new mongoose.Schema({
  permissionId: String,
  permissionName: String,
  description: String,
});

const rolePermissionSchema = new mongoose.Schema({
  roleId: String, 
  permissionId: [String],
});

const userSchema = new mongoose.Schema({
  userId: String,
  username: String,
  email: String,
  password: String,
  roleId: String,
  gitlabId: String,
  orgId: String,
  teamId: Array,
  phone:String,
  address:String,
});
const permissionsExtraSchema = new mongoose.Schema({
  count: String, 
  permission: String,
  description:String,
});
const Role = mongoose.model('Role', roleSchema);
const Permission = mongoose.model('Permission', permissionSchema);
const RolePermission = mongoose.model('RolePermission', rolePermissionSchema);
const User = mongoose.model('User', userSchema);
const PermissionsExtra=mongoose.model('PermissionsExtra',permissionsExtraSchema)

module.exports = { Role, Permission, RolePermission, User,PermissionsExtra };
