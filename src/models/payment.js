const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const paymentSchema = new Schema({
    workId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "work",
    },
    orderId: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    currency: {
        type: String,
        required: true,
    },
    paymentMethod: {
        type: String,
        required: true,
    },
    paymentStatus: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
})

const Payment = mongoose.model('payment', paymentSchema);
module.exports = Payment;