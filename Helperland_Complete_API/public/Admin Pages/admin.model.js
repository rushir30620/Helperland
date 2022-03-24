"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminSchema = void 0;
var celebrate_1 = require("celebrate");
var header = {
    authorization: celebrate_1.Joi.string()
        .required()
};
exports.AdminSchema = {
    EditDetails: {
        body: celebrate_1.Joi.object({
            ServiceStartDate: celebrate_1.Joi.string()
                .required()
                .example('24-03-2022')
                .description('date'),
            ServiceStartTime: celebrate_1.Joi.string()
                .required()
                .example('18:30')
                .description('time'),
            serviceAddress: celebrate_1.Joi.object()
                .required()
                .description('service request address'),
            Comments: celebrate_1.Joi.string()
                .required()
                .description('Commments'),
            Note: celebrate_1.Joi.string()
                .example('Whatever you write')
                .description('EMP note')
        })
    },
    SearchById: {
        body: celebrate_1.Joi.object({
            ServiceRequestId: celebrate_1.Joi.number()
                .required()
                .example(4)
        })
    },
    SearchByPostalcode: {
        body: celebrate_1.Joi.object({
            ZipCode: celebrate_1.Joi.string()
                .required()
                .example('361210')
        })
    },
    SearchByEmail: {
        body: celebrate_1.Joi.object({
            email: celebrate_1.Joi.string()
                .required()
                .email()
                .example('user1@gmail.com')
        })
    },
    SearchByName: {
        body: celebrate_1.Joi.object({
            Name: celebrate_1.Joi.string()
                .required()
                .example('Rohit sharma')
        })
    },
    SearchBySP: {
        body: celebrate_1.Joi.object({
            SPName: celebrate_1.Joi.string()
                .required()
                .example('Virat Kohli')
        })
    },
    SearchByStatus: {
        body: celebrate_1.Joi.object({
            Status: celebrate_1.Joi.string()
                .required()
                .example('completed')
        })
    },
    SearchByDate: {
        body: celebrate_1.Joi.object({
            ServiceStartDate: celebrate_1.Joi.string()
                .required()
                .example('24-03-2022')
                .description('date')
        })
    },
    Activate: {
        body: celebrate_1.Joi.object({
            isRegisteredUser: celebrate_1.Joi.boolean()
                .required()
                .example('true')
        })
    }
};
