import express from "express";
import { AdminRepository } from "../Admin Pages/admin.repository";
import { AdminService } from "../Admin Pages/admin.service";
import { AdminController } from "../Admin Pages/admin.controller";
import { UserRepository } from "../user/user.repository";
import { UserService } from "../user/user.service";
import { UserController } from "../user/user.controller";
import { celebrate } from "celebrate";
import { AdminSchema } from "../Admin Pages/admin.model";

const router: express.Router = express.Router();

const adminRepo: AdminRepository = new AdminRepository();
const adminService: AdminService = new AdminService(adminRepo);
const adminController: AdminController = new AdminController(adminService);

const userrepo: UserRepository = new UserRepository();
const userservice: UserService = new UserService(userrepo);
const usercontroller: UserController = new UserController(userservice);

const { EditDetails, SearchById, SearchByPostalcode, SearchByEmail, SearchByName, SearchBySP, SearchByStatus, SearchByDate, Activate } = AdminSchema;

/////////////////////////////////////////// 7.1 Service Request API //////////////////////////////////////////////////

router.get('/all-service-requests', usercontroller.validateTokenMiddleware, adminController.getAllServiceRequests);
router.put('/reschedule-edit-service/:serviceId', celebrate(EditDetails), usercontroller.validateTokenMiddleware, adminController.rescheduleDateandTime, adminController.updateMyAddress);
router.delete('/cancle-service/:serviceRequestId', usercontroller.validateTokenMiddleware, adminController.cancelServiceRequestFromAdmin);

/////////////////////////////////////////// 7.2 Filters API //////////////////////////////////////////////////

router.get('/search-by-serviceId', celebrate(SearchById), usercontroller.validateTokenMiddleware, adminController.searchByServiceId);
router.get('/search-by-postalcode', celebrate(SearchByPostalcode), usercontroller.validateTokenMiddleware, adminController.searchByPostalcode);
router.get('/search-by-email', celebrate(SearchByEmail), usercontroller.validateTokenMiddleware, adminController.searchByEmail);
router.get('/search-by-name', celebrate(SearchByName), usercontroller.validateTokenMiddleware, adminController.searchByName);
router.get('/search-by-serviceProvider', celebrate(SearchBySP), usercontroller.validateTokenMiddleware, adminController.searchByServiceProvider);
router.get('/search-by-status', celebrate(SearchByStatus), usercontroller.validateTokenMiddleware, adminController.searchByStatus);
router.get('/search-by-hasIssue', usercontroller.validateTokenMiddleware, adminController.searchByHasIssue);
router.get('/search-by-date', celebrate(SearchByDate), usercontroller.validateTokenMiddleware, adminController.searchByDate);

/////////////////////////////////////////// 7.3 User Management API //////////////////////////////////////////////////

router.get('/get-all-users', usercontroller.validateTokenMiddleware, adminController.getUserList);
router.put('/activate-or-deactivate/:userId', celebrate(Activate), usercontroller.validateTokenMiddleware, adminController.activeUser, adminController.deactiveUser);

/////////////////////////////////////////// 7.4 Refund API //////////////////////////////////////////////////
router.put('/refund-amount/:serviceRequestId', usercontroller.validateTokenMiddleware, adminController.refundAmount);

////////////////////////////////////////// Swagger Schema ///////////////////////////////////////////////////////////

/**
 * @swagger
 * definitions:
 *  EditDetails:
 *   type: object
 *   properties:
 *    ServiceStartDate:
 *     type: string
 *     description: Service date
 *     example: '24-03-2022'
 *    ServiceStartTime:
 *     type: string
 *     description: Service time
 *     example: '10:00'
 *    serviceAddress:
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
 *    Comments: 
 *     type: string
 *     description: comments
 *     example: 'Reschedule service'
 *    Note:
 *     type: string
 *     description: Emp note
 *     example: 'your service reschedule'
 *  SearchById:
 *   type: object
 *   properties:
 *    ServiceRequestId:
 *     type: integer
 *     example: 1  
 *  SearchByPostalcode:
 *   type: object
 *   properties:
 *    ZipCode:
 *     type: string
 *     example: '361210'  
 *  SearchByEmail:
 *   type: object
 *   properties:
 *    email:
 *     type: string
 *     example: 'rushir306@gmail.com'  
 *  SearchByName:
 *   type: object
 *   properties:
 *    Name:
 *     type: string
 *     example: 'Rushikesh'  
 *  SearchBySP:
 *   type: object
 *   properties:
 *    SPName:
 *     type: string
 *     example: 'Virat'
 *  SearchByStatus:
 *   type: object
 *   properties:
 *    Status:
 *     type: string
 *     example: 'Completed'
 *  SearchByHasIssue:
 *   type: object
 *   properties:
 *    Status:
 *     type: string
 *     example: 'Completed'
 *  SearchByDate:
 *   type: object
 *   properties:
 *    ServiceStartDate:
 *     type: string
 *     example: '24-03-2022'
 *  Activate:
 *   type: object
 *   properties:
 *    isRegisteredUser:
 *     type: boolean 
 *     example: 'true'   
 */

