const { supabase } = require('../config/database.js');

const addOrderItems = async (req, res) => {
  try {
    const { orderItems, shippingAddress, paymentMethod, itemsPrice, taxPrice, shippingPrice, totalPrice } = req.body;
    if (orderItems && orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

    const { data: order, error } = await supabase.from('orders').insert([{
      user_id: req.user._id || req.user.id,
      shipping_street: shippingAddress.street,
      shipping_city: shippingAddress.city,
      shipping_state: shippingAddress.state,
      shipping_zip_code: shippingAddress.zipCode,
      shipping_country: shippingAddress.country || 'India',
      payment_method: paymentMethod,
      items_price: itemsPrice,
      tax_price: taxPrice,
      shipping_price: shippingPrice,
      total_price: totalPrice
    }]).select().single();

    if (error) throw error;

    const itemsToInsert = orderItems.map(item => ({
      order_id: order.id,
      product_id: item.product,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      unit: item.unit,
      image: item.image
    }));

    const { error: itemsError } = await supabase.from('order_items').insert(itemsToInsert);
    if (itemsError) throw itemsError;

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

module.exports = { addOrderItems, getOrderById, getMyOrders, getOrders };
