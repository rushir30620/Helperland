import express from "express";
import { celebrate } from "celebrate";
import { UserRepository } from "../user/user.repository";
import { UserSchema } from "../user/user.model.validation";
import { UserService } from "../user/user.service";
import { UserController } from "../user/user.controller";
import { forgotPassRepository } from "../forgotPassword/forgot.pass.repository"
import { forgotPassService } from "../forgotPassword/forgot.pass.service"
import { forgotPassController } from "../forgotPassword/forgot.pass.controller"
import { forgotPassSchema } from "../forgotPassword/forgot.pass.model"
import { ServiceProviderRepository } from "../serviceProviders/service.provider.repository";
import { ServiceProviderService } from "../serviceProviders/service.provider.service";
import { ServiceProviderController } from "../serviceProviders/service.provider.controller";
import { ServiceProviderSchema } from "../serviceProviders/service.provider.model";

//adding JOI validation schema
const { add } = UserSchema;
const { addLogin } = UserSchema;
const { addForgotPass, addNewPassword } = forgotPassSchema;
const { addHelper, addHelperLogin} = ServiceProviderSchema;
const router: express.Router = express.Router();

//creating user repo pattern
const userrepo: UserRepository = new UserRepository();
const userservice: UserService = new UserService(userrepo);
const usercontroller: UserController = new UserController(userservice);

//creating helper repo pattern
const helperrepo: ServiceProviderRepository = new ServiceProviderRepository();
const helperservice: ServiceProviderService = new ServiceProviderService(helperrepo);
const helpercontroller: ServiceProviderController = new ServiceProviderController(helperservice);

//creating forgot password pattern
const forgotrepo: forgotPassRepository = new forgotPassRepository();
const forgotservice: forgotPassService = new forgotPassService(forgotrepo);
const forgotcontroller: forgotPassController = new forgotPassController(forgotservice);


//swagger schema

/**
 *@swagger
 * definitions:
 *  User:
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
 *    email:
 *     type: string
 *     description: email of the user
 *     example: 'rushir306@gmail.com'
 *    password:
 *     type: string
 *     description: password
 *     example: 'password of the user'
 *    cpassword:
 *     type: string
 *     description: password
 *     example: 'confirm password'
 *    mobile:
 *     type: string
 *     description: phone number
 *     example: '9512617297'
 *  Login:
 *   type: object
 *   properties:
 *    email:
 *     type: string
 *     description: email of the user
 *     example: 'rushir306@gmail.com'
 *    password:
 *     type: string
 *     description: password
 *  Reset:
 *   type: object
 *   properties:
 *    email:
 *     type: string
 *     description: email of the user
 *     example: 'rushir306@gmail.com'
 *  NewPassword:
 *   type: object
 *   properties:
 *    token:
 *     type: string
 *     description: token
 *    newPassword:
 *     type: string
 *     description: new password
 */


//////create user routes//////

/**
 * @swagger
 * /signup:
 *  post:
 *   summary: Customer Sign-up
 *   description: User registration
 *   tags: 
 *    - Authentication API
 *   requestBody:
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/definitions/User'
 *   responses:
 *    200:
 *     description: Email sent successfully, kindly active your account.
 *    400:
 *     description: Password does not match / email or mobile number already registered.
 *    500:
 *     description: Failure in registration.
 */

router.post('/signup', celebrate(add), usercontroller.createUsers);
router.get('/verify/user/:token', usercontroller.verifyEmail);

/**
 * @swagger
 * /login:
 *  post:
 *   summary: User Login
 *   description: Login
 *   tags: 
 *    - Authentication API
 *   requestBody:
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/definitions/Login'
 *   responses:
 *    200:
 *     description: Login successful.
 *    401:
 *     description: invalid username or password.
 *    500:
 *     description: something went wrong.
 */

router.post('/login', celebrate(addLogin), usercontroller.loginUser);
router.delete('/logout', usercontroller.deleteToken);


///////helper routes///////

/**
 * @swagger
 * /signup-helper:
 *  post:
 *   summary: Helper Signup
 *   description: Helper registration
 *   tags: 
 *    - Authentication API
 *   requestBody:
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/definitions/User'
 *   responses:
 *    200:
 *     description: Email sent successfully, kindly active your account.
 *    400:
 *     description: password does not match / email or mobile number already registered.
 *    500:
 *     description: Failure in registration.
 */

router.post('/signup-helper', celebrate(addHelper), helpercontroller.createServiceProvider);
router.get('/verify/helper/:token', helpercontroller.verifyEmail);
router.post('/login-helper', celebrate(addHelperLogin), helpercontroller.loginServiceProvider);
router.delete('/logout-helper', helpercontroller.deleteToken);


//////forgot password routes//////

/**
 * @swagger
 * /forgotPassword:
 *  post:
 *   summary: Forgot Password
 *   description: Enter your email ID
 *   tags: 
 *    - Authentication API
 *   requestBody:
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/definitions/Reset'
 *   responses:
 *    200:
 *     description: Email sent successfully.
 *    400:
 *     description: User doesn't exist.
 *    500:
 *     description: something went wrong.
 */
router.post('/forgotPassword', celebrate(addForgotPass), forgotcontroller.forgotPass);

/**
 * @swagger
 * /reset-password:
 *  post:
 *   summary: Reset Password
 *   description: Enter new password
 *   tags: 
 *    - Authentication API
 *   requestBody:
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/definitions/NewPassword'
 *   responses:
 *    200:
 *     description: Password successfully Reset .
 *    401:
 *     description: Incorrect or expired token.
 *    400:
 *     description: You used that password recently. Choose different password.
 *    500:
 *     description: something went wrong.
 */
router.post('/reset-Password', celebrate(addNewPassword), forgotcontroller.resetPass);

export = router;
