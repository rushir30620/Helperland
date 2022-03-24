"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var express_1 = __importDefault(require("express"));
var SP_repository_1 = require("../ServiceProviderPages/SP.repository");
var SP_service_1 = require("../ServiceProviderPages/SP.service");
var SP_controller_1 = require("../ServiceProviderPages/SP.controller");
var user_repository_1 = require("../user/user.repository");
var user_service_1 = require("../user/user.service");
var user_controller_1 = require("../user/user.controller");
var celebrate_1 = require("celebrate");
var SP_model_1 = require("../ServiceProviderPages/SP.model");
var router = express_1.default.Router();
var spRepo = new SP_repository_1.SPPageRepository();
var spService = new SP_service_1.SPPageService(spRepo);
var spController = new SP_controller_1.SPPageController(spService);
var userrepo = new user_repository_1.UserRepository();
var userservice = new user_service_1.UserService(userrepo);
var usercontroller = new user_controller_1.UserController(userservice);
var Blocked = SP_model_1.SPPageSchema.Blocked, UpdateSPDetails = SP_model_1.SPPageSchema.UpdateSPDetails, ChangeSPPassword = SP_model_1.SPPageSchema.ChangeSPPassword;
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
router.put('/block-unblock-user/:customerId', (0, celebrate_1.celebrate)(Blocked), usercontroller.validateTokenMiddleware, spController.createBlockUser, spController.unBlockUser);
/////////////////////////////////////////// 6.7 My Settings API ////////////////////////////////////////////////
router.get('/spDetails', usercontroller.validateTokenMiddleware, spController.getUserDetailById);
router.put('/update-detail', (0, celebrate_1.celebrate)(UpdateSPDetails), usercontroller.validateTokenMiddleware, spController.updateMyDetails, spController.updateAddMyAddress);
router.put('/changeSPPassword', (0, celebrate_1.celebrate)(ChangeSPPassword), usercontroller.validateTokenMiddleware, spController.changeSPPassword);
module.exports = router;
