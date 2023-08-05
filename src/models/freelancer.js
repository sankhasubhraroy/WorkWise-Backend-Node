const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const freelancerSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      minlength: 3,
      required: "Name is required",
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      required: "Email address is required",
    },
    username: {
      type: String,
      trim: true,
      unique: true,
      minlength: 3,
      required: "Username is required",
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
      index: true,
      unique: true,
      sparse: true,
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
      street: {
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
    accountDetails: {
      accountHolderName: {
        type: String,
        trim: true,
      },
      accountNumber: {
        type: String,
        trim: true,
      },
      ifscCode: {
        type: String,
        trim: true,
      },
      bankName: {
        type: String,
        trim: true,
      },
      branchName: {
        type: String,
        trim: true,
      },
    },
    skills: [
      {
        type: Schema.Types.ObjectId,
        trim: true,
        ref: "Skill",
      },
    ],
    experties: [
      {
        type: String,
        trim: true,
      },
    ],
    priority: {
      type: Number,
      default: 0,
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
    approved: {
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
    }
  },
  {
    timestamps: true,
  }
);

freelancerSchema.index({ "address.location": "2dsphere" });

module.exports = mongoose.model("freelancer", freelancerSchema);
