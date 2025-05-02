/* app.js */
const express = require('express');

const app = express();

const incidentsRoutes = require('./routes/incidents');
app.use(express.json());
app.use('/incidents', incidentsRoutes);

module.exports = app; 
