import mysql from 'mysql2'
import dotenv from 'dotenv'

dotenv.config()

export default mysql.createConnection({
    host : process.env.HOST,
    port : 3306,
    user: process.env.USER,
    password : process.env.PASSWORD,
    database : process.env.DATABASE
})