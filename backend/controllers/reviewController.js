const { supabase } = require('../config/database.js');

const getProductReviews = async (req, res) => {
  try {
    const { data: reviews, error } = await supabase.from('reviews').select('*, user:users(full_name)').eq('product_id', req.params.productId);
    if (error) throw error;
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addReview = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;
    
    const { data: existingReview } = await supabase.from('reviews').select('*').eq('product_id', productId).eq('user_id', req.user._id || req.user.id).maybeSingle();
    if (existingReview) {
      return res.status(400).json({ message: 'Product already reviewed' });
    }

    const { data: review, error } = await supabase.from('reviews').insert([{
      user_id: req.user._id || req.user.id,
      product_id: productId,
      rating: Number(rating),
      comment
    }]).select().single();
    if (error) throw error;

    // Optional: Update product ratings/num_reviews here via SQL function/RPC or separate query
    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getProductReviews, addReview };
