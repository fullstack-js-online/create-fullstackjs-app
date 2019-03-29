exports.up = knex =>
    knex.schema.createTable('users', table => {
        table
            .increments('id')
            .unsigned()
            .primary()
        table.string('name').notNull()
        table.string('email').unique()
        table.string('password').notNull()
        table.dateTime('createdAt').notNull()
        table.dateTime('updatedAt').nullable()
        table.string('emailConfirmCode').nullable()
        table.dateTime('emailConfirmedAt').nullable()
    })

exports.down = knex => knex.schema.dropTable('users')
