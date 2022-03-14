import express from "express";
import { SPPageRepository } from "../ServiceProviderPages/SP.repository";
import { SPPageService } from "../ServiceProviderPages/SP.service";
import { SPPageController } from "../ServiceProviderPages/SP.controller";
import { UserRepository } from "../user/user.repository";
import { UserService } from "../user/user.service";
import { UserController } from "../user/user.controller";
import { celebrate } from "celebrate";
import { BlockCustomerSchema } from "../ServiceProviderPages/SP.model";

const router: express.Router = express.Router();

const spRepo: SPPageRepository = new SPPageRepository();
const spService: SPPageService = new SPPageService(spRepo);
const spController: SPPageController = new SPPageController(spService);

const userrepo: UserRepository = new UserRepository();
const userservice: UserService = new UserService(userrepo);
const usercontroller: UserController = new UserController(userservice);

const { Blocked } = BlockCustomerSchema;

router.get('/service-request', usercontroller.validateTokenMiddleware, spController.getAllNewServiceRequests);
router.get('/service-request-detail/:addressId', usercontroller.validateTokenMiddleware, spController.getServiceRequestDetail);
router.put('/accept-service/:serviceRequestId', usercontroller.validateTokenMiddleware, spController.IsServiceAvailableOrNot, spController.acceptRequest);

router.get('/upcoming-service', usercontroller.validateTokenMiddleware, spController.getUpcomingService);
router.delete('/cancle-upcoming-service/:serviceRequestId', usercontroller.validateTokenMiddleware, spController.cancelServiceRequest);
router.put('/complete-service/:serviceRequestId', usercontroller.validateTokenMiddleware, spController.completeService);

router.get('/service-history-sp', usercontroller.validateTokenMiddleware, spController.getSPServiceHistory);

router.get('/ratingsp', usercontroller.validateTokenMiddleware, spController.getSPRatings);

router.get('/get-pastWork-user', usercontroller.validateTokenMiddleware, spController.getUserWorkedWithSP);
router.get('/block-unblock-user/:customerId', usercontroller.validateTokenMiddleware, spController.createBlockUser, spController.unBlockUser);

router.get('/spDetails', usercontroller.validateTokenMiddleware, spController.getUserDetailById);
router.put('/update-detail/:addressId', usercontroller.validateTokenMiddleware,celebrate(Blocked), spController.updateMyDetails)

export = router;