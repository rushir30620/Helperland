import express from "express";
import { CustomerPageRepository } from "../CustomerPages/cutomerPages.repository";
import { CustomerPageService } from "../CustomerPages/customerPages.service";
import { CustomerPageController } from "../CustomerPages/customerPages.controller";
import { UserRepository } from "../user/user.repository";
import { UserService } from "../user/user.service";
import { UserController } from "../user/user.controller";
import { FavouriteSPRepository } from "../CustomerPages/FavouriteSP/FavouriteSP.repository";
import { FavouriteSPService } from "../CustomerPages/FavouriteSP/FavouriteSP.service";
import { FavouriteSPController } from "../CustomerPages/FavouriteSP/Favourite.controller";

import { CustomerSchema } from "../CustomerPages/customerPages.model";
import { FavoriteSPSchema } from "../CustomerPages/FavouriteSP/Favourite.model";
import { celebrate } from "celebrate";

const router: express.Router = express.Router();

const customerRepo: CustomerPageRepository = new CustomerPageRepository();
const customerService: CustomerPageService = new CustomerPageService(customerRepo);
const customerController: CustomerPageController = new CustomerPageController(customerService);

const userrepo: UserRepository = new UserRepository();
const userservice: UserService = new UserService(userrepo);
const usercontroller: UserController = new UserController(userservice);

const favouriteRepo: FavouriteSPRepository = new FavouriteSPRepository();
const favouriteService: FavouriteSPService = new FavouriteSPService(favouriteRepo);
const favouriteController: FavouriteSPController = new FavouriteSPController(favouriteService);

const { RescheduleDateTime, CancelServiceRequest, Rating, UpdateUserDetails, EditAddUserAddress, ChangePassword} = CustomerSchema;
const { Favourite, Blocked } = FavoriteSPSchema;


////////////////////////////////////////// Dashboard Routes ////////////////////////////////////////////
router.get('/customer-dashboard',  usercontroller.validateTokenMiddleware, customerController.getServiceRequest);
router.get('/service-details/:addressId', usercontroller.validateTokenMiddleware, customerController.getServiceAddress);
router.post('/rescheduleDate/:serviceId', celebrate(RescheduleDateTime), usercontroller.validateTokenMiddleware, customerController.rescheduleTimeandDate, customerController.rescheduleIfTimeSlotNotConflicts);
router.delete('/cancelService/:id', celebrate(CancelServiceRequest), usercontroller.validateTokenMiddleware, customerController.cancelService);

///////////////////////////////////////// Service History Routes //////////////////////////////////////
router.get('/service-history', usercontroller.validateTokenMiddleware, usercontroller.validateTokenMiddleware, customerController.getServiceHistory);
router.post('/rateSP/:serviceRequestId', celebrate(Rating), usercontroller.validateTokenMiddleware, customerController.rateSP);

///////////////////////////////////////// Favourite/Unfavourite Routes //////////////////////////////////////
router.get("/favourite-sp", usercontroller.validateTokenMiddleware, favouriteController.getSPworkedwithUser);
router.post("/favourite-sp/:spId", celebrate(Favourite), usercontroller.validateTokenMiddleware, favouriteController.createFavouriteSP, favouriteController.Unfavourite);
router.post("/block-sp/:spId", celebrate(Blocked), usercontroller.validateTokenMiddleware, favouriteController.blockSP, favouriteController.Unblock);

///////////////////////////////////////// Update details Routes //////////////////////////////////////
router.get("/Mydetails",usercontroller.validateTokenMiddleware,customerController.getUserDetailById);
router.put('/updateMyDetails', celebrate(UpdateUserDetails), usercontroller.validateTokenMiddleware, customerController.updateMyDetails);
router.get("/getaddress", usercontroller.validateTokenMiddleware, customerController.getUserAddressesById);
router.put('/updateMyAddresses/:id', celebrate(EditAddUserAddress), usercontroller.validateTokenMiddleware, customerController.updateMyAddresses);
router.post('/add-new-address', usercontroller.validateTokenMiddleware,customerController.addNewAddress);
router.put("/deleteAddress/:addressId",  usercontroller.validateTokenMiddleware, customerController.deleteUserAddress);
router.put('/changePassword', celebrate(ChangePassword), usercontroller.validateTokenMiddleware, customerController.changePassword);


