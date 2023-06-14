const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const consumerSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 3
    },
    username: {
        type: String,
        required: true,
        trim: true,
        minlength: 3
    },
    email: {
        type: String,
        required: true,
        trim: true,
        minlength: 3
    },
    phone: {
        type: String,
        required: true,
        trim: true,
        minlength: 3
    },
    password: {
        type: String,
        trim: true,
        minlength: 3
    },
    address: {
        type: Object,
        trim: true,
    },
    paymentDetails: {
        type: Object,
        trim: true,
    },
}, {
    timestamps: true,
});