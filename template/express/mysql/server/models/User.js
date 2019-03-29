import config from '@config'
import Bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { Model } from 'objection'
import Mail from '@fullstackjs/mail'
import randomstring from 'randomstring'

class User extends Model {
    /**
     * Define what table this model connects to
     *
     * @var string
     */
    static tableName = 'users'

    /**
     * Generate a jwt for a user
     *
     * @return string
     */
    async generateToken() {
        return jwt.sign(
            {
                id: this.id,
                name: this.name,
                email: this.email
            },
            config.jwtSecret
        )
    }

    /**
     * Send email to reset user's password
     *
     * @return {null}
     */
    async forgotPassword() {
        const token = randomstring.generate()

        await this.constructor
            .knex()
            .insert({
                token,
                email: this.email,
                createdAt: new Date()
            })
            .into('password_resets')

        await this.sendForgotPasswordEmail(token)
    }

    /**
     * Reset this user's password
     *
     * @param {string} password
     * @return {null}
     */
    async resetPassword(password) {
        await this.$query().patch({
            password: Bcrypt.hashSync(password)
        })

        await this.constructor
            .knex()
            .table('password_resets')
            .where({
                email: this.email
            })
            .del()
    }

    /**
     * Send forgot password email
     *
     * @param {string} token
     * @return {Promise}
     */
    async sendForgotPasswordEmail(token) {
        await new Mail('forgot-password')
            .to(this.email)
            .subject('You requested for a password reset.')
            .data({
                name: this.name,
                url: `${config.url}/auth/passwords/reset/${token}`
            })
            .send()
    }

    /**
     * Send account confirmation email
     *
     * @return {Promise}
     */
    async sendEmailVerificationEmail() {
        await new Mail('confirm-email')
            .to(this.email)
            .subject('Please confirm your email address.')
            .data({
                name: this.name,
                url: `${config.url}/auth/emails/confirm/${
                    this.emailConfirmCode
                }`
            })
            .send()
    }

    /**
     * Compare user plain password to hashed version.
     *
     * @param {string} password
     * @return {bool}
     */
    async comparePasswords(password) {
        return Bcrypt.compareSync(password, this.password)
    }

    /**
     * Confirm user's email
     *
     * @return {null}
     */
    async confirmEmail() {
        const confirmedUser = await User.query().patchAndFetchById(this.id, {
            emailConfirmedAt: new Date(),
            emailConfirmCode: null
        })

        return confirmedUser
    }

    /**
     * Hook executed before model is inserted into database
     *
     * @param {Object} context
     * @return {Promise}
     */
    async $beforeInsert(context) {
        await super.$beforeInsert(context)

        this.createdAt = new Date()
        this.password = Bcrypt.hashSync(this.password)
        this.emailConfirmCode = randomstring.generate()
    }

    /**
     * Send email verification email after registering user
     *
     * @param {Object} queryContext
     * @return {null}
     */
    async $afterInsert(queryContext) {
        await super.$afterInsert(queryContext)
        await this.sendEmailVerificationEmail()
    }
}

export default User
