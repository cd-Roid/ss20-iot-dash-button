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
		eID: {
			type: Number,
			required: true
		},
		time: {
			type: Date,
			required: false
		}
	}
)

module.exports = Mongoose.model('Order', ProductModel);

