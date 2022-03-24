"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
var models_1 = __importDefault(require("../models"));
var nodemailer_1 = __importDefault(require("nodemailer"));
var AdminController = /** @class */ (function () {
    function AdminController(adminService) {
        var _this = this;
        this.adminService = adminService;
        /////////////////////////////////////////// 7.1 Service Request API //////////////////////////////////////////////////
        this.getAllServiceRequests = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                if (req.body.user.id && req.body.user.userTypeId === 2) {
                    return [2 /*return*/, this.adminService.getAllServiceRequests()
                            .then(function (serviceRequest) { return __awaiter(_this, void 0, void 0, function () {
                            var completeServiceDetail;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (!serviceRequest) return [3 /*break*/, 2];
                                        return [4 /*yield*/, this.adminService.requestData(serviceRequest)];
                                    case 1:
                                        completeServiceDetail = _a.sent();
                                        return [2 /*return*/, res.status(200).json(completeServiceDetail)];
                                    case 2: return [2 /*return*/, res.status(402).json({ msg: "Service Request Not Found" })];
                                }
                            });
                        }); })
                            .catch(function (error) {
                            console.log(error);
                            return res.status(500).json({ error: error });
                        })];
                }
                else {
                    return [2 /*return*/, res.status(404).json({ msg: "User not found" })];
                }
                return [2 /*return*/];
            });
        }); };
        this.rescheduleDateandTime = function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            var serviceId, isAvailable;
            var _this = this;
            return __generator(this, function (_a) {
                serviceId = +req.params.serviceId;
                isAvailable = this.adminService.compareTwoDates(req.body.ServiceStartDate);
                if (isAvailable) {
                    if (req.body.user.userTypeId === 2) {
                        return [2 /*return*/, this.adminService.getServiceRequest(serviceId)
                                .then(function (serviceRequest) {
                                if (serviceRequest) {
                                    req.body.totalHour = serviceRequest.ExtraHours + serviceRequest.ServiceHours;
                                    req.body.helperId = serviceRequest.ServiceProviderId;
                                    if (serviceRequest.ServiceProviderId) {
                                        return _this.adminService.getAllSPRequest(serviceRequest.ServiceProviderId)
                                            .then(function (servicerequest) { return __awaiter(_this, void 0, void 0, function () {
                                            var newServiceDate_1, newServiceEnd_1, flag_1;
                                            return __generator(this, function (_a) {
                                                if (servicerequest) {
                                                    newServiceDate_1 = new Date(req.body.ServiceStartDate.split("-").reverse().join("-"));
                                                    newServiceDate_1.setHours(parseInt(req.body.ServiceStartTime.toString().split(':')[0]));
                                                    newServiceDate_1.setMinutes(parseInt(req.body.ServiceStartTime.toString().split(':')[1]));
                                                    newServiceEnd_1 = new Date(newServiceDate_1);
                                                    newServiceEnd_1.setHours(newServiceDate_1.getHours() + Math.floor(req.body.totalHour));
                                                    newServiceEnd_1.setMinutes((req.body.totalHour - Math.floor(req.body.totalHour)) * 60);
                                                    flag_1 = true;
                                                    servicerequest.forEach(function (s) {
                                                        var oldServiceStart = new Date(s.ServiceStartDate);
                                                        oldServiceStart.setHours(parseInt(s.ServiceStartTime.toString().split(':')[0]));
                                                        oldServiceStart.setMinutes(parseInt(s.ServiceStartTime.toString().split(':')[1]));
                                                        var total = s.ServiceHours + s.ExtraHours;
                                                        var oldServiceEnd = oldServiceStart;
                                                        oldServiceEnd.setHours(oldServiceEnd.getHours() + Math.floor(total));
                                                        oldServiceEnd.setMinutes((total - Math.floor(total)) * 60);
                                                        if ((newServiceDate_1 >= oldServiceStart && newServiceDate_1 < oldServiceEnd) ||
                                                            (newServiceEnd_1 > oldServiceStart && newServiceEnd_1 <= oldServiceEnd) ||
                                                            (oldServiceStart >= newServiceDate_1 && oldServiceEnd < newServiceEnd_1)) {
                                                            return res.status(404).json({ msg: "This service cannot assign to this service provider. Please choose another service date and time." });
                                                        }
                                                        else {
                                                            flag_1 = false;
                                                        }
                                                    });
                                                    if (!flag_1) {
                                                        return [2 /*return*/, this.adminService.rescheduleDateandTime(req.body, +req.params.serviceId)
                                                                .then(function (rescheduleService) {
                                                                if (rescheduleService.length > 0) {
                                                                    console.log("In next");
                                                                    next();
                                                                }
                                                                else {
                                                                    return res.status(402).json({ msg: "Cannot update date and time" });
                                                                }
                                                            })
                                                                .catch(function (error) {
                                                                console.log(error);
                                                                return res.status(500).json({ error: error });
                                                            })];
                                                    }
                                                }
                                                else {
                                                    return [2 /*return*/, res.status(402).json({ msg: "Service Request not found" })];
                                                }
                                                return [2 /*return*/];
                                            });
                                        }); }).
                                            catch(function (error) {
                                            console.log(error);
                                            return res.status(500).json({ error: error });
                                        });
                                    }
                                    else {
                                        return res.status(401).json({ msg: "Service provider not found" });
                                    }
                                }
                                else {
                                    return res.status(402).json({ msg: "Service request not found" });
                                }
                            })
                                .catch(function (error) {
                                console.log(error);
                                return res.status(500).json({ error: error });
                            })];
                    }
                    else {
                        return [2 /*return*/, res.status(401).json({ msg: "admin not found" })];
                    }
                }
                else {
                    return [2 /*return*/, res.status(422).json({ msg: "Please enter valid date" })];
                }
                return [2 /*return*/];
            });
        }); };
        this.updateMyAddress = function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            var UserAndSPIdList, UserAndSPDetail, srId;
            var _this = this;
            return __generator(this, function (_a) {
                UserAndSPIdList = [];
                UserAndSPDetail = [];
                srId = +req.params.serviceId;
                if (srId && req.body.user.userTypeId === 2) {
                    return [2 /*return*/, this.adminService.getSRaddress(srId)
                            .then(function (srAddress) {
                            if (srAddress) {
                                return _this.adminService.updateMyAddress(req.body, srAddress.ServiceRequestId)
                                    .then(function (newSRAddress) {
                                    if (newSRAddress) {
                                        return _this.adminService.getServiceRequests(srAddress.ServiceRequestId)
                                            .then(function (serviceRequest) {
                                            if (serviceRequest.length > 0) {
                                                for (var sr in serviceRequest) {
                                                    UserAndSPIdList.push(serviceRequest[sr].UserId, serviceRequest[sr].ServiceProviderId);
                                                }
                                                return _this.adminService.getAllUsers()
                                                    .then(function (user) {
                                                    if (user.length > 0) {
                                                        for (var us in user) {
                                                            if (UserAndSPIdList[0] === user[us].id) {
                                                                UserAndSPDetail.push(user[us].email);
                                                            }
                                                            else if (UserAndSPIdList[1] === user[us].id) {
                                                                UserAndSPDetail.push(user[us].email);
                                                            }
                                                        }
                                                        for (var spUser in UserAndSPDetail) {
                                                            var transporter = nodemailer_1.default.createTransport({
                                                                service: process.env.SERVICE,
                                                                auth: {
                                                                    user: process.env.USER,
                                                                    pass: process.env.PASS,
                                                                },
                                                            });
                                                            var mailOptions = _this.adminService.mailData(UserAndSPDetail[spUser], srAddress.ServiceRequestId);
                                                            transporter.sendMail(mailOptions, function (error, info) {
                                                                if (error) {
                                                                    res.status(404).json({
                                                                        error: error,
                                                                        message: "Email cannot be sent.."
                                                                    });
                                                                }
                                                            });
                                                        }
                                                        return res.status(200).json({ msg: "Service Rescheduled Successfully" });
                                                    }
                                                    else {
                                                        return res.status(401).json({ msg: "User not found" });
                                                    }
                                                })
                                                    .catch(function (error) {
                                                    console.log(error);
                                                    return res.status(500).json({ error: error });
                                                });
                                            }
                                            else {
                                                return res.status(402).json({ msg: "Service Request not found" });
                                            }
                                        })
                                            .catch(function (error) {
                                            console.log(error);
                                            return res.status(500).json({ error: error });
                                        });
                                    }
                                    else {
                                        return res.status(402).json({ msg: " Error!! cannot updated your address" });
                                    }
                                })
                                    .catch(function (error) {
                                    console.log(error);
                                    return res.status(500).json({ error: error });
                                });
                            }
                        })
                            .catch(function (error) {
                            console.log(error);
                            return res.status(500).json({ error: error });
                        })];
                }
                else {
                    return [2 /*return*/, res.status(401).json({ msg: "User not found" })];
                }
                return [2 /*return*/];
            });
        }); };
        ///////////////////////////////////////// 7.2 Filters API /////////////////////////////////////////////////
        this.searchByServiceId = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var serviceRequestId_1;
            var _this = this;
            return __generator(this, function (_a) {
                if (req.body.user.id && req.body.user.userTypeId === 2) {
                    serviceRequestId_1 = req.body.ServiceRequestId;
                    return [2 /*return*/, this.adminService.getServiceRequest(serviceRequestId_1)
                            .then(function (service) { return __awaiter(_this, void 0, void 0, function () {
                            var allServiceRequest, completeServiceDetail;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (!((service === null || service === void 0 ? void 0 : service.ServiceRequestId) === serviceRequestId_1)) return [3 /*break*/, 3];
                                        return [4 /*yield*/, this.adminService.searchByServiceId(serviceRequestId_1)];
                                    case 1:
                                        allServiceRequest = _a.sent();
                                        return [4 /*yield*/, this.adminService.requestData(allServiceRequest)];
                                    case 2:
                                        completeServiceDetail = _a.sent();
                                        return [2 /*return*/, res.status(200).json(completeServiceDetail)];
                                    case 3: return [2 /*return*/, res.status(404).json({ msg: "No similar service available for this service id" })];
                                }
                            });
                        }); })
                            .catch(function (error) {
                            console.log(error);
                            return res.status(500).json({ error: error });
                        })];
                }
                else {
                    return [2 /*return*/, res.status(402).json({ msg: "Admin not found" })];
                }
                return [2 /*return*/];
            });
        }); };
        this.searchByPostalcode = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var postalCode_1;
            var _this = this;
            return __generator(this, function (_a) {
                if (req.body.user.id && req.body.user.userTypeId === 2) {
                    postalCode_1 = req.body.ZipCode;
                    return [2 /*return*/, this.adminService.getServiceRequestByZipcode(postalCode_1)
                            .then(function (service) { return __awaiter(_this, void 0, void 0, function () {
                            var allServiceRequest, completeServiceDetail;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (!((service === null || service === void 0 ? void 0 : service.ZipCode) === postalCode_1)) return [3 /*break*/, 3];
                                        return [4 /*yield*/, this.adminService.searchByPostalcode(postalCode_1)];
                                    case 1:
                                        allServiceRequest = _a.sent();
                                        return [4 /*yield*/, this.adminService.requestData(allServiceRequest)];
                                    case 2:
                                        completeServiceDetail = _a.sent();
                                        return [2 /*return*/, res.status(200).json(completeServiceDetail)];
                                    case 3: return [2 /*return*/, res.status(404).json({ msg: "No similar service available for this postalcode" })];
                                }
                            });
                        }); })
                            .catch(function (error) {
                            console.log(error);
                            return res.status(500).json({ error: error });
                        })];
                }
                else {
                    return [2 /*return*/, res.status(402).json({ msg: "Admin not found" })];
                }
                return [2 /*return*/];
            });
        }); };
        this.searchByEmail = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var email_1;
            var _this = this;
            return __generator(this, function (_a) {
                if (req.body.user.id && req.body.user.userTypeId === 2) {
                    email_1 = req.body.email;
                    return [2 /*return*/, this.adminService.getUserByEmail(email_1)
                            .then(function (service) { return __awaiter(_this, void 0, void 0, function () {
                            var allServiceRequest, completeServiceDetail;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (!((service === null || service === void 0 ? void 0 : service.email) === email_1)) return [3 /*break*/, 3];
                                        return [4 /*yield*/, this.adminService.searchByEmailAndNameWithUserID(service === null || service === void 0 ? void 0 : service.id)];
                                    case 1:
                                        allServiceRequest = _a.sent();
                                        return [4 /*yield*/, this.adminService.requestData(allServiceRequest)];
                                    case 2:
                                        completeServiceDetail = _a.sent();
                                        return [2 /*return*/, res.status(200).json(completeServiceDetail)];
                                    case 3: return [2 /*return*/, res.status(404).json({ msg: "No similar service available for this email" })];
                                }
                            });
                        }); })
                            .catch(function (error) {
                            console.log(error);
                            return res.status(500).json({ error: error });
                        })];
                }
                else {
                    return [2 /*return*/, res.status(402).json({ msg: "Admin not found" })];
                }
                return [2 /*return*/];
            });
        }); };
        this.searchByName = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var name1, name2;
            var _this = this;
            return __generator(this, function (_a) {
                if (req.body.user.id && req.body.user.userTypeId === 2) {
                    name1 = req.body.Name.split(" ")[0];
                    name2 = req.body.Name.split(" ")[1];
                    return [2 /*return*/, this.adminService.getUserByName(name1, name2)
                            .then(function (service) { return __awaiter(_this, void 0, void 0, function () {
                            var allServiceRequest, completeServiceDetail;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (!service) return [3 /*break*/, 3];
                                        return [4 /*yield*/, this.adminService.searchByEmailAndNameWithUserID(service === null || service === void 0 ? void 0 : service.id)];
                                    case 1:
                                        allServiceRequest = _a.sent();
                                        return [4 /*yield*/, this.adminService.requestData(allServiceRequest)];
                                    case 2:
                                        completeServiceDetail = _a.sent();
                                        return [2 /*return*/, res.status(200).json(completeServiceDetail)];
                                    case 3: return [2 /*return*/, res.status(404).json({ msg: "No similar service available for this name" })];
                                }
                            });
                        }); })
                            .catch(function (error) {
                            console.log(error);
                            return res.status(500).json({ error: error });
                        })];
                }
                else {
                    return [2 /*return*/, res.status(402).json({ msg: "Admin not found" })];
                }
                return [2 /*return*/];
            });
        }); };
        this.searchByServiceProvider = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var name1_1, name2_1;
            var _this = this;
            return __generator(this, function (_a) {
                if (req.body.user.id && req.body.user.userTypeId === 2) {
                    name1_1 = req.body.SPName.split(" ")[0];
                    name2_1 = req.body.SPName.split(" ")[1];
                    return [2 /*return*/, this.adminService.getUserByName(name1_1, name2_1)
                            .then(function (service) { return __awaiter(_this, void 0, void 0, function () {
                            var allServiceRequest, completeServiceDetail;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (!((service === null || service === void 0 ? void 0 : service.firstName) === name1_1 && (service === null || service === void 0 ? void 0 : service.lastName) === name2_1 && (service === null || service === void 0 ? void 0 : service.userTypeId) === 3)) return [3 /*break*/, 3];
                                        return [4 /*yield*/, this.adminService.searchByPostalcode(service === null || service === void 0 ? void 0 : service.zipCode)];
                                    case 1:
                                        allServiceRequest = _a.sent();
                                        return [4 /*yield*/, this.adminService.requestData(allServiceRequest)];
                                    case 2:
                                        completeServiceDetail = _a.sent();
                                        return [2 /*return*/, res.status(200).json(completeServiceDetail)];
                                    case 3: return [2 /*return*/, res.status(404).json({ msg: "No similar service available for this service provider" })];
                                }
                            });
                        }); })
                            .catch(function (error) {
                            console.log(error);
                            return res.status(500).json({ error: error });
                        })];
                }
                else {
                    return [2 /*return*/, res.status(402).json({ msg: "Admin not found" })];
                }
                return [2 /*return*/];
            });
        }); };
        this.searchByStatus = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var status_1, newStatus_1;
            var _this = this;
            return __generator(this, function (_a) {
                if (req.body.user.id && req.body.user.userTypeId === 2) {
                    status_1 = req.body.Status;
                    if (status_1 === 'New') {
                        newStatus_1 = 1;
                    }
                    else if (status_1 === 'Accepted') {
                        newStatus_1 = 2;
                    }
                    else if (status_1 === 'Completed') {
                        newStatus_1 = 3;
                    }
                    else {
                        newStatus_1 = 4;
                    }
                    return [2 /*return*/, this.adminService.getServiceByStatus(newStatus_1)
                            .then(function (service) { return __awaiter(_this, void 0, void 0, function () {
                            var allServiceRequest, completeServiceDetail;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (!((service === null || service === void 0 ? void 0 : service.Status) === newStatus_1)) return [3 /*break*/, 3];
                                        return [4 /*yield*/, this.adminService.searchByStatus(newStatus_1)];
                                    case 1:
                                        allServiceRequest = _a.sent();
                                        return [4 /*yield*/, this.adminService.requestData(allServiceRequest)];
                                    case 2:
                                        completeServiceDetail = _a.sent();
                                        return [2 /*return*/, res.status(200).json(completeServiceDetail)];
                                    case 3: return [2 /*return*/, res.status(404).json({ msg: "No similar service available for this status" })];
                                }
                            });
                        }); })
                            .catch(function (error) {
                            console.log(error);
                            return res.status(500).json({ error: error });
                        })];
                }
                else {
                    return [2 /*return*/, res.status(402).json({ msg: "Admin not found" })];
                }
                return [2 /*return*/];
            });
        }); };
        this.searchByHasIssue = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var hasIssue_1;
            var _this = this;
            return __generator(this, function (_a) {
                if (req.body.user.id && req.body.user.userTypeId === 2) {
                    hasIssue_1 = req.body.HasIssue;
                    return [2 /*return*/, this.adminService.getServiceByHasIssue(hasIssue_1)
                            .then(function (service) { return __awaiter(_this, void 0, void 0, function () {
                            var allServiceRequest, completeServiceDetail;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (!((service === null || service === void 0 ? void 0 : service.HasIssue) === hasIssue_1)) return [3 /*break*/, 3];
                                        return [4 /*yield*/, this.adminService.searchByHasIssue(hasIssue_1)];
                                    case 1:
                                        allServiceRequest = _a.sent();
                                        return [4 /*yield*/, this.adminService.requestData(allServiceRequest)];
                                    case 2:
                                        completeServiceDetail = _a.sent();
                                        return [2 /*return*/, res.status(200).json(completeServiceDetail)];
                                    case 3: return [2 /*return*/, res.status(404).json({ msg: "No similar service available" })];
                                }
                            });
                        }); })
                            .catch(function (error) {
                            console.log(error);
                            return res.status(500).json({ error: error });
                        })];
                }
                else {
                    return [2 /*return*/, res.status(402).json({ msg: "Admin not found" })];
                }
                return [2 /*return*/];
            });
        }); };
        this.searchByDate = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var date_1;
            var _this = this;
            return __generator(this, function (_a) {
                if (req.body.user.id && req.body.user.userTypeId === 2) {
                    req.body.ServiceStartDate = this.adminService.convertStringtoDate(req.body.ServiceStartDate);
                    date_1 = req.body.ServiceStartDate;
                    return [2 /*return*/, this.adminService.getServiceByDate(req.body.ServiceStartDate)
                            .then(function (service) { return __awaiter(_this, void 0, void 0, function () {
                            var allServiceRequest, completeServiceDetail;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (!(date_1.toLocaleDateString() === (service === null || service === void 0 ? void 0 : service.ServiceStartDate.toLocaleDateString()))) return [3 /*break*/, 3];
                                        return [4 /*yield*/, this.adminService.searchByDate(date_1)];
                                    case 1:
                                        allServiceRequest = _a.sent();
                                        return [4 /*yield*/, this.adminService.requestData(allServiceRequest)];
                                    case 2:
                                        completeServiceDetail = _a.sent();
                                        return [2 /*return*/, res.status(200).json(completeServiceDetail)];
                                    case 3: return [2 /*return*/, res.status(404).json({ msg: "No similar service available for this date" })];
                                }
                            });
                        }); })
                            .catch(function (error) {
                            console.log(error);
                            return res.status(500).json({ error: error });
                        })];
                }
                else {
                    return [2 /*return*/, res.status(402).json({ msg: "Admin not found" })];
                }
                return [2 /*return*/];
            });
        }); };
        ///////////////////////////////////// 7.3 User Management //////////////////////////////////////////////
        this.getUserList = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                if (req.body.user.id && req.body.user.userTypeId === 2) {
                    return [2 /*return*/, this.adminService.getAllUsers()
                            .then(function (user) { return __awaiter(_this, void 0, void 0, function () {
                            var completeUserDetail;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (!user) return [3 /*break*/, 2];
                                        return [4 /*yield*/, this.adminService.userManageData(user)];
                                    case 1:
                                        completeUserDetail = _a.sent();
                                        return [2 /*return*/, res.status(200).json(completeUserDetail)];
                                    case 2: return [2 /*return*/, res.status(404).json({ msg: "Users Not Found" })];
                                }
                            });
                        }); })
                            .catch(function (error) {
                            console.log(error);
                            return res.status(500).json({ error: error });
                        })];
                }
                else {
                    return [2 /*return*/, res.status(404).json({ msg: "User not found" })];
                }
                return [2 /*return*/];
            });
        }); };
        this.activeUser = function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                if (req.body.user.id && req.body.user.userTypeId === 2) {
                    if (req.body.isRegisteredUser === true) {
                        return [2 /*return*/, this.adminService.getSPDetail(+req.params.userId)
                                .then(function (user) { return __awaiter(_this, void 0, void 0, function () {
                                var userObj, activateUser;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            userObj = {
                                                isRegisteredUser: req.body.isRegisteredUser
                                            };
                                            if (!(user && (user === null || user === void 0 ? void 0 : user.isRegisteredUser) === false)) return [3 /*break*/, 2];
                                            return [4 /*yield*/, models_1.default.Users.update(userObj, { where: { id: user.id } })];
                                        case 1:
                                            activateUser = _a.sent();
                                            if (activateUser) {
                                                return [2 /*return*/, res.status(200).json({ msg: "Service Provider Activate Successfully" })];
                                            }
                                            else {
                                                return [2 /*return*/, res.status(402).json({ msg: "Error!!! Service Provider cannot activate" })];
                                            }
                                            return [3 /*break*/, 3];
                                        case 2:
                                            if (user && user.isRegisteredUser === true) {
                                                return [2 /*return*/, res.status(201).json({ msg: "Service Provider Already activate" })];
                                            }
                                            else {
                                                return [2 /*return*/, res.status(404).json({ msg: "New service provider not found" })];
                                            }
                                            _a.label = 3;
                                        case 3: return [2 /*return*/];
                                    }
                                });
                            }); })
                                .catch(function (error) {
                                console.log(error);
                                return res.status(500).json({ error: error });
                            })];
                    }
                    else {
                        next();
                    }
                }
                else {
                    return [2 /*return*/, res.status(401).json({ msg: "Admin Not Found" })];
                }
                return [2 /*return*/];
            });
        }); };
        this.deactiveUser = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                if (req.body.user.id && req.body.user.userTypeId === 2) {
                    return [2 /*return*/, this.adminService.getSPDetail(+req.params.userId)
                            .then(function (user) { return __awaiter(_this, void 0, void 0, function () {
                            var userObj, activateUser;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        userObj = {
                                            isRegisteredUser: req.body.isRegisteredUser
                                        };
                                        if (!(user && (user === null || user === void 0 ? void 0 : user.isRegisteredUser) === true)) return [3 /*break*/, 2];
                                        return [4 /*yield*/, models_1.default.Users.update(userObj, { where: { id: user.id } })];
                                    case 1:
                                        activateUser = _a.sent();
                                        if (activateUser) {
                                            return [2 /*return*/, res.status(200).json({ msg: "Service Provider De-Activate Successfully" })];
                                        }
                                        else {
                                            return [2 /*return*/, res.status(402).json({ msg: "Error!!! Service Provider cannot deactivate" })];
                                        }
                                        return [3 /*break*/, 3];
                                    case 2:
                                        if (user && user.isRegisteredUser === false) {
                                            return [2 /*return*/, res.status(201).json({ msg: "Service Provider Already deactivate" })];
                                        }
                                        else {
                                            return [2 /*return*/, res.status(404).json({ msg: "New service provider not found" })];
                                        }
                                        _a.label = 3;
                                    case 3: return [2 /*return*/];
                                }
                            });
                        }); })
                            .catch(function (error) {
                            console.log(error);
                            return res.status(500).json({ error: error });
                        })];
                }
                else {
                    return [2 /*return*/, res.status(404).json({ msg: "Admin Not Found" })];
                }
                return [2 /*return*/];
            });
        }); };
        this.adminService = adminService;
    }
    return AdminController;
}());
exports.AdminController = AdminController;