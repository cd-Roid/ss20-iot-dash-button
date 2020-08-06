const Mongoose = require('mongoose');

const setupIDModel = new Mongoose.Schema(
    {
        SetupId: {
            type: Number,
            required: true
        }
    }
)

module.exports = Mongoose.model('Setup', setupIDModel);