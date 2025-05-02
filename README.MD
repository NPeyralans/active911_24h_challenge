# 24h Programming Challenge - Active911

This was a 24h programming challenge to see if I could create a functional REST API.

## Table of Contents
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [PostgreSQL Setup](#postgresql-setup)
- [API Usage with cURL](#api-usage-with-curl)
- [API Test Script](#api-test-script)
- [Improvement/Design/Limitations](#improvementdesignlimitations)
- [Features](#features)
- [License](#license)

## Installation

```bash
git clone https://github.com/NPeyralans/active911_24h_challenge.git
cd active911_24h_challenge
npm install
```

## Usage

```bash
npm start
```

## API Endpoints

- `GET /incidents` — Fetch all incidents sorted by timestamp descending  
- `POST /incidents` — Add an incident  
- `GET /incidents/:id` — Fetch an incident by ID  
- `PUT /incidents/:id` — Update an incident  
- `DELETE /incidents/:id` — Delete an incident  

## PostgreSQL Setup

This project uses PostgreSQL as the database. Before running the app or test:

1. Create the database:
	```bash
	createdb incident_db
	```
2. Create the table:
	```sql
	CREATE TABLE incidents (
		id SERIAL PRIMARY KEY,
		type TEXT NOT NULL,
		location TEXT NOT NULL,
		description TEXT NOT NULL,
		timestamp TIMESTAMPTZ NOT NULL
	);
	```
3. Set environment variables or use a .env file 
	```env
	PGUSER=your_username
	PGPASSWORD=your_password
	PGDATABASE=incident_db
	PGHOST=localhost
	```
Make sure your PostgreSQL server is running locally on port 5432.

## API Usage with cURL

### Get all incidents
```bash
curl -X GET http://localhost:3000/incidents/
```

### Filter incidents by type
```bash
curl -X GET http://localhost:3000/incidents?type=ems
```

### Filter incidents after a certain date (ISO 8601)
```bash
curl -X GET "http://localhost:3000/incidents?after=2025-04-01T00:00:00Z"
```

### Filter incidents before a certain date (ISO 8601)
```bash
curl -X GET "http://localhost:3000/incidents?before=2025-04-01T00:00:00Z"
```

### Filter with multiple filters
```bash
curl -X GET "http://localhost:3000/incidents?type=police&before=2025-04-01T00:00:00Z&after=2024-04-01T00:00:00Z"
```

### Add new incident
```bash
curl -X POST http://localhost:3000/incidents \
  -H "Content-Type: application/json" \
  -d '{"type": "fire", "location": "Location", "description": "Description"}'
```

### Get incident by ID
```bash
curl -X GET http://localhost:3000/incidents/1
```

### Update incident by ID
```bash
curl -X PUT http://localhost:3000/incidents/1 \
  -H "Content-Type: application/json" \
  -d '{"type": "police", "location": "New location", "description": "New description"}'
```

### Delete incident by ID
```bash
curl -X DELETE http://localhost:3000/incidents/1
```
## API Test Script

This project includes a Bash script to **automatically test** all API functionality as required in the challenge, including:

- Creating multiple incidents
- Validating `POST`, `GET`, `PUT`, and `DELETE` requests
- Testing malformed input, missing fields, and filtering
- Checking for proper status codes (`200`, `201`, `400`, `404`, `500`)

---

### Location
```bash
./test_api.sh
```

---

### How to Run

1. Ensure your API server is running at:
   ```
   http://localhost:3000
   ```

3. Modify username and password for your database in test_api.sh

4. Give the script execute permission:
   ```bash
   chmod +x test_api.sh
   ```

5. Run the script:
   ```bash
   ./test_api.sh
   ```

The script will:
- Clear the `incidents` table (requires PostgreSQL access)
- Create fresh test data
- Fetch valid IDs for update/delete tests
- Validate all expected API behavior
- Print color-coded test results

---

## Improvement/Design/Limitations 
This project was completed in <6 hours. Choice of node.js as well as Express were due to my previous familiarity with these tools. With more time, it would be important to ensure total validation of input and ensure special characters are filtered out so as to immunize the database from any injection. With more time I would clean up the code and add more functionality including enhanced error handling. 

## Features

- RESTful API with Express  
- PostgreSQL database integration  
- Basic CRUD operations  
- Includes input validation

## License

MIT

