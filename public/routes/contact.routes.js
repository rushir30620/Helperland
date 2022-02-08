"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var express_1 = __importDefault(require("express"));
var contactUsers_repository_1 = require("../contactUs/contactUsers.repository");
var contactUsers_model_validation_1 = require("../contactUs/contactUsers.model.validation");
var contactUsers_service_1 = require("../contactUs/contactUsers.service");
var contactUsers_controller_1 = require("../contactUs/contactUsers.controller");
var add = contactUsers_model_validation_1.ContactUserSchema.add;
var router = express_1.default.Router();
var repo = new contactUsers_repository_1.ContactUsersRepository();
var service = new contactUsers_service_1.ContactUsersService(repo);
var controller = new contactUsers_controller_1.ContactUsersController(service);
//basic swagger
/**
 * @swagger
 * definitions:
 *  ContactUS:
 *   type: object
 *   properties:
 *    firstname:
 *     type: string
 *     description: Firstname of the Contact User
 *     example: 'Rushikesh'
 *    lastname:
 *     type: string
 *     description: Lastname of the Contact User
 *     example: 'Rathod'
 *    email:
 *     type: string
 *     description: email of the employee
 *     example: 'rushir306@gmail.com'
 *    subjectType:
 *     type: string
 *     description: Subject type of contact mail
 *     example: 'general'
 *    subject:
 *     type: string
 *     description: subject of mail
 *     example: 'Unable to order service'
 *    phoneNumber:
 *     type: number
 *     description: contact user phone number
 *     example: 1234567890
 *    file:
 *     type: file
 *     description: Uploaded file name
 */
//post swagger
/**
  * @swagger
  * /contactUsers:
  *  post:
  *   summary: create contact user
  *   description: create contact user for the organisation
  *   requestBody:
  *    content:
  *     multipart/form-data:
  *      schema:
  *       $ref: '#/definitions/ContactUS'
  *   responses:
  *    200:
  *     description: Contact user created succesfully
  *    500:
  *     description: failure in creating Contact user
  */
router.post('/contactUsers', controller.addContactUsers);
//get all contact user swagger
/**
 * @swagger
 * /contactUsers:
 *  get:
 *   summary: get all Contact Users
 *   description: get all Contact Users
 *   responses:
 *    200:
 *     description: success
 *    500:
 *     description: error
 */
router.get('/contactUsers', controller.getAllContactUsers);
//get contact user swagger
/**
 * @swagger
 * /contactUsers/{contactUsers_id}:
 *  get:
 *   summary: get Contact User
 *   description: get Contact User
 *   parameters:
 *    - in: path
 *      name: contactUsers_id
 *      schema:
 *       type: number
 *      required: true
 *      description: ID of the Contact User
 *      example: 2
 *   responses:
 *    200:
 *     description: success
 *    500:
 *     description: error
 */
router.get('/contactUsers/:id', controller.getContactUsersById);
//delete contact user swagger
/**
 * @swagger
 * /contactUsers/{contactUsers_id}:
 *  delete:
 *   summary: Delete contact User
 *   description: Delete Contact User
 *   parameters:
 *    - in: path
 *      name: contactUsers_id
 *      schema:
 *       type: number
 *      required: true
 *      description: id of the contact User
 *      example: 2
 *   responses:
 *    200:
 *     description: success
 *    500:
 *     description: error
 */
router.delete('/contactUsers/:id', controller.deleteContactUser);
module.exports = router;
