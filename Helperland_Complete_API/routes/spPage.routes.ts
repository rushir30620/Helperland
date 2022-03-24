import express from "express";
import { SPPageRepository } from "../ServiceProviderPages/SP.repository";
import { SPPageService } from "../ServiceProviderPages/SP.service";
import { SPPageController } from "../ServiceProviderPages/SP.controller";
import { UserRepository } from "../user/user.repository";
import { UserService } from "../user/user.service";
import { UserController } from "../user/user.controller";
import { celebrate } from "celebrate";
import { SPPageSchema } from "../ServiceProviderPages/SP.model";

const router: express.Router = express.Router();

const spRepo: SPPageRepository = new SPPageRepository();
const spService: SPPageService = new SPPageService(spRepo);
const spController: SPPageController = new SPPageController(spService);

const userrepo: UserRepository = new UserRepository();
const userservice: UserService = new UserService(userrepo);
const usercontroller: UserController = new UserController(userservice);

const { Blocked, UpdateSPDetails, ChangeSPPassword } = SPPageSchema;

/////////////////////////////////////////// 6.1 Accept Service Request API ////////////////////////////////////////////////

router.get('/service-request', usercontroller.validateTokenMiddleware, spController.getAllNewServiceRequests);
router.get('/service-request-detail/:addressId', usercontroller.validateTokenMiddleware, spController.getServiceRequestDetail);
router.put('/accept-service/:serviceRequestId', usercontroller.validateTokenMiddleware, spController.IsServiceAvailableOrNot, spController.acceptRequest);

/////////////////////////////////////////// 6.2 Upcoming Service Request API ////////////////////////////////////////////////

router.get('/upcoming-service', usercontroller.validateTokenMiddleware, spController.getUpcomingService);
router.delete('/cancle-upcoming-service/:serviceRequestId', usercontroller.validateTokenMiddleware, spController.cancelServiceRequest);
router.put('/complete-service/:serviceRequestId', usercontroller.validateTokenMiddleware, spController.completeService);

/////////////////////////////////////////// 6.4 Service History API ////////////////////////////////////////////////

router.get('/service-history-sp', usercontroller.validateTokenMiddleware, spController.getSPServiceHistory);
router.get('/service-history-detail/:addressId', usercontroller.validateTokenMiddleware, spController.getServiceRequestDetail);
router.get('/download-history', usercontroller.validateTokenMiddleware, spController.downloadExcelData);

/////////////////////////////////////////// 6.5 Service Provider Ratings API ////////////////////////////////////////////////

router.get('/ratingsp', usercontroller.validateTokenMiddleware, spController.getSPRatings);

/////////////////////////////////////////// 6.6 Block-Unblock User API ////////////////////////////////////////////////

router.get('/get-pastWork-user', usercontroller.validateTokenMiddleware, spController.getUserWorkedWithSP);
router.put('/block-unblock-user/:customerId',celebrate(Blocked), usercontroller.validateTokenMiddleware, spController.createBlockUser, spController.unBlockUser);

/////////////////////////////////////////// 6.7 My Settings API ////////////////////////////////////////////////

router.get('/spDetails', usercontroller.validateTokenMiddleware, spController.getUserDetailById);
router.put('/update-detail',  celebrate(UpdateSPDetails), usercontroller.validateTokenMiddleware, spController.updateMyDetails, spController.updateAddMyAddress);
router.put('/changeSPPassword', celebrate(ChangeSPPassword), usercontroller.validateTokenMiddleware, spController.changeSPPassword);


//////////////////////////////// Swagger Schema /////////////////////////////////////

/**
 *@swagger
 * definitions:
 *  Blocked:
 *   type: object
 *   properties:
 *    IsBlocked:
 *     type: boolean
 *     example: 'true'
 *  UpdateSPDetails:
 *   type: object
 *   properties:
 *    firstName:
 *     type: string
 *     description: first name of the user
 *     example: 'Rushikesh'
 *    lastName:
 *     type: string
 *     description: last name of the user
 *     example: 'Rathod'
 *    mobile:
 *     type: string
 *     description: phone number
 *     example: "9512617297"
 *    dateOfBirth:
 *     type: string
 *     description: birth date
 *     example: "30-06-2001"
 *    nationalityId:
 *     type: integer
 *     description: nationality
 *     example: 1 
 *    gender:
 *     type: string
 *     description: gender
 *     example: "Male"
 *    userAddress:
 *      type: object
 *      properties:
 *       StreetName:
 *        type: string
 *        description: address
 *        example: 'Luhar stree, mochi bazar'
 *       HouseNumber:
 *        type: string
 *        description: house number
 *        example: '465'
 *       PostalCode:
 *        type: string
 *        description: zipcode
 *        example: '361210'
 *       City:
 *        type: string
 *        description: city
 *        example: 'Dhrol'
 *  ChangeSPPassword:
 *   type: object
 *   properties: 
 *    oldPassword:
 *     type: string
 *     description: password
 *     example: '12345'
 *    newPassword:
 *     type: string
 *     description: password
 *     example: 'Rushi3060'
 *    cpassword:
 *     type: string
 *     description: password
 *     example: 'Rushi3060'
 */


 /**
 * @swagger
 * /service-request:
 *  get:
 *   summary: New serivce requests 
 *   description: Service requests
 *   tags: 
 *    - Service Provider Dashboard Page
 *   parameters:
 *    - in: header
 *      name: auth
 *      schema:
 *       type: string
 *   responses:
 *    200:
 *     description: service request accepted successfully.
 *    401:
 *     description: invalid login credential
 *    404:
 *     description: you have not provided zipcode in your detail please update your detail to get requests available in your entered zipcode area / service requests not found / helper not found.
 *    500:
 *     description: something went wrong.
 */

