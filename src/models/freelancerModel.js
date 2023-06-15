const mongoose = require("mongoose");

const freelancerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    username: {
        type: String,
        required: true,
        trim: true
    },
    phone: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        trim: true
    },
    address: {
        type: Object,
        trim: true
    },
    accountDetails: {
        type: Object,
        trim: true
    },
    skills: {
        type: Array,
        trim: true
    },
    role: {
        type: Array,
        trim: true
    },
    priority: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("freelancer", freelancerSchema);