//////////////// 7.1 Admin Dashboard API ///////////////////////

/**
 * @swagger
 * /all-service-requests:
 *  get:
 *   summary: All service requests
 *   description: Service requests
 *   tags:
 *    - Admin Pages
 *   parameters:
 *    - in: header
 *      name: auth
 *      schema:
 *       type: string
 *   responses:
 *    200:
 *     description: All service request.
 *    401:
 *     description: invalid login credential
 *    402:
 *     description: Service Request Not Found
 *    404:
 *     description: User Not Found
 *    500:
 *     description: something went wrong.
 */

/**
 * @swagger
 * /reschedule-edit-service/{serviceId}:
 *  put:
 *   summary: Update and Reschedule service detail
 *   description: Update and Reschedule service detail.
 *   tags: 
 *    - Admin Pages
 *   parameters:
 *    - in: header
 *      name: auth
 *      schema:
 *       type: string
 *   requestBody:
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/definitions/EditDetails'
 *   responses:
 *    200:
 *     description: Service Rescheduled Successfully.
 *    401:
 *     description: invalid login credential/Service provider not found/admin not found/User not found.
 *    402:
 *     description: Cannot update date and time/Service Request not found/ Error!! cannot updated your address.
 *    404: 
 *     description: This service cannot assign to this service provider. Please choose another service date and time.
 *    422:
 *     description: Please enter valid date
 *    500:
 *     description: internal server error.
 */

/**
 * @swagger
 * /cancle-upcoming-service/{serviceRequestId}:
 *  delete:
 *   summary: Cancel service request
 *   description: Cancel service request
 *   tags: 
 *    - Admin Pages 
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

//////////////// 7.2 filters API ///////////////////////

/**
 * @swagger
 * /search-by-serviceId:
 *  get:
 *   summary: search service by serviceId
 *   description: search service by serviceId.
 *   tags: 
 *    - Admin Pages
 *   parameters:
 *    - in: header
 *      name: auth
 *      schema:
 *       type: string
 *   requestBody:
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/definitions/SearchById'
 *   responses:
 *    200:
 *     description: Service request found.
 *    401:
 *     description: invalid login credential.
 *    402:
 *     description: Admin not found.
 *    404: 
 *     description: No similar service available for this service id.
 *    500:
 *     description: internal server error.
 */

/**
 * @swagger
 * /search-by-postalcode:
 *  get:
 *   summary: search service by postalcode
 *   description: search service by postalcode.
 *   tags: 
 *    - Admin Pages
 *   parameters:
 *    - in: header
 *      name: auth
 *      schema:
 *       type: string
 *   requestBody:
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/definitions/SearchByPostalcode'
 *   responses:
 *    200:
 *     description: Service request found.
 *    401:
 *     description: invalid login credential.
 *    402:
 *     description: Admin not found.
 *    404: 
 *     description: No similar service available for this postalcode.
 *    500:
 *     description: internal server error.
 */

/**
 * @swagger
 * /search-by-email:
 *  get:
 *   summary: search service by email
 *   description: search service by email.
 *   tags: 
 *    - Admin Pages
 *   parameters:
 *    - in: header
 *      name: auth
 *      schema:
 *       type: string
 *   requestBody:
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/definitions/SearchByEmail'
 *   responses:
 *    200:
 *     description: Service request found.
 *    401:
 *     description: invalid login credential.
 *    402:
 *     description: Admin not found.
 *    404: 
 *     description: No similar service available for this email.
 *    500:
 *     description: internal server error.
 */

