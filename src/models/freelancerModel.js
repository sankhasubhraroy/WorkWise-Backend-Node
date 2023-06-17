const mongoose = require("mongoose");

const freelancerSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        minlength: 3,
        required: 'Name is required'
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: 'Email address is required'
    },
    username: {
        type: String,
        trim: true,
        unique: true,
        minlength: 3,
        required: 'Username is required'
    },
    phone: {
        type: String,
        trim: true,
        unique: true,
        required: 'Phone number is required'
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
    },
    avatar: {
        type: String,
        trim: true
    },
    emailVerified: {
        type: Boolean,
        default: false
    },
    phoneVerified: {
        type: Boolean,
        default: false
    },
    authorized: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("freelancer", freelancerSchema);