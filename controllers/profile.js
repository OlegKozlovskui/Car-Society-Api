const Profile = require('../models/Profile');
const errorHandler = require('../utils/errorHandler');

exports.getProfile = async (req, res) => {
	try {
		const profile = await Profile.findOne({ user: req.user.id });
		res.status(200).json(profile);
	} catch (e) {
		errorHandler(res, e);
	}
};