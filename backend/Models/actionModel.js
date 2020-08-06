const Mongoose = require('mongoose');

const ActionModel = new Mongoose.Schema(
    {
        list: {
            type: Object,
            required: true
        }
    }
)

module.exports = Mongoose.model('Action', ActionModel);