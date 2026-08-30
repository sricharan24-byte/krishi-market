const { supabase } = require('../config/database.js');

const processPayment = async (req, res) => {
  try {
    const { orderId, paymentMethod, amount, transactionId, paymentDetails } = req.body;
    
    const { data: payment, error } = await supabase.from('payments').insert([{
      order_id: orderId,
      user_id: req.user._id || req.user.id,
      payment_method: paymentMethod,
      amount,
      transaction_id: transactionId,
      payment_status: 'completed',
      payment_details: paymentDetails
    }]).select().single();
    if (error) throw error;

    await supabase.from('orders').update({ is_paid: true, paid_at: new Date().toISOString(), status: 'processing' }).eq('id', orderId);

    res.status(201).json(payment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getOrderPayment = async (req, res) => {
  try {
    const { data: payment, error } = await supabase.from('payments').select('*').eq('order_id', req.params.orderId).maybeSingle();
    if (payment) {
      res.json(payment);
    } else {
      res.status(404).json({ message: 'Payment not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { processPayment, getOrderPayment };
