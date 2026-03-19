const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const tasksSchema = new mongoose.Schema(
    {
        workspaceId: String,
        moduleId: String,
        taskId: String,
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
        collection: "tasks", // Change the collection name to "tasks"
    }
);

mongoose.model("tasks", tasksSchema);

module.exports = tasksSchema;
