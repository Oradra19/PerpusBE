import mysql from 'mysql2';

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'barang_hilang',
}).promise();

db.query('SELECT 1')
  .then(() => {
    console.log('Database connected');
  })
  .catch((err) => {
    console.error('Database connection failed:', err);
  });

export default db;
