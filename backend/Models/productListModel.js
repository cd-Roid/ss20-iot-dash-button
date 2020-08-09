const Mongoose = require('mongoose');

const ProductListModel = new Mongoose.Schema(
    {
        name: {
			type: String,
			required: true
		},
		quantity: {
			type: Number,
			required: true
		},
		step: {
			type: Number,
			required: true
		},
    }
)

module.exports = Mongoose.model('Product', ProductListModel);