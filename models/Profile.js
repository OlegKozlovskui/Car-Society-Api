const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const profileSchema = new Schema({
	user: {
		type: Schema.Types.ObjectId,
		ref: 'users',
	},
	avatar: {
		type: String,
	},
	location: {
		type: String,
	},
	bio: {
		type: String
	},
	favoriteCars: {
		type: [String]
	},
});

module.exports = mongoose.model('profile', profileSchema);