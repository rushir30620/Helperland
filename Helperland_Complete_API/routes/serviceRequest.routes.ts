import express from "express";
import { celebrate } from "celebrate";
import { ServiceBookRepository } from "../ServiceRequest/bookservice.repository";
import { ServiceBook } from "../ServiceRequest/bookservice.service";
import { ServiceBookController } from "../ServiceRequest/bookservice.controller";
import { ServiceBookSchema } from "../ServiceRequest/bookservice.model";

import { UserRepository } from "../user/user.repository";
import { UserService } from "../user/user.service";
import { UserController } from "../user/user.controller";

const { zipCode, userAddress, createService} = ServiceBookSchema;
const router: express.Router = express.Router();

const bookRepo: ServiceBookRepository = new ServiceBookRepository();
const bookService: ServiceBook = new ServiceBook(bookRepo);
const bookController: ServiceBookController = new ServiceBookController(bookService);

const userrepo: UserRepository = new UserRepository();
const userservice: UserService = new UserService(userrepo);
const usercontroller: UserController = new UserController(userservice);


/**
 *@swagger
 * definitions:
 *  ServiceRequest:
 *   type: object
 *   properties:
 *    ServiceId:
 *     type: integer
 *     description: serviceId
 *     example: 1
 *    ServiceStartDate:
 *     type: date
 *     description: service date
 *     example: '12-02-22'
 *    ServiceStartTime:
 *     type: string
 *     description: service time
 *     example: '08:00'
 *    ServiceHours:
 *     type: integer
 *     description: service hours
 *     example: 3
 *    Comments:
 *     type: string
 *     description: service comment
 *     example: 'Hi Hello'
 *    PaymentDue:
 *     type: boolean
 *     example: 'true'
 *    HasPets:
 *     type: boolean
 *     example: 'true'
 *    ServiceRequestAddress:
 *     type: object
 *     properties:
 *      Addressline1:
 *       type: string
 *       description: addressline 1
 *       example: 'Luhar street, mochi bazar, dhrol'
 *      Addressline2:
 *       type: string
 *       description: street number or house number
 *       example: '380'
 *      City:
 *       type: string
 *       description: city
 *       example: 'Dhrol'
 *      State:
 *       type: string
 *       description: state
 *       example: 'Gujarat'
 *      Mobile:
 *       type: string
 *       description: phone number
 *       example: '9512617297'
 *      PostalCode:
 *       type: string
 *       description: zipcode
 *       example: '361210'
 *    ExtraService:
 *     type: array
 *     items:
 *      type: object
 *      properties:
 *       ServiceExtraId:
 *        type: integer
 *        description: extra service Id
 *        example: 1
 *  CheckZipCode:
 *   type: object
 *   properties:
 *    postalcode:
 *     type: string
 *     description: postal code
 *     example: '361210'
 *  UserAddress:
 *     type: object
 *     properties:
 *      Addressline1:
 *       type: string
 *       description: address
 *       example: 'Luhar street, mochi bazar, dhrol'
 *      Addressline2:
 *       type: string
 *       description: street number or house number
 *       example: '380'
 *      City:
 *       type: string
 *       description: city
 *       example: 'Dhrol'
 *      State:
 *       type: string
 *       description: state
 *       example: 'Gujarat'
 *      IsDefault:
 *       type: boolean
 *       example: 'true'
 *      IsDeleted:
 *       type: boolean
 *       example: 'false'
 *      Mobile:
 *       type: string
 *       description: phone number
 *       example: '9512617297'
 */


 /**
 * @swagger
 * /setup-service:
 *  post:
 *   summary: Check Availibility
 *   description: Enter your area's zipcode
 *   tags: 
 *    - Book Service API
 *   requestBody:
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/definitions/CheckZipCode'
 *   responses:
 *    200:
 *     description: service provider found
 *    401:
 *     description: Unauthorised user
 *    404:
 *     description: We are not providing service in this area.
 *    500:
 *     description: Something went wrong.
 * 
 */
router.post('/setup-service', usercontroller.validateTokenMiddleware, bookController.serviceSetup);


/**
 * @swagger
 * /schedule-service:
 *  post:
 *   summary: Schedule service
 *   description: schedule service
 *   tags: 
 *    - Book Service API
 *   securityDefinitions:
 *    JWT: 
 *     schema:
 *     type: apiKey
 *     name: authorization
 *     in: header
 *   requestBody:
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/definitions/ServiceRequest'
 *   responses:
 *    200:
 *     description: service has been submitted successfully
 *    401:
 *     description: Unauthorised user
 *    404:
 *     description: user not found
 *    500:
 *     description: Something went wrong
 */
router.post('/schedule-service', usercontroller.validateTokenMiddleware,bookController.tokenDecode, bookController.createScheduleRequest);


/**
 * @swagger
 * /add-new-address:
 *  post:
 *   summary: Add new Address
 *   description: Enter your address
 *   tags: 
 *    - Book Service API
 *   requestBody:
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/definitions/UserAddress'
 *   responses:
 *    200:
 *     description: address created successfully
 *    401:
 *     description: Unauthorised user
 *    404:
 *     description: user not found
 *    500:
 *     description: Something went wrong
 */
router.post('/add-new-address', usercontroller.validateTokenMiddleware,bookController.addNewAddress);


/**
 * @swagger
 * /get-address:
 *  get:
 *   summary: Get existing user addresses
 *   description: get existing addresses
 *   tags: 
 *    - Book Service API
 *   responses:
 *    200:
 *     description: User Address found
 *    401:
 *     description: Unauthorised user
 *    404:
 *     description: Address not found
 *    500:
 *     description: Something went wrong
 */
router.get('/get-address', usercontroller.validateTokenMiddleware,bookController.getExistingAddress);


/**
 * @swagger
 * /get-favourite-sp:
 *  get:
 *   summary: Get favorite and blocked Service Provider
 *   description: favorite and blocked Service Provider
 *   tags: 
 *    - Book Service API
 *   responses:
 *    200:
 *     description: Service Provider Found
 *    401:
 *     description: Unauthorised user
 *    404:
 *     description: Service Provider not found
 *    500:
 *     description: Something went wrong
 */
router.get('/get-favourite-sp', usercontroller.validateTokenMiddleware,bookController.getFavoriteAndBlockedSP);

export = router;