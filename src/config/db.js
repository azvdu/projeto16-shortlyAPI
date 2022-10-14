import pg from "pg";

const { Pool } = pg;

const connection = new Pool({
    host: 'localhost',
    port: 5432,
    user: 'postgress',
    password: '4253',
    database: 'shortly'
})

export default connection;