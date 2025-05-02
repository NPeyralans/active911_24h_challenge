const { Pool } = require('pg');

const pool = new Pool({
	user: 'active911user1',
	host: 'localhost',
	database: 'incident_db',
	password: 'active911password',
	port: 5432,
});

module.exports = pool;
