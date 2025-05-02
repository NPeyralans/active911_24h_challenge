/* incidents.js */
const express = require('express');
const pool = require('../db');
const { validationResult } = require('express-validator');
const validateIncident = require('../middleware/validateIncident');

const router = express.Router();

// GET requests to /incidents
router.get('/', async (req, res) => {
	const { type, after, before } = req.query;

	let query = 'SELECT * FROM incidents';
	const conditions = [];
	const values = [];

	if (type) {
		values.push(type);
		conditions.push(`type = $${values.length}`);
	}

	if (after) {
		values.push(after);
		conditions.push(`timestamp > $${values.length}`);

	}

	if (before) {
		values.push(before);
		conditions.push(`timestamp < $${values.length}`);

	}

	if (conditions.length > 0){
		query += ' WHERE ' + conditions.join(' AND ');
	}

	query += ' ORDER BY timestamp DESC';
	
	try {
		const result = await pool.query(query, values); 
		res.status(200).json(result.rows);
	} catch (err){ 
		console.error(err);
		res.status(500).json({ error: 'Server error' });

	}
});

// POST requests to /incidents
router.post('/', validateIncident, async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()){
		return res.status(400).json({ errors: errors.array() });
	}

	const { type, location, description, timestamp } = req.body;

	try {
		const result = await pool.query(
			`INSERT INTO incidents (type, location, description, timestamp) VALUES ($1, $2, $3, $4) RETURNING *`, [type, location, description, timestamp]
		);
	
	res.status(201).json({
		message: `Successfully added incident to the database!`,
		data: result.rows[0]
		});
	} catch (err){
		console.error(err);
		res.status(500).json({ error: 'Server error' });
	}
});

/* ------------------------------ ID ---------------------- */

// GET requests to /incidents/:id
router.get('/:incidentId', async (req, res) => {
	const id = req.params.incidentId;
	
	try {
		const result = await pool.query('SELECT * FROM incidents WHERE id = $1', [id]);

		if (result.rows.length === 0) {
			return res.status(404).json({
				error: 'Incident not found!',
				incidentId: id
			});
		}

		res.status(200).json(result.rows[0]);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: 'Server error' });
	}
});

// PUT requests to /incidents/:id
router.put('/:incidentId', validateIncident, async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()){
		return res.status(400).json({ errors: errors.array() });
	}

	const id = req.params.incidentId;
	const { type, location, description, timestamp } = req.body;

	try {
		const result = await pool.query(
			`UPDATE incidents SET type = $1, location = $2, description = $3, timestamp = $4 WHERE id = $5 RETURNING *`,
			[type, location, description, timestamp, id]
		);
		if (result.rows.length === 0){
			return res.status(404).json({
				error: `Unable to update: Incident ${id} not found`
			});
		}
		res.status(200).json(result.rows[0]);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: 'Server error' });
	}
});

// DELETE requests to /incidents/:id
router.delete('/:incidentId', async (req, res) => {
	const id = req.params.incidentId;
	try {
		const result = await pool.query('DELETE FROM incidents WHERE id = $1 RETURNING *', [id]);
		if (result.rows.length === 0) {
			return res.status(404).json({ error: `Incident ${id} not found!` });
		}
		res.status(200).json({
			message: `Incident ${id} successully deleted!`,
			data: result.rows[0]
		});
	} catch (err){
		console.error(err);
		res.status(500).json({ error: 'Server error' });
	}
});

module.exports = router;
