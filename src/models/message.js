const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = new Schema({
    consumerId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "consumer",
    },
    freelancerId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "freelancer",
    },
    conversations: [
        {
            senderId: {
                type: Schema.Types.ObjectId,
                required: true,
            },
            content: {
                type: Schema.Types.Mixed,
                required: true,
            },
            contentType: {
                type: String,
                enum: ['text', 'image', 'file', 'video', 'audio', 'location', 'contact', 'sticker', 'gif', 'url', 'payment'],
                default: 'text',
                required: true,
            },
            read: {
                type: Boolean,
                default: false,
            },
            _id: false,
        },
    ],
}, {
    timestamps: true,
})

module.exports = mongoose.model('message', messageSchema);