const express = require('express');
const router = express.Router();
const { getProducts, getProductById, createProduct, updateProduct, deleteProduct, getFarmerProducts } = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const { productValidator } = require('../utils/validators');
const upload = require('../middleware/uploadMiddleware');

router.route('/')
  .get(getProducts)
  .post(protect, authorize('farmer', 'admin'), upload.array('images', 5), productValidator, createProduct);

router.get('/my-products', protect, authorize('farmer'), getFarmerProducts);

router.route('/:id')
  .get(getProductById)
  .put(protect, upload.array('images', 5), updateProduct)
  .delete(protect, deleteProduct);

module.exports = router;