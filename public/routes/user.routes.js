"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var express_1 = __importDefault(require("express"));
var celebrate_1 = require("celebrate");
var user_repository_1 = require("../user/user.repository");
var user_model_validation_1 = require("../user/user.model.validation");
var user_service_1 = require("../user/user.service");
var user_controller_1 = require("../user/user.controller");
var forgot_pass_repository_1 = require("../forgotPassword/forgot.pass.repository");
var forgot_pass_service_1 = require("../forgotPassword/forgot.pass.service");
var forgot_pass_controller_1 = require("../forgotPassword/forgot.pass.controller");
var forgot_pass_model_1 = require("../forgotPassword/forgot.pass.model");
var service_provider_repository_1 = require("../serviceProviders/service.provider.repository");
var service_provider_service_1 = require("../serviceProviders/service.provider.service");
var service_provider_controller_1 = require("../serviceProviders/service.provider.controller");
var service_provider_model_1 = require("../serviceProviders/service.provider.model");
var add = user_model_validation_1.UserSchema.add;
var addLogin = user_model_validation_1.UserSchema.addLogin;
var addForgotPass = forgot_pass_model_1.forgotPassSchema.addForgotPass, addNewPassword = forgot_pass_model_1.forgotPassSchema.addNewPassword;
var addHelper = service_provider_model_1.ServiceProviderSchema.addHelper, addHelperLogin = service_provider_model_1.ServiceProviderSchema.addHelperLogin;
var router = express_1.default.Router();
var userrepo = new user_repository_1.UserRepository();
var userservice = new user_service_1.UserService(userrepo);
var usercontroller = new user_controller_1.UserController(userservice);
var helperrepo = new service_provider_repository_1.ServiceProviderRepository();
var helperservice = new service_provider_service_1.ServiceProviderService(helperrepo);
var helpercontroller = new service_provider_controller_1.ServiceProviderController(helperservice);
var forgotrepo = new forgot_pass_repository_1.forgotPassRepository();
var forgotservice = new forgot_pass_service_1.forgotPassService(forgotrepo);
var forgotcontroller = new forgot_pass_controller_1.forgotPassController(forgotservice);
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
//create user routes
/**
 * @swagger
 * /signup:
 *  post:
 *   summary: Customer Sign-up
 *   description: User registration
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
router.post('/signup', (0, celebrate_1.celebrate)(add), usercontroller.createUsers);
router.get('/verify/user/:token', usercontroller.verifyEmail);
/**
 * @swagger
 * /login:
 *  post:
 *   summary: User Login
 *   description: Login
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
router.post('/login', (0, celebrate_1.celebrate)(addLogin), usercontroller.loginUser);
router.delete('/logout', usercontroller.deleteToken);
//helper routes
/**
 * @swagger
 * /signup-helper:
 *  post:
 *   summary: Helper Signup
 *   description: Helper registration
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
router.post('/signup-helper', (0, celebrate_1.celebrate)(addHelper), helpercontroller.createServiceProvider);
router.get('/verify/helper/:token', helpercontroller.verifyEmail);
router.post('/login-helper', (0, celebrate_1.celebrate)(addHelperLogin), helpercontroller.loginServiceProvider);
router.delete('/logout-helper', helpercontroller.deleteToken);
//forgot password routes
/**
 * @swagger
 * /forgotPassword:
 *  post:
 *   summary: Forgot Password
 *   description: Enter your email ID
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
router.post('/forgotPassword', (0, celebrate_1.celebrate)(addForgotPass), forgotcontroller.forgotPass);
/**
 * @swagger
 * /reset-password:
 *  post:
 *   summary: Reset Password
 *   description: Enter new password
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
router.post('/reset-Password', (0, celebrate_1.celebrate)(addNewPassword), forgotcontroller.resetPass);
module.exports = router;
