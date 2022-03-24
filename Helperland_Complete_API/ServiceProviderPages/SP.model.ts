import { Joi } from "celebrate"


const header: Object = {
        authorization: Joi.string()
                .required()
};

export const SPPageSchema = {

        Blocked: {
                body: Joi.object({
                        IsBlocked: Joi.boolean()
                                .required()
                                .example('true')
                })
        },

        UpdateSPDetails: {
                body: Joi.object({
                        firstName: Joi.string()
                                .required()
                                .example('Rushikesh')
                                .description('FirstName of user'),
                        lastName: Joi.string()
                                .required()
                                .example('Rathod')
                                .description('LastName of user'),
                        mobile: Joi.string()
                                .required()
                                .length(10)
                                .example('9512617297')
                                .description('Phone Number of user'),
                        dateOfBirth: Joi.string()
                                .required()
                                .example('30-06-2001')
                                .description('birth date of user'),
                        nationalityId: Joi.number()
                                .integer()
                                .required()
                                .example(1)
                                .description('choose your nationality'),
                        gender: Joi.string()
                                .required()
                                .example('male')
                                .description('gender of service provider'),
                        userAddress: Joi.object()
                                .required()
                                .description('address of service provider')

                })
        },

        ChangeSPPassword: {
                body: Joi.object({
                        oldPassword: Joi.string()
                                .required()
                                .example('rushi')
                                .description('password'),
                        newPassword: Joi.string()
                                .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/)
                                .required()
                                .example('2vdveb')
                                .description('password'),
                        cpassword: Joi.string()
                                .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/)
                                .required()
                                .example('2vdveb')
                                .description('password')

                })
        },
}

