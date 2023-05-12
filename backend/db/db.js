// db.js

// Archivo que contiene la configuración y conexión a la base de datos PostgreSQL

const { Pool } = require('pg');

/*const pool = new Pool({
  user: 'postgres',
  host: '34.176.7.179',
  database: 'portafolio',
  password: 'Ignacia77##',
  port: 5432,
});*/

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'sac_local',
  password: '0000001',
  port: 5432,
});




module.exports = {
  pool,
};