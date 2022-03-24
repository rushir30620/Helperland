"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SPPageSchema = void 0;
var celebrate_1 = require("celebrate");
var header = {
    authorization: celebrate_1.Joi.string()
        .required()
};
exports.SPPageSchema = {
    Blocked: {
        body: celebrate_1.Joi.object({
            IsBlocked: celebrate_1.Joi.boolean()
                .required()
                .example('true')
        })
    },
    UpdateSPDetails: {
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
            dateOfBirth: celebrate_1.Joi.string()
                .required()
                .example('30-06-2001')
                .description('birth date of user'),
            nationalityId: celebrate_1.Joi.number()
                .integer()
                .required()
                .example(1)
                .description('choose your nationality'),
            gender: celebrate_1.Joi.string()
                .required()
                .example('male')
                .description('gender of service provider'),
            userAddress: celebrate_1.Joi.object()
                .required()
                .description('address of service provider')
        })
    },
    ChangeSPPassword: {
        body: celebrate_1.Joi.object({
            oldPassword: celebrate_1.Joi.string()
                .required()
                .example('rushi')
                .description('password'),
            newPassword: celebrate_1.Joi.string()
                .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/)
                .required()
                .example('2vdveb')
                .description('password'),
            cpassword: celebrate_1.Joi.string()
                .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/)
                .required()
                .example('2vdveb')
                .description('password')
        })
    },
};
