const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const workSchema = new Schema(
    {
        freelancerId: {
            type: Schema.Types.ObjectId,
            required: true,
            trim: true,
            ref: "Freelancer",
        },
        consumerId: {
            type: Schema.Types.ObjectId,
            required: true,
            trim: true,
            ref: "Consumer"
        },
        skillId: {
            type: Schema.Types.ObjectId,
            required: true,
            trim: true,
            ref: "Skill"
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
            required: true,
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

const Work = mongoose.model("Work", workSchema);
module.exports = Work;
