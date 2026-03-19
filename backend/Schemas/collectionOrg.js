const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const organizationSchema = new mongoose.Schema(
    {
        orgName: String, 
        orgId: String,
        email: { type: String, unique: true, required: true },
        password: { type: String, required: true },
        projects: Array,
        websiteUrl: String,
        phone:Number, 
        description:String,
        size:String,
        roleId: String, // This can be captured by NGO yes or NO in checkbox frontend 
        gitlabId: String,
        imgUrl: String, 
        address1: String,
        address2: String, 
        areaName: String,
        city: String,
        state: String,
        country: String,
        pincode: String,
        access: String,
        isNgo: String,
        latitude: String, 
        longitude: String,
        projectsPicked:Array,
        gitlabUrl:String,
      }, 
    {
        collection: "organizations",
    }
);

module.exports = mongoose.model("organizations", organizationSchema);
