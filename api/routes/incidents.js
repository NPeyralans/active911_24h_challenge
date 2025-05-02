/* incidents.js */
const express = require('express');
const router = express.Router();
const pool = require('../../db');

// GET requests to /incidents
router.get('/', async (req, res) => {
	try {
		const result = await pool.query('SELECT * FROM incidents ORDER BY id DESC'); 
		res.status(200).json(result.rows);
	} catch (err){ 
		// Handle errors here
	}
});

// POST requests to /incidents
router.post('/', async (req, res) => {
	const { type, location, description } = req.body;

	// Validate input here
	
	try {
		const result = await pool.query(
			`INSERT INTO incidents (type, location, description) VALUES ($1, $2, $3) RETURNING *`, [type, location, description]
		);
	
	res.status(200).json({
		message: `Successfully added incident to the database!`,
		data: result.rows[0]
		});
	} catch (err){
		// Handle errors here
	}
});

/* ------------------------------ ID ---------------------- */

// GET requests to /incidents/:id
router.get('/:incidentId', async (req, res) => {
	const id = req.params.incidentId;
	
	try {
		const result = await pool.query('SELECT * FROM incidents WHERE id = $1', [id]);
		res.status(200).json({
			message: `You requested incident ID ${id}`,
			data: result.rows[0]
		});
	} catch (err) {
		// Handle errors here
	}
});

// PUT requests to /incidents/:id
router.put('/:incidentId', async (req, res) => {
	const id = req.params.incidentId;
	const { type, location, description } = req.body;

	try {
		const result = await pool.query(
			`UPDATE incidents SET type = $1, location = $2, description = $3 WHERE id = $4 RETURNING *`,
			[type, location, description, id]
		);
		res.status(200).json({
			message: `Incident ${id} updated successfully!`,
			data: result.rows[0]
		});
	} catch (err) {
		// Handle errors here
	}
});

// DELETE requests to /incidents/:id
router.delete('/:incidentId', (req, res, next) => {
	const id = req.params.incidentId;
	res.status(200).json({
		message: `You passed incident id ${id} with a DELETE method`
	});
	// Implement id functions here
});

module.exports = router;
