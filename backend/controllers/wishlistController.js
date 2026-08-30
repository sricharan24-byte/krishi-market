const { supabase } = require('../config/database.js');

const getWishlist = async (req, res) => {
  try {
    const { data: wishlist, error } = await supabase.from('wishlists').select('*, wishlist_items(product:products(*))').eq('user_id', req.user._id || req.user.id).maybeSingle();
    if (error) throw error;
    res.json(wishlist || { products: [] });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    let { data: wishlist } = await supabase.from('wishlists').select('*').eq('user_id', req.user._id || req.user.id).maybeSingle();
    
    if (!wishlist) {
      const { data: newWishlist, error } = await supabase.from('wishlists').insert([{ user_id: req.user._id || req.user.id }]).select().single();
      if (error) throw error;
      wishlist = newWishlist;
    }

    await supabase.from('wishlist_items').upsert({ wishlist_id: wishlist.id, product_id: productId });
    res.json({ message: 'Added to wishlist' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;
    const { data: wishlist } = await supabase.from('wishlists').select('*').eq('user_id', req.user._id || req.user.id).maybeSingle();
    if (wishlist) {
      await supabase.from('wishlist_items').delete().eq('wishlist_id', wishlist.id).eq('product_id', productId);
    }
    res.json({ message: 'Removed from wishlist' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getWishlist, addToWishlist, removeFromWishlist };
