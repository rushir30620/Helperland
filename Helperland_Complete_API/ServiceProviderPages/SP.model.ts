import { Joi } from "celebrate"


const header: Object = {
        authorization: Joi.string()
                .required()
};

export const BlockCustomerSchema = {

        Blocked: {
                body: Joi.object({
                        IsBlocked: Joi.boolean()
                                .required()
                                .example('true')
                })
        }
}

