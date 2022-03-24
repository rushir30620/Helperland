"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceBookSchema = void 0;
var celebrate_1 = require("celebrate");
var header = {
    authorization: celebrate_1.Joi.string()
        .required()
};
exports.ServiceBookSchema = {
    zipCode: {
        body: celebrate_1.Joi.object({
            postalcode: celebrate_1.Joi.string()
                .required()
                .length(6)
                .example('361210')
                .description('ZipCode')
        })
    },
    createService: {
        body: celebrate_1.Joi.object({
            ServiceId: celebrate_1.Joi.number()
                .integer()
                .required()
                .example(1)
                .description('ServiceId'),
            ServiceStartDate: celebrate_1.Joi.date()
                .required()
                .example('12-02-2022')
                .description('Date of the service'),
            ServiceStartTime: celebrate_1.Joi.string()
                .required()
                .example('08:00')
                .description('Time of the service'),
            ServiceHours: celebrate_1.Joi.number()
                .integer()
                .required()
                .example('3')
                .description('Service Hours'),
            Comments: celebrate_1.Joi.string()
                .example('This is new service')
                .description('comment of this service'),
            PaymentDue: celebrate_1.Joi.boolean()
                .required()
                .example('true'),
            HasPets: celebrate_1.Joi.boolean()
                .required()
                .example('true')
                .description('Pets at home'),
            ServiceRequestAddress: celebrate_1.Joi.object()
                .required(),
            ExtraService: celebrate_1.Joi.array()
        })
    },
    userAddress: {
        body: celebrate_1.Joi.object({
            Addressline1: celebrate_1.Joi.string()
                .required()
                .example('Luhar street, mochi bazar, dhrol')
                .description('Addressline 1'),
            Addressline2: celebrate_1.Joi.string()
                .example('380')
                .description('Addressline 2'),
            City: celebrate_1.Joi.string()
                .required()
                .example('dhrol')
                .description('City'),
            State: celebrate_1.Joi.string()
                .example('Gujarat')
                .description('State'),
            IsDefault: celebrate_1.Joi.boolean()
                .required()
                .example('true'),
            IsDeleted: celebrate_1.Joi.boolean()
                .required()
                .example('true'),
            Mobile: celebrate_1.Joi.string()
                .required()
                .length(10)
                .example('9512617297')
                .description('Mobile number')
        })
    },
};
