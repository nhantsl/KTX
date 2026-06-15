import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config({quiet: true});
import fs from 'fs';

const db = mysql.createPool({
    host: process.env.DB_HOST,
    port : process.env.DB_PORT,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,

    ssl: {
        ca: fs.readFileSync('isrgrootx1.pem')
    }
});

const getUser = async (username, password) => {
    try {
        const [rows] = await db.query(
            'SELECT * FROM user WHERE username = ? AND password = ?',
            [username, password]
        );
        return rows;
    } catch (err) {
        console.error('Lỗi user:', err);
        throw err;
    }
};

export { db, getUser };