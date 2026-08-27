const { body } = require('express-validator');

const registerValidator = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').optional().isIn(['customer', 'farmer', 'admin']).withMessage('Role must be customer, farmer, or admin')
];

const loginValidator = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required')
];

const productValidator = [
  body('name').notEmpty().withMessage('Product name is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('category').isIn(['vegetables', 'fruits', 'grains', 'dairy', 'poultry', 'seeds', 'fertilizers', 'equipment', 'other']).withMessage('Invalid category'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('unit').isIn(['kg', 'gram', 'litre', 'piece', 'dozen', 'bag', 'quintal', 'ton']).withMessage('Invalid unit'),
  body('quantity').isInt({ min: 0 }).withMessage('Quantity must be a positive integer')
];

module.exports = { registerValidator, loginValidator, productValidator };