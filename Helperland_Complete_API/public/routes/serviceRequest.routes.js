"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var express_1 = __importDefault(require("express"));
var bookservice_repository_1 = require("../ServiceRequest/bookservice.repository");
var bookservice_service_1 = require("../ServiceRequest/bookservice.service");
var bookservice_controller_1 = require("../ServiceRequest/bookservice.controller");
var bookservice_model_1 = require("../ServiceRequest/bookservice.model");
var user_repository_1 = require("../user/user.repository");
var user_service_1 = require("../user/user.service");
var user_controller_1 = require("../user/user.controller");
var zipCode = bookservice_model_1.ServiceBookSchema.zipCode, userAddress = bookservice_model_1.ServiceBookSchema.userAddress, createService = bookservice_model_1.ServiceBookSchema.createService;
var router = express_1.default.Router();
var bookRepo = new bookservice_repository_1.ServiceBookRepository();
var bookService = new bookservice_service_1.ServiceBook(bookRepo);
var bookController = new bookservice_controller_1.ServiceBookController(bookService);
var userrepo = new user_repository_1.UserRepository();
var userservice = new user_service_1.UserService(userrepo);
var usercontroller = new user_controller_1.UserController(userservice);
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
router.post('/schedule-service', usercontroller.validateTokenMiddleware, bookController.tokenDecode, bookController.createScheduleRequest);
/**
 * @swagger
 * /add-new-address:
 *  post:
 *   summary: Add new Address
 *   description: Enter your address
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
router.post('/add-new-address', usercontroller.validateTokenMiddleware, bookController.addNewAddress);
/**
 * @swagger
 * /get-address:
 *  get:
 *   summary: Get existing user addresses
 *   description: get existing addresses
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
router.get('/get-address', usercontroller.validateTokenMiddleware, bookController.getExistingAddress);
/**
 * @swagger
 * /get-favourite-sp:
 *  get:
 *   summary: Get favorite and blocked Service Provider
 *   description: favorite and blocked Service Provider
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
router.get('/get-favourite-sp', usercontroller.validateTokenMiddleware, bookController.getFavoriteAndBlockedSP);
module.exports = router;
