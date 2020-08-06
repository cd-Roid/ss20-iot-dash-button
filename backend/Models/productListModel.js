const Mongoose = require('mongoose');

const ProductListModel = new Mongoose.Schema(
    {
        list: {
            type: Object,
            required: true
        }
    }
)

module.exports = Mongoose.model('Product', ProductListModel);