/**
 * @swagger
 * /accept-service/{serviceRequestId}:
 *  put:
 *   summary: Accept service request
 *   description: helper can accept new service request
 *   tags: 
 *    - Service Provider Dashboard Page 
 *   parameters:
 *    - in: header
 *      name: auth
 *      schema:
 *       type: string
 *    - in: path
 *      name: requestId
 *      schema:
 *       type: integer
 *   responses:
 *    200:
 *     description: service request accepted successfully.
 *    400: 
 *     description: proper input not found in request.
 *    401:
 *     description: invalid login credential.
 *    404:
 *     description: no service request detail found for this request / error in accepting service request.
 *    422:
 *     description: another service request has already been assigned which has time overlap with this service request. You can’t pick this one! / this service request is no more available. It has been assigned to another provider
 *    500:
 *     description: internal server error.
 */

 
 /**
 * @swagger
 * /service-request-detail/{addressId}:
 *  get:
 *   summary: Service request detail
 *   description: display service request detail
 *   tags: 
 *    - Service Provider Dashboard Page 
 *   parameters:
 *    - in: header
 *      name: auth
 *      schema:
 *       type: string
 *    - in: path
 *      name: requestId
 *      schema:
 *       type: integer
 *   responses:
 *    200:
 *     description: sevice request detail.
 *    401:
 *     description: invalid login credential.
 *    404:
 *     description: request detail not available.
 *    500:
 *     description: internal server error.
 * 
 */

 //Upcoming Services

 /**
 * @swagger
 * /upcoming-service:
 *  get:
 *   summary: Upcoming service request
 *   description: display upcoming service requests
 *   tags: 
 *    - Service Provider Dashboard Page 
 *   parameters:
 *    - in: header
 *      name: auth
 *      schema:
 *       type: string
 *   responses:
 *    200:
 *     description: upcoming service requests.
 *    401:
 *     description: invalid login credential.
 *    404:
 *     description: no upcoming service requests found.
 *    500:
 *     description: internal server error.
 * 
 */

/**
 * @swagger
 * /cancle-upcoming-service/{serviceRequestId}:
 *  delete:
 *   summary: Cancel service request
 *   description: Cancel service request
 *   tags: 
 *    - Service Provider Dashboard Page 
 *   parameters:
 *    - in: header
 *      name: auth
 *      schema:
 *       type: string
 *    - in: path
 *      name: requestId
 *      schema:
 *       type: integer
 *   responses:
 *    200:
 *     description: service request cancelled successfully.
 *    400:
 *     description: service request id not found.
 *    401:
 *     description: invalid login credential.
 *    404:
 *     description: service request detail not found.
 *    422:
 *     description: error in cancelling service request
 *    500:
 *     description: internal server error.
 */

/**
 * @swagger
 * /complete-service/:serviceRequestId:
 *  put:
 *   summary: Complete service request
 *   description: complete service request
 *   tags: 
 *    - Service Provider Dashboard Page 
 *   parameters:
 *    - in: header
 *      name: auth
 *      schema:
 *       type: string
 *    - in: path
 *      name: requestId
 *      schema:
 *       type: integer
 *   responses:
 *    200:
 *     description: service request completed successfully.
 *    400:
 *     description: You can not complete service request before end time / service request id not found.
 *    401:
 *     description: invalid login credential or Unauthorised user or invalid or expired token.
 *    404:
 *     description: service request detail not found.
 *    422:
 *     description: error in updating service request
 *    500:
 *     description: internal server error.
 */

//Service History

/**
 * @swagger
 * /service-history-sp:
 *  get:
 *   summary:  Serivce request history 
 *   description: service request history
 *   tags: 
 *    - Service Provider Dashboard Page 
 *   parameters:
 *    - in: header
 *      name: auth
 *      schema:
 *       type: string
 *   responses:
 *    200:
 *     description: service request history.
 *    401:
 *     description: invalid login credential.
 *    404:
 *     description: service request history not found in past / service request not found.
 *    500:
 *     description: internal server error.
 */

