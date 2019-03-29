/**
 * @jest-environment node
 */<% if (database === 'mysql') { %>
import knex from 'knex'<% } %>
import server from '@server/app'
import User from '@models/User'<% if (database === 'mysql') { %>
import knexConfig from '@/knexfile'<% } %>
import supertest from 'supertest'

const app = () => supertest(server)

describe('The server', () => {
    beforeEach(async () => {<% if (database === 'mongodb') { %>
        await User.deleteMany({})<% } %><% if (database === 'mysql') { %>
        await knex(knexConfig.test).migrate.rollback()
        await knex(knexConfig.test).migrate.latest()<% } %>
    })

    it('should run correctly', async () => {
        const user = {
            password: 'password',
            name: 'test user',
            email: 'test@user.com'
        }
        const response = await app()
            .post('/api/v1/auth/register')
            .send(user)

        expect(response.body.data.token).toBeDefined()
        expect(response.body.data.user.email).toEqual(user.email)
    })
})
