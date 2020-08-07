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

ProductModel.statics.addName = function(orders, user) {
	return orders.map(function(order) {
		let name = user.find(elem => elem.eID == order.eID);
			return {
					_id: order._id,
					name: order.name,
					quantity: order.quantity,
					eID: order.eID,
					time: order.time,
					__v: order.__v,
					employee: name? name.name : order.eID
			}
	})
}

module.exports = Mongoose.model('Order', ProductModel);

