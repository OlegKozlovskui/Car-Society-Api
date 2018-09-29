const User = require('../models/User');
const errorHandler = require('../utils/errorHandler');

exports.getUser = async (req, res) => {
	try {
		const user = await User.findOne({ email: req.user.email });
		
		res.status(200).json(user);
	} catch (e) {
		errorHandler(res, e);
	}
};
