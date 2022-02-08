"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.forgotPassSchema = void 0;
var celebrate_1 = require("celebrate");
exports.forgotPassSchema = {
    addForgotPass: {
        body: celebrate_1.Joi.object({
            email: celebrate_1.Joi.string()
                .required()
                .email()
                .example('rushi@gmail.com')
                .description('User Email'),
        })
    },
    addNewPassword: {
        body: celebrate_1.Joi.object({
            token: celebrate_1.Joi.string()
                .required()
                .description('reset password link'),
            newPassword: celebrate_1.Joi.string()
                .required()
                .description('New password of user'),
        })
    },
};
