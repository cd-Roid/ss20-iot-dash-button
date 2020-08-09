const Mongoose = require('mongoose');

const ProductListModel = new Mongoose.Schema(
    {
        name: {
			type: String,
			required: true
		},
		quantity: {
			type: String,
			required: true
		},
		step: {
			type: String,
			required: true
		},
    }
)

module.exports = Mongoose.model('Product', ProductListModel);