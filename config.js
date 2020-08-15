require('dotenv').config()

const serverPath = process.env.SERVER_PATH

module.exports = {
    server: {
        host: process.env.HOST,
        port: process.env.PORT
    },
    database: {
        host: process.env.DB_HOST,
        db: process.env.DB_NAME,
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD
    }
}
