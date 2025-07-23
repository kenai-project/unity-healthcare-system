// setup.js
require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const schemaPath = path.join(__dirname, 'schema.sql');
const schema = fs.readFileSync(schemaPath, 'utf-8');

pool.query(schema)
  .then(() => {
    console.log('✅ Database schema applied successfully.');
    pool.end();
  })
  .catch(err => {
    console.error('❌ Error executing schema.sql:', err);
    pool.end();
  });
