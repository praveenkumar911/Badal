// const mongoose = require("mongoose");
// const { ObjectId } = mongoose.Schema.Types;

// const modulesSchema = new mongoose.Schema(
//     {
//         // projectObjectId: { type: ObjectId, ref: "projects" }, // Assuming "projects" is the new collection name
//         projectId: String,
//         moduleId:String,
//         moduleCreatedBy: String,
//         moduleDateCreated: Date,
//         moduleName: String,
//         moduleDescription: String,
//         moduleDateStart: Date,
//         moduleDateEnd: Date,
//         skillsRequired: Array,
//         totalDevTimeRequired: Number,
//         moduleComplexity: String, 
//         gitlabId: String,
//         gitWebUrl: String, 
//         gitModuleName: String,
//         numberOfTask: Number,
//         moduleField: String,
//         assigned: String,
//         unassigned: String, 
//         completed: String,
//         taskIds: Array,
//         requirementsDocument: String,
//         uiMocks: String,
//         apiDocument: String,
//         dbDocument: String,
//         teamsAssigned: Array,
//         orgId: String,
//         workspaceIds:Array,
//       },
//     {
//         collection: "modules", // Change the collection name to "modules"
//     }
// );

// mongoose.model("modules", modulesSchema);

// module.exports = modulesSchema;

const mongoose = require("mongoose");

// Define a sub-schema for workspace and team mapping
const workspaceTeamMappingSchema = new mongoose.Schema({
    workspaceId: { type: String, required: true }, // Assuming workspaceId is a string
    teamId: { type: String, required: true }       // Assuming teamId is a string
});

const modulesSchema = new mongoose.Schema(
    {
        projectId: String,
        moduleId: String,
        moduleCreatedBy: String,
        moduleDateCreated: Date,
        moduleName: String,
        moduleDescription: String,
        moduleDateStart: Date,
        moduleDateEnd: Date,
        skillsRequired: Array,
        totalDevTimeRequired: Number,
        moduleComplexity: String,
        gitlabId: String,
        gitWebUrl: String,
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
        teamsAssigned: Array,
        orgId: String,
        workspaceIds: [workspaceTeamMappingSchema], // Define workspaceIds as an array of objects
    },
    {
        collection: "modules",
    }
);

mongoose.model("modules", modulesSchema);

module.exports = modulesSchema;

