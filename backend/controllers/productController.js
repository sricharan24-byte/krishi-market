const { supabase } = require('../config/database.js');
const { validationResult } = require('express-validator');

const getProducts = async (req, res) => {
  try {
    const { category, isOrganic, minPrice, maxPrice, search } = req.query;
    let query = supabase.from('products').select('*, farmer:users(full_name, email, phone)');

    if (category) query = query.eq('category', category);
    if (isOrganic) query = query.eq('is_organic', isOrganic === 'true');
    if (minPrice) query = query.gte('price', Number(minPrice));
    if (maxPrice) query = query.lte('price', Number(maxPrice));
    if (search) query = query.ilike('name', %%);

    const { data: products, error } = await query;
    if (error) throw error;
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const { data: product, error } = await supabase.from('products').select('*, farmer:users(full_name, email, phone)').eq('id', req.params.id).maybeSingle();
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createProduct = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { name, description, category, price, unit, quantity, isOrganic } = req.body;
    
    const { data: product, error } = await supabase.from('products').insert([{
      farmer_id: req.user._id || req.user.id,
      name, description, category, price, unit, quantity, is_organic: isOrganic,
      images: req.files ? req.files.map(file => file.filename) : []
    }]).select().single();

    if (error) throw error;
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { data: product } = await supabase.from('products').select('*').eq('id', req.params.id).maybeSingle();
    if (!product) return res.status(404).json({ message: 'Product not found' });

    if (product.farmer_id !== (req.user._id || req.user.id) && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this product' });
    }

    const updates = { ...req.body };
    if (req.files && req.files.length > 0) updates.images = req.files.map(file => file.filename);

    const { data: updatedProduct, error } = await supabase.from('products').update(updates).eq('id', req.params.id).select().single();
    if (error) throw error;
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { data: product } = await supabase.from('products').select('*').eq('id', req.params.id).maybeSingle();
    if (!product) return res.status(404).json({ message: 'Product not found' });

    if (product.farmer_id !== (req.user._id || req.user.id) && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this product' });
    }
    
    const { error } = await supabase.from('products').delete().eq('id', req.params.id);
    if (error) throw error;
    res.json({ message: 'Product removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getFarmerProducts = async (req, res) => {
  try {
    const { data: products, error } = await supabase.from('products').select('*').eq('farmer_id', req.user._id || req.user.id);
    if (error) throw error;
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct, getFarmerProducts };
