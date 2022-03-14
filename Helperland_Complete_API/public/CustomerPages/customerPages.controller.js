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
exports.CustomerPageController = void 0;
var bcryptjs_1 = __importDefault(require("bcryptjs"));
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var nodemailer_1 = __importDefault(require("nodemailer"));
var models_1 = __importDefault(require("../models"));
var CustomerPageController = /** @class */ (function () {
    function CustomerPageController(customerPageService) {
        var _this = this;
        this.customerPageService = customerPageService;
        //////////////////////////////// 5.1 Dashboard APIs ///////////////////////////////////////
        this.getServiceRequest = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.customerPageService.getServiceRequest(req.body.user.id)
                        .then(function (customer) {
                        if (!customer) {
                            return res.status(404).json({ error: "No Service Request Found" });
                        }
                        else {
                            return res.status(200).json({ customer: customer });
                        }
                    })
                        .catch(function (error) {
                        return res.status(500).json({ error: error });
                    })];
            });
        }); };
        this.getServiceAddress = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.customerPageService.getServiceAddress(+req.params.addressId)
                        .then(function (customer) {
                        if (!customer) {
                            return res.status(401).json({ msg: "No service address found!" });
                        }
                        else {
                            return _this.customerPageService.getServiceRequestById(customer.ServiceRequestId)
                                .then(function (serviceRequest) {
                                if (+req.params.addressId === (serviceRequest === null || serviceRequest === void 0 ? void 0 : serviceRequest.ServiceRequestId)) {
                                    return res.status(200).json({ serviceRequest: serviceRequest, customer: customer });
                                }
                                else {
                                    return res.status(404).json({ msg: "No service request found" });
                                }
                            })
                                .catch(function (error) {
                                return res.status(500).json({ error: error });
                            });
                        }
                    })
                        .catch(function (error) {
                        return res.status(500).json({ error: error });
                    })];
            });
        }); };
        this.rescheduleTimeandDate = function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            var serviceId, isGreater;
            var _this = this;
            return __generator(this, function (_a) {
                serviceId = req.params.serviceId;
                isGreater = this.customerPageService.compareDateWithCurrentDate(req.body.ServiceStartDate);
                if (isGreater) {
                    if (req.body.user.userTypeId === 4) {
                        return [2 /*return*/, this.customerPageService
                                .getServiceRequestById(parseInt(serviceId))
                                .then(function (serviceRequest) {
                                if (serviceRequest) {
                                    req.body.totalHour =
                                        serviceRequest.ExtraHours + serviceRequest.ServiceHours;
                                    req.body.helperId = serviceRequest.ServiceProviderId;
                                    if (serviceRequest.UserId === req.body.user.id) {
                                        if (serviceRequest.ServiceProviderId) {
                                            req.body.spId = serviceRequest.ServiceProviderId;
                                            return _this.customerPageService
                                                .getAllServiceRequestOfHelper(serviceRequest.ServiceProviderId)
                                                .then(function (serviceRequest) { return __awaiter(_this, void 0, void 0, function () {
                                                var _a, srDate, matched, startTime, endTime;
                                                return __generator(this, function (_b) {
                                                    switch (_b.label) {
                                                        case 0:
                                                            if (!serviceRequest) return [3 /*break*/, 2];
                                                            return [4 /*yield*/, this.customerPageService.helperHasFutureSameDateAndTime(req.body.ServiceStartDate, serviceRequest, req.body.totalHour, req.body.ServiceStartTime)];
                                                        case 1:
                                                            _a = _b.sent(), srDate = _a.srDate, matched = _a.matched, startTime = _a.startTime, endTime = _a.endTime;
                                                            if (matched) {
                                                                return [2 /*return*/, res.status(200).json({
                                                                        message: "Another service request has been assigned to the service provider on " + srDate + " from " + startTime +
                                                                            " to " + endTime + ". Either choose another date or pick up a different time slot.",
                                                                    })];
                                                            }
                                                            else {
                                                                next();
                                                            }
                                                            return [3 /*break*/, 3];
                                                        case 2:
                                                            next();
                                                            _b.label = 3;
                                                        case 3: return [2 /*return*/];
                                                    }
                                                });
                                            }); })
                                                .catch(function (error) {
                                                console.log(error);
                                                return res.status(500).json({
                                                    error: error,
                                                });
                                            });
                                        }
                                        else {
                                            next();
                                        }
                                    }
                                    else {
                                        return res.status(404).json({ message: "No data found" });
                                    }
                                }
                                else {
                                    return res.status(404).json({ message: "Service request not found" });
                                }
                            })
                                .catch(function (error) {
                                console.log(error);
                                return res.status(500).json({
                                    error: error,
                                });
                            })];
                    }
                    else {
                        return [2 /*return*/, res.status(401).json({ message: "Unauthorised User" })];
                    }
                }
                else {
                    return [2 /*return*/, res.status(400).json({ message: "Enter future date for reschedule service request" })];
                }
                return [2 /*return*/];
            });
        }); };
        this.rescheduleIfTimeSlotNotConflicts = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var d, date, spId;
            var _this = this;
            return __generator(this, function (_a) {
                d = req.body.ServiceStartDate;
                date = d.split("-").reverse().join("-");
                spId = req.body.helperId.spId;
                if (req.params.serviceId) {
                    return [2 /*return*/, this.customerPageService
                            .rescheduleTimeandDate(new Date(date), req.body.time, parseInt(req.params.serviceId))
                            .then(function (serviceRequest) {
                            if (serviceRequest.length > 0) {
                                if (spId) {
                                    return _this.customerPageService
                                        .getHelperById(spId)
                                        .then(function (helper) {
                                        if (helper === null || helper === void 0 ? void 0 : helper.email) {
                                            var transporter = nodemailer_1.default.createTransport({
                                                service: process.env.SERVICE,
                                                auth: {
                                                    user: process.env.USER,
                                                    pass: process.env.PASS,
                                                },
                                            });
                                            var mailOptions = _this.customerPageService.mailData(d, req.body.ServiceStartTime, helper.email, req.params.serviceId);
                                            transporter.sendMail(mailOptions, function (error, info) {
                                                if (error) {
                                                    res.status(404).json({
                                                        error: error,
                                                        message: "Email cannot be sent.."
                                                    });
                                                }
                                            });
                                            return res.status(200).json({
                                                message: "sevice request reschedule successfully",
                                            });
                                        }
                                        else {
                                            return res.status(404).json({ message: "helper not found" });
                                        }
                                    })
                                        .catch(function (error) {
                                        console.log(error);
                                        return res.status(500).json({
                                            error: error,
                                        });
                                    });
                                }
                                return res.status(200).json({ message: "sevice request reschedule successfully" });
                            }
                            else {
                                return res.status(422).json({ message: "error in rescheduling service request" });
                            }
                        })
                            .catch(function (error) {
                            console.log(error);
                            return res.status(500).json({
                                error: error,
                            });
                        })];
                }
                else {
                    return [2 /*return*/, res.status(404).json({ message: "service request id not found" })];
                }
                return [2 /*return*/];
            });
        }); };
        this.cancelService = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var serviceRequest;
            var _this = this;
            return __generator(this, function (_a) {
                serviceRequest = +req.params.id;
                if (serviceRequest) {
                    return [2 /*return*/, this.customerPageService.getServiceRequestById(+req.params.id)
                            .then(function (customer) { return __awaiter(_this, void 0, void 0, function () {
                            var customerObj, result;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (!!customer) return [3 /*break*/, 1];
                                        return [2 /*return*/, res.status(404).json({ msg: "Service Request Not Found" })];
                                    case 1:
                                        customerObj = {
                                            ServiceRequestId: customer.ServiceRequestId,
                                            ServiceId: customer.ServiceId,
                                            ServiceStartDate: customer.ServiceStartDate,
                                            ServiceStartTime: customer.ServiceStartTime,
                                            ZipCode: customer.ZipCode,
                                            ServiceHourlyRate: customer.ServiceHourlyRate,
                                            ServiceHours: customer.ServiceHours,
                                            ExtraHours: customer.ExtraHours,
                                            SubTotal: customer.SubTotal,
                                            Discount: customer.Discount,
                                            TotalCost: customer.TotalCost,
                                            Comments: req.body.Comments,
                                            PaymentTransactionRefNo: customer.PaymentTransactionRefNo,
                                            PaymentDue: customer.PaymentDue,
                                            SPAcceptedDate: customer.SPAcceptedDate,
                                            HasPets: customer.HasPets,
                                            Status: 4,
                                            ModifiedBy: customer.ModifiedBy,
                                            RefundedAmount: customer.RefundedAmount,
                                            Distance: customer.Distance,
                                            HasIssue: customer.HasIssue,
                                            PaymentDone: customer.PaymentDone,
                                            RecordVersion: customer.RecordVersion,
                                            UserId: customer.UserId,
                                            ServiceProviderId: customer.ServiceProviderId
                                        };
                                        return [4 /*yield*/, models_1.default.ServiceRequest.update(customerObj, { where: { ServiceRequestId: serviceRequest } })];
                                    case 2:
                                        result = _a.sent();
                                        if (result) {
                                            return [2 /*return*/, res.status(200).json({ customerObj: customerObj })];
                                        }
                                        else {
                                            return [2 /*return*/, res.status(500).json({ msg: "Not Found" })];
                                        }
                                        ;
                                        _a.label = 3;
                                    case 3: return [2 /*return*/];
                                }
                            });
                        }); })
                            .catch(function (error) {
                            return res.status(500).json({ error: error });
                        })];
                }
                return [2 /*return*/, res.status(404).json({ error: 'NotFound' })];
            });
        }); };
        //////////////////////////////// 5.2 Service History APIs ///////////////////////////////////////
        this.getServiceHistory = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.customerPageService.getServiceHistory(req.body.user.id)
                        .then(function (customer) {
                        if (!customer) {
                            return res.status(404).json({ error: "No Service Request Found" });
                        }
                        else {
                            return res.status(200).json({ customer: customer });
                        }
                    })
                        .catch(function (error) {
                        return res.status(500).json({ error: error });
                    })];
            });
        }); };
        this.rateSP = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                if (!req.body.user.id) {
                    return [2 /*return*/, res.status(301).json({ msg: "Please Login" })];
                }
                else {
                    req.body.Ratings = (req.body.OnTimeArrival + req.body.Friendly + req.body.QualityOfService) / 3;
                    return [2 /*return*/, this.customerPageService.getUserWithId(req.body.user.id)
                            .then(function (user) {
                            if (user) {
                                if (user.userTypeId === 4) {
                                    req.body.RatingFrom = user.id;
                                }
                                else {
                                    return res.status(301).json({ msg: "Please use your user account" });
                                }
                            }
                            else {
                                return res.status(301).json({ msg: "User not found" });
                            }
                            return _this.customerPageService.getServiceRequestById(+req.params.serviceRequestId)
                                .then(function (serviceRequest) {
                                if (serviceRequest) {
                                    req.body.ServiceRequestId = +req.params.serviceRequestId;
                                    req.body.RatingTo = serviceRequest.ServiceProviderId;
                                }
                                else {
                                    return res.status(301).json({ msg: "No Service Request" });
                                }
                                return _this.customerPageService.rateSP(req.body)
                                    .then(function (rating) {
                                    if (rating) {
                                        return res.status(200).json({ rating: rating });
                                    }
                                    return res.status(301).json({ msg: "No Rating" });
                                })
                                    .catch(function (error) {
                                    return res.status(501).json({ error: error });
                                });
                            })
                                .catch(function (error) {
                                return res.status(502).json({ error: error });
                            });
                        })
                            .catch(function (error) {
                            return res.status(503).json({ error: error });
                        })];
                }
                return [2 /*return*/];
            });
        }); };
        //////////////////////////////// 5.4 My Settings APIs ///////////////////////////////////////
        this.getUserDetailById = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var userId;
            return __generator(this, function (_a) {
                userId = +req.body.userId;
                if (userId && req.body.userTypeId === 4) {
                    return [2 /*return*/, this.customerPageService
                            .getUserDetailById(userId)
                            .then(function (userDetail) {
                            if (userDetail) {
                                return res.status(200).json(userDetail);
                            }
                            else {
                                return res.status(404).json({ message: 'User not found' });
                            }
                        })
                            .catch(function (error) {
                            console.log(error);
                            return res.status(500).json({ error: error });
                        })];
                }
                else {
                    return [2 /*return*/, res.status(400).json({ message: 'user not found' })];
                }
                return [2 /*return*/];
            });
        }); };
        this.updateMyDetails = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.customerPageService.updateMyDetails(req.body, req.body.user.id)
                        .then(function (user) {
                        if (!user) {
                            return res.status(401).json({ msg: "User not found" });
                        }
                        else {
                            return res.status(200).json({ user: user, msg: "Your detail updated successfully" });
                        }
                    })
                        .catch(function (error) {
                        return res.status(500).json({ error: error });
                    })];
            });
        }); };
        this.getUserAddressesById = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.customerPageService.getUserAddressesById(req.body.user.id)
                        .then(function (userAddresses) {
                        if (userAddresses) {
                            return res.status(200).json({ userAddresses: userAddresses });
                        }
                        else {
                            return res.status(404).json({ message: 'Address not found' });
                        }
                    })
                        .catch(function (error) {
                        console.log(error);
                        return res.status(500).json({ error: error });
                    })];
            });
        }); };
        this.updateMyAddresses = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                req.body.Addressline1 = req.body.StreetName;
                req.body.Addressline2 = req.body.HouseNumber;
                return [2 /*return*/, this.customerPageService.updateMyAddresses(req.body, +req.params.id)
                        .then(function (user) {
                        if (!user) {
                            return res.status(401).json({ msg: "User not found" });
                        }
                        else {
                            return res.status(200).json({ user: user, msg: "Your detail updated successfully" });
                        }
                    })
                        .catch(function (error) {
                        return res.status(500).json({ error: error });
                    })];
            });
        }); };
        this.deleteUserAddress = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (+req.params.addressId) {
                    return [2 /*return*/, this.customerPageService.deleteUserAddress(req.params.addressId, req.body.user.id)
                            .then(function (deletedAddress) {
                            if (deletedAddress) {
                                if (deletedAddress[0] === 1) {
                                    return res.status(200).json({ message: 'address deleted successfully' });
                                }
                                else {
                                    return res.status(404).json({ message: 'error in deleting address' });
                                }
                            }
                            else {
                                return res.status(404).json({ message: 'error in deleting address' });
                            }
                        })
                            .catch(function (error) {
                            console.log(error);
                            return res.status(500).json({ error: error });
                        })];
                }
                else {
                    return [2 /*return*/, res.status(400).json({ message: 'proper input not found in request' })];
                }
                return [2 /*return*/];
            });
        }); };
        this.addNewAddress = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                if (req.headers.authorization) {
                    jsonwebtoken_1.default.verify(req.headers.authorization, process.env.JWT_KEY, function (err, user) {
                        if (err) {
                            return res.status(403).json({ msg: "Invalid Token" });
                        }
                        else {
                            req.body.email = user.email;
                            req.body.PostalCode = user.postalcode;
                            return _this.customerPageService.getUserWithEmail(user.email)
                                .then(function (user) {
                                if (user) {
                                    req.body.UserId = user.id;
                                    return _this.customerPageService.addNewAddress(req.body)
                                        .then(function (address) {
                                        return res.status(403).json({ message: "Address Added Successfully!!" });
                                    })
                                        .catch(function (error) {
                                        console.log(error);
                                        return res.status(500).json({
                                            error: error,
                                        });
                                    });
                                }
                                else {
                                    return res.status(403).json({ message: "user not found" });
                                }
                            })
                                .catch(function (error) {
                                console.log(error);
                                return res.status(500).json({
                                    error: error,
                                });
                            });
                        }
                        ;
                    });
                }
                ;
                return [2 /*return*/];
            });
        }); };
        this.changePassword = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.customerPageService.changePassById(req.body.user.id)
                        .then(function (user) { return __awaiter(_this, void 0, void 0, function () {
                        var passMatch, newPassword, cpassword, _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    if (!user) {
                                        return [2 /*return*/, res.status(400).json({ msg: "User not found" })];
                                    }
                                    ;
                                    return [4 /*yield*/, bcryptjs_1.default.compare(req.body.oldPassword, user.password)];
                                case 1:
                                    passMatch = _b.sent();
                                    if (!!passMatch) return [3 /*break*/, 2];
                                    return [2 /*return*/, res.status(404).json({ msg: "Incorrect Password! Please Enter correct password" })];
                                case 2:
                                    newPassword = req.body.newPassword;
                                    cpassword = req.body.cpassword;
                                    if (!!(newPassword === cpassword)) return [3 /*break*/, 3];
                                    return [2 /*return*/, res.status(400).json({ msg: "Please Enter same password" })];
                                case 3:
                                    _a = user;
                                    return [4 /*yield*/, bcryptjs_1.default.hash(req.body.newPassword, 10)];
                                case 4:
                                    _a.password = _b.sent();
                                    return [2 /*return*/, this.customerPageService.changePassword(user.password, req.body.user.id)
                                            .then(function (user) {
                                            return res.status(200).json({ msg: "Password change successfully" });
                                        })
                                            .catch(function (error) {
                                            return res.status(500).json(error);
                                        })];
                            }
                        });
                    }); })
                        .catch(function (error) {
                        return res.status(500).json(error);
                    })];
            });
        }); };
        this.customerPageService = customerPageService;
    }
    return CustomerPageController;
}());
exports.CustomerPageController = CustomerPageController;
