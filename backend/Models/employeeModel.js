const Mongoose = require('mongoose');

const EmployeeModel = new Mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        eID: {
            type: Number,
            required: true
        },
        setupID: {
            type: String,
            required: true
        }
    }
)

module.exports = Mongoose.model('Employee', EmployeeModel);
