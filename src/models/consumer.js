const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const consumerSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    username: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      minlength: 3,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      match: [/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'Invalid email'],
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      match: [/^((\+91)?|91?|0)?[789][0-9]{9}/, 'Invalid phone number'],
    },
    password: {
      type: String,
      trim: true,
    },
    address: {
      type: Object,
      trim: true,
    },
    paymentDetails: {
      type: Object,
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

const Consumer = mongoose.model("Consumer", consumerSchema);

module.exports = Consumer;
