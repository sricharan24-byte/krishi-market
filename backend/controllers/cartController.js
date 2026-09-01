const { supabase } = require('../config/database.js');

const getCart = async (req, res) => {
  try {
    const { data: cart, error } = await supabase.from('carts').select('*, cart_items(*, product:products(*))').eq('user_id', req.user._id || req.user.id).maybeSingle();
    if (error) throw error;
    res.json(cart || { items: [] });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    let { data: cart } = await supabase.from('carts').select('*').eq('user_id', req.user._id || req.user.id).maybeSingle();
    
    if (!cart) {
      const { data: newCart, error } = await supabase.from('carts').insert([{ user_id: req.user._id || req.user.id }]).select().single();
      if (error) throw error;
      cart = newCart;
    }

    const { data: existingItem } = await supabase.from('cart_items').select('*').eq('cart_id', cart.id).eq('product_id', productId).maybeSingle();
    
    if (existingItem) {
      await supabase.from('cart_items').update({ quantity: existingItem.quantity + quantity }).eq('id', existingItem.id);
    } else {
      await supabase.from('cart_items').insert([{ cart_id: cart.id, product_id: productId, quantity }]);
    }
    
    res.json({ message: 'Added to cart' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    const productId = req.params.id;
    const { data: cart } = await supabase.from('carts').select('*').eq('user_id', req.user._id || req.user.id).maybeSingle();
    if (cart) {
      await supabase.from('cart_items').update({ quantity: Number(quantity) }).eq('cart_id', cart.id).eq('product_id', productId);
    }
    res.json({ message: 'Cart item updated' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const { data: cart } = await supabase.from('carts').select('*').eq('user_id', req.user._id || req.user.id).maybeSingle();
    if (cart) {
      await supabase.from('cart_items').delete().eq('cart_id', cart.id).eq('product_id', productId);
    }
    res.json({ message: 'Removed from cart' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const clearCart = async (req, res) => {
  try {
    const { data: cart } = await supabase.from('carts').select('*').eq('user_id', req.user._id || req.user.id).maybeSingle();
    if (cart) {
      await supabase.from('cart_items').delete().eq('cart_id', cart.id);
    }
    res.json({ message: 'Cart cleared' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getCart, addToCart, updateCartItem, removeFromCart, clearCart };
