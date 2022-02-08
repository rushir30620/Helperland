"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSchema = void 0;
var celebrate_1 = require("celebrate");
var params = {
    id: celebrate_1.Joi.number()
        .integer()
        .required()
        .description('Id of User')
};
exports.UserSchema = {
    get: {
        params: params
    },
    add: {
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
            mobile: celebrate_1.Joi.number()
                .integer()
                .required()
                .example(1234567890)
                .description('Mobile number user'),
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
    addLogin: {
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
