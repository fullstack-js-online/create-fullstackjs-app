import * as Yup from 'yup'
import User from '@models/User'
import { ResetPasswordSchema } from '@server/validation-schemas'

/**
 * Validates the login request
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 *
 * @return {Object}
 */
export default async (req, res, next) => {
    const { email, token, password } = req.body

    try {
        await ResetPasswordSchema.validate({
            password,
            token,
            email
        })

        const passwordReset = await User.knex()
            .select('*')
            .from('password_resets')
            .where({ email, token })
            .limit(1)

        if (!passwordReset || passwordReset.length === 0) {
            throw new Yup.ValidationError(
                'Invalid password reset token.',
                req.body,
                'email'
            )
        }

        const authUser = await User.query().findOne({
            email: passwordReset[0].email
        })

        req.authUser = authUser

        return next()
    } catch (error) {
        return res.status(422).json({
            message: 'Validation failed.',
            data: {
                errors: {
                    [error.path]: error.message
                }
            }
        })
    }
}
