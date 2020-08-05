const Mongoose = require('mongoose');

const ProductModel = new Mongoose.Schema(
	{
		name: {
			type: String,
			required: true
		},
		quantity: {
			type: Number,
			required: true
		},
		steps: {
			type: Number,
			required: true
		}
	}
)

module.exports = Mongoose.model('Product', ProductModel);