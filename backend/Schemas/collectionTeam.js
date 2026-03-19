const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const teamsSchema = new mongoose.Schema(
    {
        teamName: String,
        teamId:String,
        userIds: Array,
        orgId: String,
        teamGitId: String,
        assignedModules: Array,
        teamSkills: Array, 
        createdDateTime: Date,
        updateDateTime: Date,
        availabilityTime: String,
        webUrl: String
      },
    { 
        collection: "teams",
    }
);

mongoose.model("teams", teamsSchema);

module.exports = teamsSchema;
