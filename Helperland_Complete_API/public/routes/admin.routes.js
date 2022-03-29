"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var express_1 = __importDefault(require("express"));
var admin_repository_1 = require("../Admin Pages/admin.repository");
var admin_service_1 = require("../Admin Pages/admin.service");
var admin_controller_1 = require("../Admin Pages/admin.controller");
var user_repository_1 = require("../user/user.repository");
var user_service_1 = require("../user/user.service");
var user_controller_1 = require("../user/user.controller");
var celebrate_1 = require("celebrate");
var admin_model_1 = require("../Admin Pages/admin.model");
var router = express_1.default.Router();
var adminRepo = new admin_repository_1.AdminRepository();
var adminService = new admin_service_1.AdminService(adminRepo);
var adminController = new admin_controller_1.AdminController(adminService);
var userrepo = new user_repository_1.UserRepository();
var userservice = new user_service_1.UserService(userrepo);
var usercontroller = new user_controller_1.UserController(userservice);
var EditDetails = admin_model_1.AdminSchema.EditDetails, SearchById = admin_model_1.AdminSchema.SearchById, SearchByPostalcode = admin_model_1.AdminSchema.SearchByPostalcode, SearchByEmail = admin_model_1.AdminSchema.SearchByEmail, SearchByName = admin_model_1.AdminSchema.SearchByName, SearchBySP = admin_model_1.AdminSchema.SearchBySP, SearchByStatus = admin_model_1.AdminSchema.SearchByStatus, SearchByDate = admin_model_1.AdminSchema.SearchByDate, Activate = admin_model_1.AdminSchema.Activate;
/////////////////////////////////////////// 7.1 Service Request API //////////////////////////////////////////////////
router.get('/all-service-requests', usercontroller.validateTokenMiddleware, adminController.getAllServiceRequests);
router.put('/reschedule-edit-service/:serviceId', (0, celebrate_1.celebrate)(EditDetails), usercontroller.validateTokenMiddleware, adminController.rescheduleDateandTime, adminController.updateMyAddress);
router.delete('/cancle-service/:serviceRequestId', usercontroller.validateTokenMiddleware, adminController.cancelServiceRequestFromAdmin);
/////////////////////////////////////////// 7.2 Filters API //////////////////////////////////////////////////
router.get('/search-by-serviceId', (0, celebrate_1.celebrate)(SearchById), usercontroller.validateTokenMiddleware, adminController.searchByServiceId);
router.get('/search-by-postalcode', (0, celebrate_1.celebrate)(SearchByPostalcode), usercontroller.validateTokenMiddleware, adminController.searchByPostalcode);
router.get('/search-by-email', (0, celebrate_1.celebrate)(SearchByEmail), usercontroller.validateTokenMiddleware, adminController.searchByEmail);
router.get('/search-by-name', (0, celebrate_1.celebrate)(SearchByName), usercontroller.validateTokenMiddleware, adminController.searchByName);
router.get('/search-by-serviceProvider', (0, celebrate_1.celebrate)(SearchBySP), usercontroller.validateTokenMiddleware, adminController.searchByServiceProvider);
router.get('/search-by-status', (0, celebrate_1.celebrate)(SearchByStatus), usercontroller.validateTokenMiddleware, adminController.searchByStatus);
router.get('/search-by-hasIssue', usercontroller.validateTokenMiddleware, adminController.searchByHasIssue);
router.get('/search-by-date', (0, celebrate_1.celebrate)(SearchByDate), usercontroller.validateTokenMiddleware, adminController.searchByDate);
/////////////////////////////////////////// 7.3 User Management API //////////////////////////////////////////////////
router.get('/get-all-users', usercontroller.validateTokenMiddleware, adminController.getUserList);
router.put('/activate-or-deactivate/:userId', (0, celebrate_1.celebrate)(Activate), usercontroller.validateTokenMiddleware, adminController.activeUser, adminController.deactiveUser);
/////////////////////////////////////////// 7.4 Refund API //////////////////////////////////////////////////
router.put('/refund-amount/:serviceRequestId', usercontroller.validateTokenMiddleware, adminController.refundAmount);
module.exports = router;
