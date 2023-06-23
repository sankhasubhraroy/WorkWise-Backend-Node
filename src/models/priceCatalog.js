const mongoose = new require("mongoose");
const Schema = mongoose.Schema;

const priceCatalogSchema = new Schema(
  {
    freelancerId: {
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
      type: Number,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    images: {
      type: Array,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);