/**
 * @swagger
 * /service-history-detail/{addressId}:
 *  get:
 *   summary: Service request detail
 *   description: display service request detail
 *   tags: 
 *    - Service Provider Dashboard Page 
 *   parameters:
 *    - in: header
 *      name: auth
 *      schema:
 *       type: string
 *    - in: path
 *      name: requestId
 *      schema:
 *       type: integer
 *   responses:
 *    200:
 *     description: sevice request detail.
 *    401:
 *     description: invalid login credential.
 *    404:
 *     description: request detail not available.
 *    500:
 *     description: internal server error.
 * 
 */

  /**
 * @swagger
 * /download-history:
 *  get:
 *   summary: History download
 *   description: download history
 *   tags: 
 *    - Service Provider Dashboard Page 
 *   parameters:
 *    - in: header
 *      name: auth
 *      schema:
 *       type: string
 *   responses:
 *    200:
 *     description: sevice request detail.
 *    401:
 *     description: invalid login credential.
 *    404:
 *     description: no data to export.
 *    500:
 *     description: internal server error.
 * 
 */

//Ratings

/**
 * @swagger
 * /ratingsp:
 *  get:
 *   summary:  Ratings
 *   description:  display ratings of service provider given by customer
 *   tags: 
 *    - Service Provider Dashboard Page 
 *   parameters:
 *    - in: header
 *      name: auth
 *      schema:
 *       type: string
 *   responses:
 *    200:
 *     description: Service provider ratings.
 *    401:
 *     description: invalid login credential.
 *    404:
 *     description: ratings / data not found.
 *    500:
 *     description: internal server error.
 */

//Block Unblock Customer

 /**
 * @swagger
 * /get-pastWork-user:
 *  get:
 *   summary: Display customers
 *   description: list of customers worked with service provider in past
 *   tags: 
 *    - Service Provider Dashboard Page 
 *   parameters:
 *    - in: header
 *      name: auth
 *      schema:
 *       type: string
 *   responses:
 *    200:
 *     description: customers.
 *    401:
 *     description: invalid login credential.
 *    404:
 *     description: customers not found.
 *    500:
 *     description: internal server error.
 * 
 */

 /**
 * @swagger
 * /block-unblock-user/{customerId}:
 *  put:
 *   summary: Block unblock customer
 *   description: block unblock customer worked with service provider in past
 *   tags: 
 *    - Service Provider Dashboard Page 
 *   parameters:
 *    - in: header
 *      name: auth
 *      schema:
 *       type: string
 *    - in: path
 *      name: userId
 *      schema:
 *       type: integer
 *   requestBody:
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/definitions/Blocked'
 *   responses:
 *    200:
 *     description: customer successfully added in block / unblock list.
 *    201:
 *     description: customer alraedy in blocked/unblocked list.
 *    400: 
 *     description: helper has not worked for this customer. / proper input not found in request body.
 *    401:
 *     description: invalid login credential.
 *    404:
 *     description: no service provider found worked with customer in past / no customer in blocklist to unblock.
 *    422:
 *     description: error in adding blocked / unblocked list.
 *    500:
 *     description: internal server error.
 */

//My settings

//-My details//

/**
 * @swagger
 * /spDetails:
 *  get:
 *   summary: Service provider detail
 *   description: display service provider details.
 *   tags: 
 *    - Service Provider Dashboard Page 
 *   parameters:
 *    - in: header
 *      name: auth
 *      schema:
 *       type: string
 *   responses:
 *    200:
 *     description: detail found.
 *    401:
 *     description: invalid login credential.
 *    404:
 *     description: user not found.
 *    400:
 *     description: proper input not found in request.
 *    500:
 *     description: internal server error.
 */

/**
 * @swagger
 * /update-detail:
 *  put:
 *   summary: Update service provider detail
 *   description: edit user details to update.
 *   tags: 
 *    - Service Provider Dashboard Page
 *   parameters:
 *    - in: header
 *      name: auth
 *      schema:
 *       type: string
 *   requestBody:
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/definitions/UpdateSPDetails'
 *   responses:
 *    200:
 *     description: details updated successfully.
 *    400:
 *     description: proper input not found in request.
 *    401:
 *     description: invalid login credential.
 *    422: 
 *     description: error in updating user detail.
 *    500:
 *     description: internal server error.
 */

 //Change Password

  /**
 * @swagger
 * /changeSPPassword:
 *  put:
 *   summary: Change password
 *   description: enter old password and new password.
 *   tags: 
 *    - Service Provider Dashboard Page
 *   parameters:
 *    - in: header
 *      name: auth
 *      schema:
 *       type: string
 *   requestBody:
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/definitions/ChangeSPPassword'
 *   responses:
 *    200:
 *     description: password changed successfully.
 *    400:
 *     description: incorrect old password or new Password and confirm Password must be same.
 *    401:
 *     description: invalid login credential.
 *    422:
 *     description: error in changing password.
 *    500:
 *     description: internal server error.
 * 
 */

export = router;