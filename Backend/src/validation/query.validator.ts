import Joi from 'joi';

export const submitLeadSchema = Joi.object({
  name: Joi.string().trim().min(3).max(255).required().messages({
    'string.empty': 'Name cannot be empty',
    'string.min': 'Name must be at least 3 characters long',
    'any.required': 'Name is required',
  }),
  email: Joi.string().trim().email().allow('', null).optional().messages({
    'string.email': 'Please enter a valid email address',
  }),
  phone: Joi.string().trim().pattern(/^[0-9]{10}$/).required().messages({
    'string.pattern.base': 'Phone number must be a 10-digit number',
    'string.empty': 'Phone number cannot be empty',
    'any.required': 'Phone number is required',
  }),
  address: Joi.string().trim().min(5).allow('', null).optional().messages({
    'string.min': 'Address must be at least 5 characters long',
  }),
  city: Joi.string().trim().min(2).max(100).allow('', null).optional().messages({
    'string.min': 'City must be at least 2 characters long',
  }),
  monthlyElectricityBill: Joi.number().positive().allow('', null).optional().messages({
    'number.base': 'Monthly electricity bill must be a number',
    'number.positive': 'Monthly electricity bill must be greater than zero',
  }),
  solarCapacityInterested: Joi.string().trim().max(100).allow('', null),
  message: Joi.string().trim().max(5000).allow('', null),

  // Optional form type & feedback/service details
  type: Joi.string().valid('enquiry', 'service', 'feedback').optional(),
  rating: Joi.number().min(1).max(5).optional(),
  feedbackType: Joi.string().trim().max(255).optional(),
  alternatePhone: Joi.string().trim().allow('', null).optional(),
  serviceCategory: Joi.string().trim().allow('', null).optional(),
  productCategory: Joi.string().trim().allow('', null).optional(),
  productSubcategory: Joi.string().trim().allow('', null).optional(),
  capacity: Joi.string().trim().allow('', null).optional(),
  issueType: Joi.string().trim().allow('', null).optional(),
  quantity: Joi.number().optional(),
  serialNumber: Joi.string().trim().allow('', null).optional(),
  purchaseDate: Joi.string().trim().allow('', null).optional(),
  invoiceFileName: Joi.string().trim().allow('', null).optional(),
  serialFileName: Joi.string().trim().allow('', null).optional(),
});

export const updateLeadStatusSchema = Joi.object({
  status: Joi.string().valid('PENDING', 'CONTACTED', 'QUOTED', 'CLOSED').required().messages({
    'any.only': 'Invalid lead status. Must be PENDING, CONTACTED, QUOTED, or CLOSED',
    'any.required': 'Status is required',
  }),
  adminNotes: Joi.string().trim().max(5000).allow('', null),
});

export const loginSchema = Joi.object({
  email: Joi.string().trim().email().required().messages({
    'string.email': 'Please enter a valid email address',
    'any.required': 'Email is required',
  }),
  password: Joi.string().required().messages({
    'any.required': 'Password is required',
  }),
});