///////////////////////// Swagger /////////////////////////////////

/**
 *@swagger
 * definitions:
 *  Re-scheduleTimeDate:
 *   type: object
 *   properties:
 *    date:
 *     type: string
 *     description: date
 *     example: "6-03-2022"
 *    time:
 *     type: string
 *     description: time
 *     example: "16:30"
 *  ServiceCancle:
 *   type: object
 *   properties:
 *    Comments:
 *     type: string
 *     description: comments
 *     example: "I don't like this website"
 *  Rating:
 *   type: object
 *   properties:
 *    OnTimeArrival:
 *     type: float
 *     description: rating
 *     example: 1.5
 *    Friendly:
 *     type: float
 *     description: rating
 *     example: 1
 *    QualityOfService:
 *     type: float
 *     description: rating
 *     example: 2
 *    Comments:
 *     type: string
 *     description: comments
 *     example: "Very good service provider"
 *  Favourite:
 *   type: object
 *   properties:
 *    IsFavorite:
 *     type: boolean
 *     example: 'true'
 *  Blocked:
 *   type: object
 *   properties:
 *    IsBlocked:
 *     type: boolean
 *     example: 'true'
 *  UpdateUserDetails:
 *   type: object
 *   properties:
 *    FirstName:
 *     type: string
 *     description: first name of the user
 *     example: 'Rushikesh'
 *    LastName:
 *     type: string
 *     description: last name of the user
 *     example: 'Rathod'
 *    Mobile:
 *     type: string
 *     description: phone number of the user
 *     example: "9512617297"
 *    DateOfBirth:
 *     type: string
 *     description: birth date of the user
 *     example: "30-06-2001"
 *    LanguageId:
 *     type: integer
 *     description: preffered language 
 *     example: 1
 *  EditAddAddress:
 *     type: object
 *     properties:
 *      StreetName:
 *       type: string
 *       description: address
 *       example: 'Luhar street'
 *      HouseNumber:
 *       type: string
 *       description: house number
 *       example: '580'
 *      PostalCode:
 *       type: string
 *       description: zipcode
 *       example: '361210'
 *      City:
 *       type: string
 *       description: city
 *       example: 'Dhrol'
 *      Mobile:
 *       type: string
 *       description: phone number
 *       example: "9512617297"
 *  ChangePassword:
 *   type: object
 *   properties: 
 *    oldPassword:
 *     type: string
 *     description: password
 *     example: 'rushi'
 *    newPassword:
 *     type: string
 *     description: password
 *     example: '2vdveb'
 *    cpassword:
 *     type: string
 *     description: password
 *     example: '2vdveb'
 */

 ////////////////////////////////// Dashboard Swagger //////////////////////////////////////

/**
 * @swagger
 * /customer-dashboard:
 *  get:
 *   summary: Get service request
 *   description: get service request
 *   tags: 
 *    - Customer Dashboard Page
 *   parameters:
 *    - in: header
 *      name: auth
 *      schema:
 *       type: string
 *   responses:
 *    200:
 *     description: Service Request found
 *    401:
 *     description: Unauthorised user
 *    404:
 *     description: No Service Request Found
 *    500:
 *     description: Something went wrong
 */



/**
 * @swagger
 * /service-details/{addressId}:
 *  get:
 *   summary: Get service request details
 *   description: get service request details
 *   tags: 
 *    - Customer Dashboard Page
 *   parameters:
 *    - in: header
 *      name: auth
 *      schema:
 *       type: string
 *    - in: path
 *      name: id
 *      schema:
 *       type: integer
 *   responses:
 *    200:
 *     description: Service Request found
 *    401:
 *     description: No service address found!
 *    404:
 *     description: No Service Request Found
 *    500:
 *     description: Something went wrong
 */


/**
 * @swagger
 * /rescheduleDate/{id}:
 *  put:
 *   summary: update reschedule date and time
 *   description: update reschedule date and time
 *   tags: 
 *    - Customer Dashboard Page
 *   consumes:
 *    - application/json
 *   produces:
 *    - application/json
 *   parameters:
 *    - in: header
 *      name: auth
 *      schema:
 *       type: string
 *    - in: path
 *      name: servicerequestId
 *      schema:
 *       type: integer
 *   requestBody:
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/definitions/Re-scheduleTimeDate'
 *   responses:
 *    200:
 *     description: Your Service has been Rescheduled
 *    404:
 *     description: Service Request Not Found!!
 *    500:
 *     description: Something went wrong
 */

