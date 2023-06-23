const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const adminSchema = new Schema({
    name: {
        type: String,
        trim: true,
        minlength: 3,
        required: "Name is required",
    },
    username: {
        type: String,
        trim: true,
        unique: true,
        minlength: 3,
        required: "Username is required",
    },
    password: {
        type: String,
        trim: true,
    },
    avatar: {
        type: String,
        trim: true,
    },
},
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("admin", adminSchema);
