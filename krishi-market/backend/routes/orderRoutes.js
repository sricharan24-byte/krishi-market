const express = require('express');
const router = express.Router();
const { createOrder, getOrders, getOrderById, updateOrderToPaid, updateOrderToDelivered, getAllOrders } = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.route('/')
  .post(protect, createOrder)
  .get(protect, getOrders);

router.get('/all', protect, authorize('admin'), getAllOrders);

router.route('/:id')
  .get(protect, getOrderById);

router.put('/:id/pay', protect, updateOrderToPaid);
router.put('/:id/deliver', protect, authorize('admin'), updateOrderToDelivered);

module.exports = router;