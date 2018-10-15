const router = require('express-promise-router')();

const controller = require('../controllers/brand');
const upload = require('../middleware/upload');

router.get('/', controller.getAllBrands);
router.post('/', upload.single('imageSrc'), controller.createBrand);

module.exports = router;