/**
 * @swagger
 * /search-by-name:
 *  get:
 *   summary: search service by user name
 *   description: search service by user name.
 *   tags: 
 *    - Admin Pages
 *   parameters:
 *    - in: header
 *      name: auth
 *      schema:
 *       type: string
 *   requestBody:
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/definitions/SearchByName'
 *   responses:
 *    200:
 *     description: Service request found.
 *    401:
 *     description: invalid login credential.
 *    402:
 *     description: Admin not found.
 *    404: 
 *     description: No similar service available for this name.
 *    500:
 *     description: internal server error.
 */

/**
 * @swagger
 * /search-by-serviceProvider:
 *  get:
 *   summary: search service by service provider name
 *   description: search service by service provider name.
 *   tags: 
 *    - Admin Pages
 *   parameters:
 *    - in: header
 *      name: auth
 *      schema:
 *       type: string
 *   requestBody:
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/definitions/SearchBySP'
 *   responses:
 *    200:
 *     description: Service request found.
 *    401:
 *     description: invalid login credential.
 *    402:
 *     description: Admin not found.
 *    404: 
 *     description: No similar service available for this service provider.
 *    500:
 *     description: internal server error.
 */

/**
 * @swagger
 * /search-by-status:
 *  get:
 *   summary: search service by status
 *   description: search service by status.
 *   tags: 
 *    - Admin Pages
 *   parameters:
 *    - in: header
 *      name: auth
 *      schema:
 *       type: string
 *   requestBody:
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/definitions/SearchByStatus'
 *   responses:
 *    200:
 *     description: Service request found.
 *    401:
 *     description: invalid login credential.
 *    402:
 *     description: Admin not found.
 *    404: 
 *     description: No similar service available for this service status.
 *    500:
 *     description: internal server error.
 */

/**
 * @swagger
 * /search-by-hasIssue:
 *  get:
 *   summary: search service 
 *   description: search service .
 *   tags: 
 *    - Admin Pages
 *   parameters:
 *    - in: header
 *      name: auth
 *      schema:
 *       type: string
 *   requestBody:
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/definitions/SearchByHasIssue'
 *   responses:
 *    200:
 *     description: Service request found.
 *    401:
 *     description: invalid login credential.
 *    402:
 *     description: Admin not found.
 *    404: 
 *     description: No similar service available.
 *    500:
 *     description: internal server error.
 */

/**
 * @swagger
 * /search-by-date:
 *  get:
 *   summary: search service by date
 *   description: search service by date.
 *   tags: 
 *    - Admin Pages
 *   parameters:
 *    - in: header
 *      name: auth
 *      schema:
 *       type: string
 *   requestBody:
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/definitions/SearchByDate'
 *   responses:
 *    200:
 *     description: Service request found.
 *    401:
 *     description: invalid login credential.
 *    402:
 *     description: Admin not found.
 *    404: 
 *     description: No similar service available for this service date.
 *    500:
 *     description: internal server error.
 */

//////////////// 7.3 User Management API ///////////////////////

/**
 * @swagger
 * /get-all-users:
 *  get:
 *   summary: All users
 *   description: All users
 *   tags:
 *    - Admin Pages
 *   parameters:
 *    - in: header
 *      name: auth
 *      schema:
 *       type: string
 *   responses:
 *    200:
 *     description: All users.
 *    401:
 *     description: invalid login credential
 *    404:
 *     description: User Not Found
 *    500:
 *     description: something went wrong.
 */


/**
 * @swagger
 * /activate-or-deactivate/{userId}:
 *  put:
 *   summary: Activate or Deactivate Service Provider
 *   description: Activate or Deactivate Service Provider
 *   tags: 
 *    - Admin Pages
 *   parameters:
 *    - in: header
 *      name: auth
 *      schema:
 *       type: string
 *   requestBody:
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/definitions/Activate'
 *   responses:
 *    200:
 *     description: Service Provider Activate Successfully/Service Provider De-Activate Successfully.
 *    201:
 *     description: Service Provider Already activate/Service Provider Already deactivate.
 *    401:
 *     description: invalid login credential/admin not found.
 *    402:
 *     description: Error!!! Service Provider cannot activate/Error!!! Service Provider cannot deactivate.
 *    404: 
 *     description: New service provider not found.
 *    500:
 *     description: internal server error.
 */


export = router;