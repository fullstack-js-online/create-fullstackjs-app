exports.up = knex =>
    knex.schema.createTable('password_resets', table => {
        table.string('email').notNull()
        table.string('token').nullable()
        table.dateTime('createdAt').notNull()
    })

exports.down = knex => knex.schema.dropTable('password_resets')
