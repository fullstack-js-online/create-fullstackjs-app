import dotenv from 'dotenv'

dotenv.config()

export default {
    url: process.env.APP_URL || 'http://localhost:4001',
    port: process.env.PORT || 4001,
    environment: process.env.NODE_ENV || 'development',

    jwtSecret: process.env.JWT_SECRET || '1234',
    development: process.env.NODE_ENV === 'development',
    production: process.env.NODE_ENV === 'production'
}
