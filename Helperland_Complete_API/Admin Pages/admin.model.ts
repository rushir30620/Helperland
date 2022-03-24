import { Joi } from "celebrate"

const header: Object = {
    authorization: Joi.string()
                .required()
};

export const AdminSchema = {

    EditDetails: {
        body: Joi.object({
            ServiceStartDate: Joi.string()
                    .required()
                    .example('24-03-2022')
                    .description('date'),
            ServiceStartTime: Joi.string()
                    .required()
                    .example('18:30')
                    .description('time'),
            serviceAddress: Joi.object()
                    .required()
                    .description('service request address'),
            Comments: Joi.string()
                    .required()
                    .description('Commments'),
            Note: Joi.string()
                    .example('Whatever you write')
                    .description('EMP note')

        })
    },

    SearchById: {
        body: Joi.object({
            ServiceRequestId: Joi.number()
                    .required()
                    .example(4)
        })
    },

    SearchByPostalcode: {
        body: Joi.object({
            ZipCode: Joi.string()
                    .required()
                    .example('361210')
        })
    },

    SearchByEmail: {
        body: Joi.object({
            email: Joi.string()
                    .required()
                    .email()
                    .example('user1@gmail.com')
        })
    },

    SearchByName: {
        body: Joi.object({
            Name: Joi.string()
                    .required()
                    .example('Rohit sharma')
        })
    },

    SearchBySP: {
        body: Joi.object({
            SPName: Joi.string()
                    .required()
                    .example('Virat Kohli')
        })
    },

    SearchByStatus: {
        body: Joi.object({
            Status: Joi.string()
                    .required()
                    .example('completed')
        })
    },

    SearchByDate: {
        body: Joi.object({
            ServiceStartDate: Joi.string()
                    .required()
                    .example('24-03-2022')
                    .description('date')
        })
    },

    Activate: {
        body: Joi.object({
            isRegisteredUser: Joi.boolean()
                    .required()
                    .example('true')
        })
    }

}