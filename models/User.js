const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

const isUserFieldRequired = require('../utils/helpers').isUserFieldRequired;

const userSchema = new Schema({
	method: {
		type: String,
		enum: ['local', 'google', 'facebook'],
		required: true,
	},
	google: {
		id: {
			type: String
		},
	},
	facebook: {
		id: {
			type: String
		},
	},
  firstName: {
    type: String,
    required: isUserFieldRequired
  },
  lastName: {
    type: String,
    required: isUserFieldRequired
  },
  email: {
    type: String,
	  required: isUserFieldRequired
  },
  password: {
    type: String,
	  required: isUserFieldRequired
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

userSchema.pre('save', async function(next) {
	try {
		if (this.method !== 'local') {
			next();
		}
		
		const salt = await bcrypt.genSalt(10);
		const passwordHash = await bcrypt.hash(this.password, salt);
		
		this.password = passwordHash;
		next();
	} catch(error) {
		next(error);
	}
});

userSchema.methods.isValidPassword = async function(newPassword) {
	try {
		console.log(this);
		return await bcrypt.compare(newPassword, this.password);
	} catch(error) {
		throw new Error(error);
	}
};

module.exports = mongoose.model('user', userSchema);