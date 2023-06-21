const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const otpSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        unique: true
    },
    key: {
        type: String,
        required: true
    },
    expireIn: {
        type: Date,
        default: Date.now,
        index: {
            expires: 600
        }
    }
});

module.exports = mongoose.model("otp", otpSchema);