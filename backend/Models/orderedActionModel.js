const Mongoose = require('mongoose');

const ActionOrder = new Mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        time: {
            type: Date,
            required: true
        },
        eID: {
            type: Number,
            required: false
        }
    }
)

module.exports = Mongoose.model('ActionOrder', ActionOrder);