const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const codeSchema = new Schema({
    userId: {
        type: String,
        required: true,
        unique: true
    },
    key: {
        type: String,
        required: true,
    },
    expireIn: {
        type: Date,
        default: Date.now,
        index: {
            expires: 7200
        }
    }
});

module.exports = mongoose.model("code", codeSchema);