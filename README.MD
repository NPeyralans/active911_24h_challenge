# 24h Programming Challenge - Active911

This was a 24h programming challenge to see if I could create a functional REST API.

## Table of Contents
 - [Installation](#installation)
 - [Usage](#usage)
 - [API Endpoints](#api-endpoints)
 - [Features](#features)
 - [License](#license)

## Installation

```bash
git clone https://github.com/NPeyralans/active911_24h_challengehttps://github.com/NPeyralans/active911_24h_challenge
cd active911_24h_challenge
npm install

## Usage
```bash
npm start

## API Endpoints
GET /incidents
Fetch all incidents sorted by timestamp descending.
POST /incidents
Add an incident.

GET /incidents/:id 
Fetch an incident by ID.
PUT /incidents/:id 
Update an incident.
DELETE /incidents/:id
Delete an incident.

## API Usage with cURL
### Get all incidents 
```bash
curl -X GET http://localhost:3000/incidents/

#### Filter incidents by type 
curl -X GET http://localhost:3000/incidents?type=ems

#### Filter incidents after a certain date in ISO 8601 format
curl -X GET http://localhost:3000/incidents?after=2025-04-01T00:00:00Z

#### Filter incidents before a certain date in ISO 8601 format
curl -X GET http://localhost:3000/incidents?before=2025-04-01T00:00:00Z

#### Filter incidents using multiple filters
curl -X GET http://localhost:3000/incidents?type=police&before=2025-04-01T00:00:00Z&after=2024-04-01T00:00:00Z

### Add new incident
curl -x POST http://localhost:3000/incidents \
	-H "Content-Type: application-data/json \
	-d '{"type": "fire", "location": "Location", "description": "Description"}'
### Get filtering for 

### Get incident by ID 
curl -x GET http://localhost:3000/incidents/1

### Update incident by ID 
curl -x PUT http://localhost:3000/incidents/1 \
	-H "Content-Type: application-data/json \
	-d '{"type": "police", "location": "New location", "description": "New description"}'

### Delete an incident by ID 
curl -X DELETE http://localhost:3000/incidents/1

## Features
+RESTful API with Express
+PostgreSQL database integration
+Basic CRUD operations

## License
MIT License
