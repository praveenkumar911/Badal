const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

// Define the schema for the issues model
const issueSchema = new mongoose.Schema(
    {
        workspaceId: String,
        moduleId: String,
        taskId: String,
        taskworkId: String,
        projectId: String,
        taskDateCreated: Date,
        taskCreatedBy: String,
        taskName: String,
        taskTime: String,
        assigned: String,
        completed: String,
        unassigned: String,
        taskDescription: String,
        gitlabId: String,
        gitWebUrl: String,
        assignedto: String,
        review: {
            type: [
                {
                    status: {
                        type: String,
                        enum: ["In Progress", "Completed"],
                    },
                    date: Date,
                },
            ],
            default: [],
        },
    },
    {
        collection: "issues", // Change the collection name to "tasks"
    }
);

// Register the schema and export the model
module.exports = mongoose.model("issues", issueSchema);
