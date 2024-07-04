const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const workspaceSchema = new mongoose.Schema(
    {
       // projectObjectId: { type: ObjectId, ref: "projects" },
        workspaceId:String,
        moduleId:String,
        projectId: String,
        moduleCreatedBy: String,
        assignedTeam: String,
        moduleDateCreated: Date,
        workspaceName: String,
        workspaceDescription: String, 
        moduleDateStart: Date,
        moduleDateEnd: Date,
        skillsRequired: Array, 
        totalDevTimeRequired: Number,
        moduleComplexity: String,
        forkedGitlabId: String,  // Updated field name
        forkedGitlabUrl: String, // Updated field name
        gitModuleName: String,
        numberOfTask: Number,
        moduleField: String,
        assigned: String,
        unassigned: String,
        completed: String,
        taskIds: Array,
        requirementsDocument: String,
        uiMocks: String,
        apiDocument: String,
        dbDocument: String,
      },      
    {
        collection: "workspaces", 
    }
);

module.exports = mongoose.model("workspaces", workspaceSchema);

