const { supabase } = require('../config/database.js');

const getNotifications = async (req, res) => {
  try {
    const { data: notifications, error } = await supabase.from('notifications').select('*').eq('user_id', req.user._id || req.user.id).order('created_at', { ascending: false });
    if (error) throw error;
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const markAsRead = async (req, res) => {
  try {
    const { data: notification, error } = await supabase.from('notifications').update({ is_read: true }).eq('id', req.params.id).eq('user_id', req.user._id || req.user.id).select().single();
    if (error) throw error;
    res.json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const clearNotifications = async (req, res) => {
  try {
    const { error } = await supabase.from('notifications').delete().eq('user_id', req.user._id || req.user.id);
    if (error) throw error;
    res.json({ message: 'Notifications cleared' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteNotification = async (req, res) => {
  try {
    const { error } = await supabase.from('notifications').delete().eq('id', req.params.id).eq('user_id', req.user._id || req.user.id);
    if (error) throw error;
    res.json({ message: 'Notification removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getNotifications,
  markAsRead,
  clearNotifications,
  deleteNotification
};
