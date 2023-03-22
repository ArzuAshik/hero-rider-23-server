const mongoose = require("mongoose");
const { User } = require("./User");

// schema design
const riderSchema = mongoose.Schema({
    brand:{
        type: String,
        required: [true, "Please Provide your vehicle brand name."],
    },
    model:{
        type: String,
        required: [true, "Please Provide your vehicle model."],
    },
    vlnumber:{
        type: String,
        required: [true, "Please Provide your vehicle licence number."],
    },
    drivingLicence:{
        type: String,
        required: [true, "Please Provide your licence number."],
    },
    area: {
        type: String,
        required: [true, "Please Provide your area."],
        trim: true,
        minLength: [2, "Too short name."],
        maxLength: [150, "Name is too large."]
    },


}, {
    timestamps: true
});

// Model
exports.Rider = User.discriminator("Rider", riderSchema);