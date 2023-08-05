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
      index: true,
      unique: true,
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Invalid email",
      ],
    },
    googleId: {
      type: String,
      trim: true,
      index: true,
      unique: true,
      sparse: true,
    },
    phone: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
      match: [/^((\+91)?|91?|0)?[789][0-9]{9}/, "Invalid phone number"],
    },
    password: {
      type: String,
      trim: true,
    },
    address: {
      country: {
        type: String,
        trim: true,
      },
      state: {
        type: String,
        trim: true,
      },
      city: {
        type: String,
        trim: true,
      },
      pincode: {
        type: Number,
        trim: true,
      },
      coordinates: {
        longitude: {
          type: Number,
          trim: true,
        },
        latitude: {
          type: Number,
          trim: true,
        },
      },
    },
    paymentDetails: {
      type: Object,
      trim: true,
    },
    avatar: {
      type: String,
      trim: true,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    phoneVerified: {
      type: Boolean,
      default: false,
    },
    activated: {
      type: Boolean,
      default: true,
    },
    banned: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Consumer = mongoose.model("consumer", consumerSchema);

module.exports = Consumer;
