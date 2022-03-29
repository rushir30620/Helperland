"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FavoriteSPSchema = void 0;
var celebrate_1 = require("celebrate");
var header = {
    authorization: celebrate_1.Joi.string()
        .required()
};
exports.FavoriteSPSchema = {
    Favourite: {
        body: celebrate_1.Joi.object({
            IsFavorite: celebrate_1.Joi.boolean()
                .required()
                .example('true')
        })
    },
    Blocked: {
        body: celebrate_1.Joi.object({
            IsBlocked: celebrate_1.Joi.boolean()
                .required()
                .example('true')
        })
    }
};
