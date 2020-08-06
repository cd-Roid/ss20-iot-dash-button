const Mongoose = require('mongoose');

const ModeModel = new Mongoose.Schema(
    {
        mode: {
            type: Number,
            required: true
        }
    }
)

module.exports = Mongoose.model("Mode", ModeModel);