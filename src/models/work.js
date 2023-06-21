const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const workSchema = new Schema(
  {
    freelancerId: {
      type: ObjectId,
      required: true,
      trim: true,
    },
    consumerId: {
      type: ObjectId,
      required: true,
      trim: true,
    },
    skillId: {
      type: ObjectId,
      required: true,
      trim: true,
    },
    price: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    deadline: {
        type: Date,
        trim: true,
    },
    status: {
      type: String,
      required: true,
      trim: true,
      default: "requested",
    },
  },
  {
    timestamps: true,
  }
);
