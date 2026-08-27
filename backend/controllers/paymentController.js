const Payment = require('../models/Payment');
const Order = require('../models/Order');

const createPayment = async (req, res) => {
  try {
    const { orderId, paymentMethod, amount } = req.body;
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    const payment = await Payment.create({
      order: orderId,
      user: req.user._id,
      paymentMethod,
      amount,
      paymentStatus: 'completed',
      transactionId: 'TXN' + Date.now()
    });

    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: payment.transactionId,
      status: 'completed'
    };
    await order.save();

    res.status(201).json(payment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ user: req.user._id }).populate('order');
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createPayment, getPayments };