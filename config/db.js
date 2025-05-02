const mysql = require('mysql2/promise');
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || 'containers-us-west-88.railway.app', 
  port: process.env.MYSQL_PORT || 6872,
  user: process.env.MYSQL_USER || 'root', 
  password: process.env.MYSQL_PASSWORD || 'your-actual-password',
  database: process.env.MYSQL_DATABASE || 'railway',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: { 
    rejectUnauthorized: false
  }
});


(async () => {
  try {
    const conn = await pool.getConnection();
    console.log(' Connected to MySQL on Railway!');
    conn.release();
  } catch (err) {
    console.error(' Connection failed:', err);
    process.exit(1); 
  }
})();

module.exports = pool;