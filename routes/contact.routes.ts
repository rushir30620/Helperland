import express from "express";
import { celebrate } from "celebrate";
import { ContactUsersRepository } from "../contactUs/contactUsers.repository";
import { ContactUserSchema } from "../contactUs/contactUsers.model.validation";
import { ContactUsersService } from "../contactUs/contactUsers.service";
import { ContactUsersController } from "../contactUs/contactUsers.controller";

const { add } = ContactUserSchema;
const router: express.Router = express.Router();

const repo: ContactUsersRepository = new ContactUsersRepository();
const service: ContactUsersService = new ContactUsersService(repo);
const controller: ContactUsersController = new ContactUsersController(service);


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

export = router;