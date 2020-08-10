const Mongoose = require('mongoose');

const ActionModel = new Mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        }

    }
)

module.exports = Mongoose.model('Action', ActionModel);