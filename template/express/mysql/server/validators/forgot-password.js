import * as Yup from 'yup'
import User from '@models/User'
import { ForgotPasswordSchema } from '@server/validation-schemas'

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
    const { email } = req.body

    try {
        await ForgotPasswordSchema.validate({
            email
        })

        const existingUser = await User.query().findOne({ email })

        if (!existingUser) {
            throw new Yup.ValidationError(
                'No account was found with this email.',
                req.body,
                'email'
            )
        }

        const existingPasswordReset = await User.knex()
            .select('*')
            .from('password_resets')
            .where({
                email
            })
            .limit(1)

        if (existingPasswordReset.length > 0) {
            throw new Yup.ValidationError(
                'Password reset link already sent.',
                req.body,
                'email'
            )
        }

        req.authUser = existingUser

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
