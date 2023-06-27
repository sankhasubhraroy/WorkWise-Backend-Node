const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const skillSchema = new Schema(
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
        basePrice: {
            type: Number,
            required: true,
            trim: true,
            min: 0,
        },
        image: {
            type: String,
            trim: true,
        },
        icon: {
            type: String,
            trim: true,
        },
        popularity: {
            type: Number,
            trim: true,
            default: 0,
            min: 0,
        },
    },
    {
        timestamps: true,
    }
);

const Skill = mongoose.model('Skill', skillSchema);

module.exports = Skill;