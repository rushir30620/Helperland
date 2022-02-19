import {Joi} from "celebrate"

export const forgotPassSchema = {
    addForgotPass: {
        body: Joi.object({
            email: Joi.string()
                    .required()
                    .email()
                    .example('rushi@gmail.com')
                    .description('User Email'),
        })
    },
    addNewPassword: {
        body: Joi.object({
            token: Joi.string()
                    .required()
                    .description('reset password link'),
            newPassword: Joi.string()
                    .required()
                    .description('New password of user'),
        })
    },
}