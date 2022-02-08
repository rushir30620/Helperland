import { Joi } from 'celebrate';

const params: object = {
    id: Joi.number()
        .integer()
        .required()
        .description('Id of User')
};

export const ServiceProviderSchema = {
    get: {
        params: params
    },
    addHelper: {
        body: Joi.object({
            firstName: Joi.string()
                .required()
                .example('Rushikesh')
                .description('First Name of User'),
            lastName: Joi.string()
                .required()
                .example('Rathod')
                .description('Last Name of User'),
            email: Joi.string()
                .required()
                .example('abc@gmail.com')
                .description('Email Id of User'),
            mobile: Joi.number()
                .integer()
                .required()
                .example(1234567890)
                .description('Mobile number user'),
            password: Joi.string()
                .required()
                .example('12345fm')
                .description('password of user'),
            cpassword: Joi.string()
                .required()
                .example('12345fm')
                .description('confirm password of user')
        })
    },
    addHelperLogin: {
        body: Joi.object({
            email: Joi.string()
                    .required()
                    .email()
                    .example("rushi@gmail.com")
                    .description("Email of User"),
            password: Joi.string()
                    .required()
                    .description("User Password"),
        })
    }
}