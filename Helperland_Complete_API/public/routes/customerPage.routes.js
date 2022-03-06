"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var express_1 = __importDefault(require("express"));
var cutomerPages_repository_1 = require("../CustomerPages/cutomerPages.repository");
var customerPages_service_1 = require("../CustomerPages/customerPages.service");
var customerPages_controller_1 = require("../CustomerPages/customerPages.controller");
var user_repository_1 = require("../user/user.repository");
var user_service_1 = require("../user/user.service");
var user_controller_1 = require("../user/user.controller");
var customerPages_model_1 = require("../CustomerPages/customerPages.model");
var celebrate_1 = require("celebrate");
var router = express_1.default.Router();
var customerRepo = new cutomerPages_repository_1.CustomerPageRepository();
var customerService = new customerPages_service_1.CustomerPageService(customerRepo);
var customerController = new customerPages_controller_1.CustomerPageController(customerService);
var userrepo = new user_repository_1.UserRepository();
var userservice = new user_service_1.UserService(userrepo);
var usercontroller = new user_controller_1.UserController(userservice);
var RescheduleDateTime = customerPages_model_1.CustomerSchema.RescheduleDateTime, CancelServiceRequest = customerPages_model_1.CustomerSchema.CancelServiceRequest, Rating = customerPages_model_1.CustomerSchema.Rating, UpdateUserDetails = customerPages_model_1.CustomerSchema.UpdateUserDetails, EditAddUserAddress = customerPages_model_1.CustomerSchema.EditAddUserAddress, ChangePassword = customerPages_model_1.CustomerSchema.ChangePassword;
////////////////////////////////////////// Dashboard Routes ////////////////////////////////////////////
router.get('/customer-dashboard', usercontroller.validateTokenMiddleware, customerController.getServiceRequest);
router.get('/service-details/:addressId', usercontroller.validateTokenMiddleware, customerController.getServiceAddress);
router.put('/rescheduleDate/:id', (0, celebrate_1.celebrate)(RescheduleDateTime), usercontroller.validateTokenMiddleware, customerController.rescheduleTimeandDate);
router.delete('/cancelService/:id', (0, celebrate_1.celebrate)(CancelServiceRequest), usercontroller.validateTokenMiddleware, customerController.cancelService);
///////////////////////////////////////// Service History Routes //////////////////////////////////////
router.get('/service-history', usercontroller.validateTokenMiddleware, usercontroller.validateTokenMiddleware, customerController.getServiceHistory);
router.post('/rateSP/:serviceRequestId', (0, celebrate_1.celebrate)(Rating), usercontroller.validateTokenMiddleware, customerController.rateSP);
///////////////////////////////////////// Service History Routes //////////////////////////////////////
router.get("/Mydetails", usercontroller.validateTokenMiddleware, customerController.getUserDetailById);
router.put('/updateMyDetails', (0, celebrate_1.celebrate)(UpdateUserDetails), usercontroller.validateTokenMiddleware, customerController.updateMyDetails);
router.get("/getaddress", usercontroller.validateTokenMiddleware, customerController.getUserAddressesById);
router.put('/updateMyAddresses/:id', (0, celebrate_1.celebrate)(EditAddUserAddress), usercontroller.validateTokenMiddleware, customerController.updateMyAddresses);
router.post('/add-new-address', usercontroller.validateTokenMiddleware, customerController.addNewAddress);
router.put("/deleteAddress/:addressId", usercontroller.validateTokenMiddleware, customerController.deleteUserAddress);
router.put('/changePassword', (0, celebrate_1.celebrate)(ChangePassword), usercontroller.validateTokenMiddleware, customerController.changePassword);
module.exports = router;
