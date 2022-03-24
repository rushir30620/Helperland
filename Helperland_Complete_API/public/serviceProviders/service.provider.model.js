"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceProviderSchema = void 0;
var celebrate_1 = require("celebrate");
var params = {
    id: celebrate_1.Joi.number()
        .integer()
        .required()
        .description('Id of User')
};
exports.ServiceProviderSchema = {
    get: {
        params: params
    },
    addHelper: {
        body: celebrate_1.Joi.object({
            firstName: celebrate_1.Joi.string()
                .required()
                .example('Rushikesh')
                .description('First Name of User'),
            lastName: celebrate_1.Joi.string()
                .required()
                .example('Rathod')
                .description('Last Name of User'),
            email: celebrate_1.Joi.string()
                .required()
                .example('abc@gmail.com')
                .description('Email Id of User'),
            mobile: celebrate_1.Joi.string()
                .required()
                .length(10)
                .example('1234567890')
                .description('Mobile number user'),
            zipCode: celebrate_1.Joi.number()
                .integer()
                .example(361210)
                .description('Zipcode of the user address'),
            password: celebrate_1.Joi.string()
                .required()
                .example('12345fm')
                .description('password of user'),
            cpassword: celebrate_1.Joi.string()
                .required()
                .example('12345fm')
                .description('confirm password of user')
        })
    },
    addHelperLogin: {
        body: celebrate_1.Joi.object({
            email: celebrate_1.Joi.string()
                .required()
                .email()
                .example("rushi@gmail.com")
                .description("Email of User"),
            password: celebrate_1.Joi.string()
                .required()
                .description("User Password"),
        })
    }
};
