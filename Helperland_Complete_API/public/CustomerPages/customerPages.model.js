"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerSchema = void 0;
var celebrate_1 = require("celebrate");
var header = {
    authorization: celebrate_1.Joi.string()
        .required()
};
exports.CustomerSchema = {
    RescheduleDateTime: {
        body: celebrate_1.Joi.object({
            ServiceStartDate: celebrate_1.Joi.string()
                .required()
                .example('06-03-2022')
                .description('date'),
            ServiceStartTime: celebrate_1.Joi.string()
                .required()
                .example('18:30')
                .description('time')
        })
    },
    CancelServiceRequest: {
        body: celebrate_1.Joi.object({
            Comments: celebrate_1.Joi.string()
                .example('just enjoy')
                .description('comments or feedback')
        })
    },
    Rating: {
        body: celebrate_1.Joi.object({
            Comments: celebrate_1.Joi.string()
                .example('very good service provider')
                .description('comments or feedback'),
            OnTimeArrival: celebrate_1.Joi.number()
                .example('4'),
            Friendly: celebrate_1.Joi.number()
                .example('4'),
            QualityOfService: celebrate_1.Joi.number()
                .example('5'),
        })
    },
    UpdateUserDetails: {
        body: celebrate_1.Joi.object({
            firstName: celebrate_1.Joi.string()
                .required()
                .example('Rushikesh')
                .description('FirstName of user'),
            lastName: celebrate_1.Joi.string()
                .required()
                .example('Rathod')
                .description('LastName of user'),
            mobile: celebrate_1.Joi.string()
                .required()
                .length(10)
                .example('9512617297')
                .description('Phone Number of user'),
            dateOfBirth: celebrate_1.Joi.date()
                .example('30-06-2001')
                .description('birth date of user'),
            languageId: celebrate_1.Joi.number()
                .integer()
                .required()
                .example(1)
                .description('choose your language')
        })
    },
    EditAddUserAddress: {
        body: celebrate_1.Joi.object({
            StreetName: celebrate_1.Joi.string()
                .required()
                .example('limbada line, jamnagar')
                .description('streetname of user address'),
            HouseNumber: celebrate_1.Joi.string()
                .required()
                .example('23')
                .description('housenumber of user house'),
            PostalCode: celebrate_1.Joi.string()
                .required()
                .example('361210')
                .description('Zip code'),
            City: celebrate_1.Joi.string()
                .required()
                .example('Dhrol')
                .description('City'),
            Mobile: celebrate_1.Joi.string()
                .required()
                .length(10)
                .example(9512617297)
                .description('Phone Number of user'),
        })
    },
    ChangePassword: {
        body: celebrate_1.Joi.object({
            oldPassword: celebrate_1.Joi.string()
                .required()
                .example('rushi')
                .description('password'),
            newPassword: celebrate_1.Joi.string()
                // .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/)
                .required()
                .example('2vdveb')
                .description('password'),
            cpassword: celebrate_1.Joi.string()
                // .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/)
                .required()
                .example('2vdveb')
                .description('password')
        })
    },
};
