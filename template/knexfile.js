require('dotenv').config()

module.exports = {
    test: {
        client: process.env.TEST_DATABASE_CLIENT,
        connection: {
            database: process.env.TEST_DB_DATABASE,
            user: process.env.TEST_DB_USERNAME,
            password: process.env.TEST_DB_USER_PASSWORD
        },
        pool: {
            min: 2,
            max: 10
        },
        migrations: {
            tableName: 'knex_migrations',
            directory: './server/migrations'
        }
    },

    development: {
        client: process.env.DATABASE_CLIENT,
        connection: {
            database: process.env.DB_DATABASE,
            user: process.env.DB_USERNAME,
            password: process.env.DB_USER_PASSWORD
        },
        pool: {
            min: 2,
            max: 10
        },
        migrations: {
            tableName: 'knex_migrations',
            directory: './server/migrations'
        }
    },

    staging: {
        client: process.env.DATABASE_CLIENT,
        connection: {
            database: process.env.DB_DATABASE,
            user: process.env.DB_USERNAME,
            password: process.env.DB_USER_PASSWORD
        },
        pool: {
            min: 2,
            max: 10
        },
        migrations: {
            tableName: 'knex_migrations',
            directory: './server/migrations'
        }
    },

    production: {
        client: process.env.DATABASE_CLIENT,
        connection: {
            database: process.env.DB_DATABASE,
            user: process.env.DB_USERNAME,
            password: process.env.DB_USER_PASSWORD
        },
        pool: {
            min: 2,
            max: 10
        },
        migrations: {
            tableName: 'knex_migrations',
            directory: './server/migrations'
        }
    }
}
