module.exports.getAllCars = (req, res) => {
  console.log(req.user);
  res.status(200).json([
    { name: 'Lamborghini' },
    { name: 'Bentley' },
    { name: 'Bugatti' },
    { name: 'Ferrari' },
  ])
};
