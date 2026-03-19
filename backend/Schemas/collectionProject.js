const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const projectsSchema = new mongoose.Schema(
    {
        // projectCreatedBy: { type: ObjectId, ref: "collectionUser" },
        projectCreatedBy: String,
        projectDateCreated: Date,
        projectId:String,
        projectName: String,
        projectField: String,
        projectImage:String,
        projectDescription: String, 
        projectOwner: String, 
        projectManager: String, 
        projectDateStart: Date,
        projectDateEnd: Date,
        skillsRequired: Array,
        totalDevTimeRequired: Number,
        gitlabId: String,
        gitWebUrl: String,
        gitProjectName: String,
        moduleIds: Array,
        gitGroupId: String,
        assignedTo: String,
        latitude: String, 
        longitude: String,
      },
    {
        collection: "projects", 
    }
);

mongoose.model("projects", projectsSchema);

module.exports = projectsSchema;
