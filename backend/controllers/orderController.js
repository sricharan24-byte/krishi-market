const { supabase } = require('../config/database.js');

const addOrderItems = async (req, res) => {
  try {
    const { orderItems, shippingAddress, paymentMethod, itemsPrice, taxPrice, shippingPrice, totalPrice } = req.body;
    if (orderItems && orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

    const street = shippingAddress ? shippingAddress.street || '' : '';
    const city = shippingAddress ? shippingAddress.city || '' : '';
    const state = shippingAddress ? shippingAddress.state || '' : '';
    const zipCode = shippingAddress ? shippingAddress.zipCode || '' : '';
    const country = shippingAddress ? shippingAddress.country || 'India' : 'India';

    const { data: order, error } = await supabase.from('orders').insert([{
      user_id: req.user._id || req.user.id,
      shipping_street: street,
      shipping_city: city,
      shipping_state: state,
      shipping_zip_code: zipCode,
      shipping_country: country,
      payment_method: paymentMethod,
      items_price: itemsPrice,
      tax_price: taxPrice,
      shipping_price: shippingPrice,
      total_price: totalPrice,
      status: 'pending'
    }]).select().single();

    if (error) throw error;

    if (orderItems && orderItems.length > 0) {
      const itemsToInsert = orderItems.map(item => ({
        order_id: order.id,
        product_id: item.product || item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        unit: item.unit || 'kg',
        image: item.image || ''
      }));

      const { error: itemsError } = await supabase.from('order_items').insert(itemsToInsert);
      if (itemsError) throw itemsError;
    }

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getOrderById = async (req, res) => {
  try {
    const { data: order, error } = await supabase.from('orders').select('*, user:users(full_name, email), order_items(*)').eq('id', req.params.id).maybeSingle();
    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const { data: orders, error } = await supabase.from('orders').select('*, order_items(*)').eq('user_id', req.user._id || req.user.id);
    if (error) throw error;
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getOrders = async (req, res) => {
  try {
    const { data: orders, error } = await supabase.from('orders').select('*, user:users(id, full_name)');
    if (error) throw error;
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateOrderToPaid = async (req, res) => {
  try {
    const { data: order, error } = await supabase.from('orders').update({ is_paid: true, paid_at: new Date().toISOString(), status: 'processing' }).eq('id', req.params.id).select().single();
    if (error) throw error;
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateOrderToDelivered = async (req, res) => {
  try {
    const { data: order, error } = await supabase.from('orders').update({ is_delivered: true, delivered_at: new Date().toISOString(), status: 'delivered' }).eq('id', req.params.id).select().single();
    if (error) throw error;
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addOrderItems,
  createOrder: addOrderItems,
  getOrderById,
  getMyOrders,
  getOrders,
  getAllOrders: getOrders,
  updateOrderToPaid,
  updateOrderToDelivered
};
