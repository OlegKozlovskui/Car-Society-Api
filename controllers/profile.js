const Profile = require('../models/Profile');
const errorHandler = require('../utils/errorHandler');

exports.getProfile = async (req, res) => {
	try {
		const profile = await Profile.findOne({ user: req.user.id }).populate('user', ['firstName', 'lastName']);
		if (profile) {
			res.status(200).json(profile);
		} else {
			await createProfile(req.user.id);
			const newProfile = await Profile.findOne({ user: req.user.id }).populate('user', ['firstName', 'lastName']);
			res.status(200).json(newProfile);
		}
	} catch (e) {
		errorHandler(res, e);
	}
};

createProfile = (userId) => {
	const newProfile = new Profile({
		user: userId
	});
	return newProfile.save();
};