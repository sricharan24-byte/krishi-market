const { supabase } = require('../config/database.js');

const getUsers = async (req, res) => {
  try {
    const { data: users, error } = await supabase.from('users').select('id, full_name, email, role, phone, created_at');
    if (error) throw error;
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const { data: user, error } = await supabase.from('users').select('id, full_name, email, role, phone, address_street, address_city, address_state, address_zip_code, address_country').eq('id', req.params.id).maybeSingle();
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const updates = { ...req.body };
    if (updates.name || updates.fullName) {
      updates.full_name = updates.name || updates.fullName;
    }
    const { data: user, error } = await supabase.from('users').update(updates).eq('id', req.params.id).select('id, full_name, email, role, phone').single();
    if (error) throw error;
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const { data: user, error } = await supabase.from('users').update({ role }).eq('id', req.params.id).select('id, full_name, role').single();
    if (error) throw error;
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { error } = await supabase.from('users').delete().eq('id', req.params.id);
    if (error) throw error;
    res.json({ message: 'User removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getUsers, getUserById, updateUser, updateUserRole, deleteUser };
