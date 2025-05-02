const { body, validationResult } = require('express-validator');

const validateIncident = [
	body('type')
		.exists( {checkFalsy: true })
		.withMessage('type is required')
		.isIn(['fire', 'ems', 'police'])
		.withMessage('type must be "ems", "fire", or "police"'),

	body('location')
		.exists({ checkFalsy: true })
		.withMessage('location is required')
		.isString().withMessage('location must be a string')
		.notEmpty().withMessage('location cannot be empty'),

	body('description')
		.exists({ checkFalsy: true })
		.withMessage('description is required')
		.isString().withMessage('description must be a string')
		.notEmpty().withMessage('description cannot be empty'),

	body('timestamp')
		.exists({ checkFalsy: true })
		.withMessage('timestamp is required')
		.isISO8601()
		.withMessage('timestamp must be ISO 8601 format (e.g., 2025-05-01T14:30:00Z)')
];

module.exports = validateIncident;
