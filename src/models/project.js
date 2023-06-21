const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const projectSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    skill: {
      type: ObjectId,
      required: true,
      trim: true,
    },
    link: {
      type: String,
      trim: true,
    },
    thumbnail: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);
