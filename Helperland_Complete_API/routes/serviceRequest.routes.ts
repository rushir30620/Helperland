import express from "express";
import { ServiceBookRepository } from "../ServiceRequest/bookservice.repository";
import { ServiceBook } from "../ServiceRequest/bookservice.service";
import { ServiceBookController } from "../ServiceRequest/bookservice.controller";

import { UserRepository } from "../user/user.repository";
import { UserService } from "../user/user.service";
import { UserController } from "../user/user.controller";

const router: express.Router = express.Router();

const bookRepo: ServiceBookRepository = new ServiceBookRepository();
const bookService: ServiceBook = new ServiceBook(bookRepo);
const bookController: ServiceBookController = new ServiceBookController(bookService);

const userrepo: UserRepository = new UserRepository();
const userservice: UserService = new UserService(userrepo);
const usercontroller: UserController = new UserController(userservice);


router.post('/setup-service', usercontroller.validateTokenMiddleware, bookController.serviceSetup);
router.post('/schedule-service', usercontroller.validateTokenMiddleware,bookController.tokenDecode, bookController.createScheduleRequest);

router.post('/add-new-address', usercontroller.validateTokenMiddleware,bookController.addNewAddress);
router.get('/get-address', usercontroller.validateTokenMiddleware,bookController.getExistingAddress);
router.get('/get-favourite-sp', usercontroller.validateTokenMiddleware,bookController.getFavoriteAndBlockedSP);

export = router;