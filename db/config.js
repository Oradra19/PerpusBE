import mysql from 'mysql2';
import dotenv from 'dotenv';
dotenv.config();

const db = mysql.createPool({
  host: process.env.MYSQL_ADDON_HOST,
  user: process.env.MYSQL_ADDON_USER,
  password: process.env.MYSQL_ADDON_PASSWORD,
  database: process.env.MYSQL_ADDON_DB,
  port: process.env.MYSQL_ADDON_PORT,
}).promise();

db.query('SELECT 1')
  .then(() => {
    console.log('✅ Database connected to Clever Cloud');
  })
  .catch((err) => {
    console.error('❌ Database connection failed:', err);
  });

export default db;