/**
 * @swagger
 * /cancelService/{id}:
 *  delete:
 *   summary: Cancel Service request
 *   description: feedback
 *   tags: 
 *    - Customer Dashboard Page
 *   parameters:
 *    - in: header
 *      name: auth
 *      schema:
 *       type: string
 *    - in: path
 *      name: id
 *      schema:
 *       type: integer
 *   requestBody:
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/definitions/ServiceCancle'
 *   responses:
 *    200:
 *     description: service request cancelled.
 *    401:
 *     description: Invalid login credential.
 *    404:
 *     description: service request not found.
 *    500:
 *     description: something went wrong.
 * 
 */

//////////////////////////////////// Service history Swagger //////////////////////////////////////

/**
 * @swagger
 * /service-history:
 *  get:
 *   summary: Service history
 *   description: Service history 
 *   tags: 
 *    - Customer Dashboard Page
 *   parameters:
 *    - in: header
 *      name: auth
 *      schema:
 *       type: string
 *   responses:
 *    200:
 *     description: Service history available.
 *    401:
 *     description: invalid login credential.
 *    404:
 *     description: service history not available.
 *    500:
 *     description: something went wrong.
 */

 /**
 * @swagger
 * /rateSP/{serviceRequestId}:
 *  post:
 *   summary: Service Provider Rating 
 *   description: service provider rating 
 *   tags: 
 *    - Customer Dashboard Page
 *   parameters:
 *    - in: header
 *      name: auth
 *      schema:
 *       type: string
 *    - in: path
 *      name: serviceRequestId
 *      schema:
 *       type: integer
 *   requestBody:
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/definitions/Rating'
 *   responses:
 *    200:
 *     description: Success.
 *    401:
 *     description: invalid login credential
 *    404:
 *     description: service provider not found
 *    500:
 *     description: internal server error.
 * 
 */


 /////////////////////////////////// Favorite And Blocked API //////////////////////////////////////////

 /**
 * @swagger
 * /favourite-sp:
 *  get:
 *   summary: Favorite Service Provider
 *   description: service provider worked with customer
 *   tags: 
 *    - Customer Dashboard Page
 *   parameters:
 *    - in: header
 *      name: auth
 *      schema:
 *       type: string
 *   responses:
 *    200:
 *     description: Service Provider found.
 *    401:
 *     description: invalid login credential or user not found.
 *    404:
 *     description: No Service Provider Worked With Customer.
 *    500:
 *     description: internal server error.
 */

  /**
 * @swagger
 * /favourite-sp/{spId}:
 *  post:
 *   summary: Favorite Service Provider
 *   description: Add or remove favorite service provider
 *   tags: 
 *    - Customer Dashboard Page
 *   parameters:
 *    - in: header
 *      name: auth
 *      schema:
 *       type: string
 *    - in: path
 *      name: helperId
 *      schema:
 *       type: integer
 *   requestBody:
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/definitions/Favourite'
 *   responses:
 *    200:
 *     description: Service Provider added your favourite list successfully.
 *    201:
 *     description: Service Provider Favourite Status updated successfully or Service Provider UnFavourite Status updated successfully.
 *    401:
 *     description: invalid login credential or user not found.
 *    402:
 *     description: Service Provider already in your favourite list
 *    403:
 *     description: Error!!! Service Provider cannot add your favourite list / Error!! while added service provider in your favourite list.
 *    404:
 *     description: Please enter valid input / No Service Provider Worked With Customer.
 *    500:
 *     description: internal server error.
 * 
 */

    /**
 * @swagger
 * /block-sp/{spId}:
 *  post:
 *   summary: Block Service Provider
 *   description: block or unblock service provider
 *   tags: 
 *    - Customer Dashboard Page
 *   parameters:
 *    - in: header
 *      name: auth
 *      schema:
 *       type: string
 *    - in: path
 *      name: helperId
 *      schema:
 *       type: integer
 *   requestBody:
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/definitions/Blocked'
 *   responses:
 *    200:
 *     description: Service Provider added your block list successfully.
 *    201:
 *     description: Service Provider Block Status updated successfully or Service Provider Unblock Status updated successfully.
 *    401:
 *     description: invalid login credential or user not found.
 *    402:
 *     description: Service Provider already in your block list
 *    403:
 *     description: Error!!! Service Provider cannot add your block list / Error!! while added service provider in your block list.
 *    404:
 *     description: Please enter valid input / No Service Provider Worked With Customer.
 *    500:
 *     description: internal server error.
 * 
 */


