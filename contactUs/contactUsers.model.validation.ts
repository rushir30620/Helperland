import { Joi } from 'celebrate';

const params: object = {
    id: Joi.number()
        .integer()
        .required()
        .description('Id of User')
};

export const ContactUserSchema = {
    add: {
        body: Joi.object({
            name: Joi.string()
                .required()
                .example('Rushikesh')
                .description('Name of Contact User'),
            email: Joi.string()
                .required()
                .example('abc@gmail.com')
                .description('Email Id of Contact User'),
            subjectType: Joi.string()
                .example('General')
                .description('Subject type of contact mail'),
            subject: Joi.string()
                .example('Unable to order service')
                .description('subject of mail'),
            phoneNumber: Joi.number()
                .integer()
                .required()
                .example(1234567890)
                .description('Mobile number of contact user'),
            message: Joi.string()
                .required()
                .example('Hello! This is my first api')
                .description('Message of contact user'),
            uploadFileName: Joi.string()
                .example('file.txt')
                .description('Contact user uploaded file name')
        })
    }
}