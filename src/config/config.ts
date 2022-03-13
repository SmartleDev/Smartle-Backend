import mysql from 'mysql2'
import dotenv from 'dotenv'

dotenv.config()

export default mysql.createConnection({
    host : 'smartle-database.chtrceswdnga.ap-south-1.rds.amazonaws.com',
    port : 3306,
    user: 'smartleadmin',
    password : 'smartleroot',
    database : 'smartle'
})