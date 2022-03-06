import { Joi } from "celebrate"

const header: Object = {
    authorization: Joi.string()
        .required()
};

export const ServiceBookSchema = {
    zipCode: {
        body: Joi.object({
            postalcode: Joi.string()
                .required()
                .length(6)
                .example('361210')
                .description('ZipCode')
        })
    },

    createService: {
        body: Joi.object({
            ServiceId: Joi.number()
                .integer()
                .required()
                .example(1)
                .description('ServiceId'),
            ServiceStartDate: Joi.date()
                .required()
                .example('12-02-2022')
                .description('Date of the service'),
            ServiceStartTime: Joi.string()
                .required()
                .example('08:00')
                .description('Time of the service'),
            ServiceHours: Joi.number()
                .integer()
                .required()
                .example('3')
                .description('Service Hours'),
            Comments: Joi.string()
                .example('This is new service')
                .description('comment of this service'),
            PaymentDue: Joi.boolean()
                .required()
                .example('true'),
            HasPets: Joi.boolean()
                .required()
                .example('true')
                .description('Pets at home'),
            ServiceRequestAddress: Joi.object()
                .required(),
            ExtraService: Joi.array()
        })
    },

    userAddress: {
        body: Joi.object({
            Addressline1: Joi.string()
                .required()
                .example('Luhar street, mochi bazar, dhrol')
                .description('Addressline 1'),
            Addressline2: Joi.string()
                .example('380')
                .description('Addressline 2'),
            City: Joi.string()
                .required()
                .example('dhrol')
                .description('City'),
            State: Joi.string()
                .example('Gujarat')
                .description('State'),
            IsDefault: Joi.boolean()
                .required()
                .example('true'),
            IsDeleted: Joi.boolean()
                .required()
                .example('true'),
            Mobile: Joi.string()
                .example('9512617297')
                .description('Mobile number')

        })
    },

}

