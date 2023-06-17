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
      match: [/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'Please enter a valid email'],
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      minlength: 3,
      match: [/^((\+91)?|91?|0)?[789][0-9]{9}/, 'Please enter a valid phone number'],
    },
    password: {
      type: String,
      trim: true,
      minlength: 3,
      match: [/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, 'Password must contain at least 8 characters, one letter and one number']
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
