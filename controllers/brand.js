const Brand = require('../models/Brand');

exports.getAllBrands = async (req, res) => {
	const brands = await Brand.find();
	
	res.status(200).json(brands);
};

exports.createBrand = async (req, res) => {
	const newBrand = new Brand({
		name: req.body.name,
    imageSrc: req.file.path,
	});
	
	await newBrand.save();
	res.status(201).json({
    ...newBrand,
    imageSrc: `${req.protocol}://${req.host}:5000/${newBrand.imageSrc}`
  });
};