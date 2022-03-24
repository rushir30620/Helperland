import { Joi } from "celebrate"

const header: Object = {
        authorization: Joi.string()
                .required()
};


export const CustomerSchema = {

        RescheduleDateTime: {
                body: Joi.object({
                        ServiceStartDate: Joi.string()
                                .required()
                                .example('06-03-2022')
                                .description('date'),
                        ServiceStartTime: Joi.string()
                                .required()
                                .example('18:30')
                                .description('time')

                })
        },

        CancelServiceRequest: {
                body: Joi.object({
                        Comments: Joi.string()
                                .example('just enjoy')
                                .description('comments or feedback')

                })
        },

        Rating: {
                body: Joi.object({
                        Comments: Joi.string()
                                .example('very good service provider')
                                .description('comments or feedback'),
                        OnTimeArrival: Joi.number()
                                .example('4'),
                        Friendly: Joi.number()
                                .example('4'),
                        QualityOfService: Joi.number()
                                .example('5'),
                })
        },

        UpdateUserDetails: {
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
                        dateOfBirth: Joi.date()
                                .example('30-06-2001')
                                .description('birth date of user'),
                        languageId: Joi.number()
                                .integer()
                                .required()
                                .example(1)
                                .description('choose your language')

                })
        },

        EditAddUserAddress: {
                body: Joi.object({
                        StreetName: Joi.string()
                                .required()
                                .example('limbada line, jamnagar')
                                .description('streetname of user address'),
                        HouseNumber: Joi.string()
                                .required()
                                .example('23')
                                .description('housenumber of user house'),
                        PostalCode: Joi.string()
                                .required()
                                .example('361210')
                                .description('Zip code'),
                        City: Joi.string()
                                .required()
                                .example('Dhrol')
                                .description('City'),
                        Mobile: Joi.string()
                                .required()
                                .length(10)
                                .example(9512617297)
                                .description('Phone Number of user'),

                })
        },

        ChangePassword: {
                body: Joi.object({
                        oldPassword: Joi.string()
                                .required()
                                .example('rushi')
                                .description('password'),
                        newPassword: Joi.string()
                                // .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/)
                                .required()
                                .example('2vdveb')
                                .description('password'),
                        cpassword: Joi.string()
                                // .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/)
                                .required()
                                .example('2vdveb')
                                .description('password')

                })
        },
}