///////////////////////////////// My Settings API routes ////////////////////////////////////////

/**
 * @swagger
 * /Mydetails:
 *  get:
 *   summary: user details
 *   description:  user details.
 *   tags: 
 *    - Customer Dashboard Page
 *   parameters:
 *    - in: header
 *      name: auth
 *      schema:
 *       type: string
 *   responses:
 *    200:
 *     description: user detail found.
 *    401:
 *     description: invalid login credential.
 *    404:
 *     description: user not found.
 *    500:
 *     description: internal server error.
 */

/**
 * @swagger
 * /updateMyDetails:
 *  put:
 *   summary: Update User detail
 *   description: update user details.
 *   tags: 
 *    - Customer Dashboard Page
 *   parameters:
 *    - in: header
 *      name: auth
 *      schema:
 *       type: string
 *   requestBody:
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/definitions/UpdateUserDetails'
 *   responses:
 *    200:
 *     description: detail successfully updated
 *    401:
 *     description: invalid login credential.
 *    404:
 *     description: user not found.
 *    500:
 *     description: internal server error.
 */


/**
 * @swagger
 * /getaddress:
 *  get:
 *   summary: User addresses
 *   description: Display user addresses.
 *   tags: 
 *    - Customer Dashboard Page
 *   parameters:
 *    - in: header
 *      name: auth
 *      schema:
 *       type: string
 *   responses:
 *    200:
 *     description: addresses found.
 *    401:
 *     description: invalid login credential.
 *    404:
 *     description: address not found.
 *    500:
 *     description: internal server error.
 */


 /**
 * @swagger
 * /updateMyAddresses/{id}:
 *  put:
 *   summary: update or edit user address
 *   description: update or edit user address
 *   tags: 
 *    - Customer Dashboard Page
 *   parameters:
 *    - in: header
 *      name: auth
 *      schema:
 *       type: string
 *    - in: path
 *      name: id
 *      schema:
 *       type: integer
 *   requestBody:
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/definitions/EditAddAddress'
 *   responses:
 *    200:
 *     description: address updated successfully.
 *    401:
 *     description: invalid login credential.
 *    404:
 *     description: not found.
 *    500:
 *     description: something went wrong.
 * 
 */

 /**
 * @swagger
 * /add-new-address:
 *  post:
 *   summary: Create address
 *   description: add new address
 *   tags: 
 *    - Customer Dashboard Page
 *   parameters:
 *    - in: header
 *      name: auth
 *      schema:
 *       type: string
 *   requestBody:
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/definitions/EditAddAddress'
 *   responses:
 *    200:
 *     description: address created successfully.
 *    401:
 *     description: invalid login credential.
 *    500:
 *     description: internal server error.
 * 
 */

 /**
 * @swagger
 * /deleteAddress/{addressId}:
 *  put:
 *   summary: Delete existing address
 *   description: delete address.
 *   tags: 
 *    - Customer Dashboard Page
 *   parameters:
 *    - in: header
 *      name: auth
 *      schema:
 *       type: string
 *    - in: path
 *      name: addressId
 *      schema:
 *       type: integer
 *   responses:
 *    200:
 *     description: address deleted successfully.
 *    401:
 *     description: invalid login credential.
 *    500:
 *     description: internal server error.
 * 
 */

  /**
 * @swagger
 * /changePassword:
 *  put:
 *   summary: change user password
 *   description: please enter old and new password
 *   tags: 
 *    - Customer Dashboard Page
 *   parameters:
 *    - in: header
 *      name: auth
 *      schema:
 *       type: string
 *   requestBody:
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/definitions/ChangePassword'
 *   responses:
 *    200:
 *     description: Password change successfully.
 *    400:
 *     description: Please Enter same password.
 *    401:
 *     description: invalid login credential or unauthorised user or invalid or expired token.
 *    404:
 *     description: Incorrect Password! Please Enter correct password.
 *    500:
 *     description: internal server error.
 * 
 */

export = router;