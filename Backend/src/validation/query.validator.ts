import Joi from 'joi';

export const submitLeadSchema = Joi.object({
  name: Joi.string().trim().min(1).max(255).required().messages({
    'string.empty': 'Name cannot be empty',
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
  address: Joi.string().trim().allow('', null).optional(),
  city: Joi.string().trim().allow('', null).optional(),
  monthlyElectricityBill: Joi.number().allow('', null).optional(),
  solarCapacityInterested: Joi.string().trim().allow('', null).optional(),
  message: Joi.string().trim().allow('', null).optional(),

  // Optional form type & feedback/service details
  type: Joi.string().valid('enquiry', 'service', 'feedback').optional(),
  rating: Joi.number().min(1).max(5).optional(),
  feedbackType: Joi.string().trim().allow('', null).optional(),
  customerType: Joi.string().trim().allow('', null).optional(),
  alternatePhone: Joi.string().trim().allow('', null).optional(),
  doorNo: Joi.string().trim().allow('', null).optional(),
  street: Joi.string().trim().allow('', null).optional(),
  landmark: Joi.string().trim().allow('', null).optional(),
  locality: Joi.string().trim().allow('', null).optional(),
  postOffice: Joi.string().trim().allow('', null).optional(),
  tahsil: Joi.string().trim().allow('', null).optional(),
  state: Joi.string().trim().allow('', null).optional(),
  district: Joi.string().trim().allow('', null).optional(),
  pincode: Joi.string().trim().allow('', null).optional(),
  serviceCategory: Joi.string().trim().allow('', null).optional(),
  productCategory: Joi.string().trim().allow('', null).optional(),
  productSubcategory: Joi.string().trim().allow('', null).optional(),
  capacity: Joi.string().trim().allow('', null).optional(),
  issueType: Joi.string().trim().allow('', null).optional(),
  issueDetail: Joi.string().trim().allow('', null).optional(),
  quantity: Joi.number().optional(),
  serialNumber: Joi.string().trim().allow('', null).optional(),
  purchaseDate: Joi.string().trim().allow('', null).optional(),
  invoiceFileName: Joi.string().trim().allow('', null).optional(),
  invoiceFileDataUrl: Joi.string().allow('', null).optional(),
  serialFileName: Joi.string().trim().allow('', null).optional(),
  serialFileDataUrl: Joi.string().allow('', null).optional(),
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
