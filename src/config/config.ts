import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

let dbconnection = mysql.createPool({
  host: process.env.HOST,
  port: 3306,
  user: 'smartleadmin',
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  waitForConnections: true,
  connectionLimit: 20,
  queueLimit: 0,
});

dbconnection.on('connection', (connection: any) => {
  console.log('DB Connection established');

  connection.on('error', (err: any) => {
    console.error(new Date(), 'MySQL error', err.code);
  });
  connection.on('close', (err: any) => {
    console.error(new Date(), 'MySQL close', err);
  });
});

export default dbconnection;
