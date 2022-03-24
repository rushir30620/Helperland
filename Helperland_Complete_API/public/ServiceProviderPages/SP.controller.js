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
exports.SPPageController = void 0;
var bcryptjs_1 = __importDefault(require("bcryptjs"));
var nodemailer_1 = __importDefault(require("nodemailer"));
var models_1 = __importDefault(require("../models"));
var moment_1 = __importDefault(require("moment"));
var exceljs_1 = __importDefault(require("exceljs"));
var SPPageController = /** @class */ (function () {
    function SPPageController(spPageService) {
        var _this = this;
        this.spPageService = spPageService;
        /////////////////////////////////////////// 6.1 Accept Service Request API ////////////////////////////////////////////////
        this.getAllNewServiceRequests = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                if (req.body.user.userTypeId == 3) {
                    if (req.body.user.id) {
                        return [2 /*return*/, this.spPageService.getSPDetailById(req.body.user.id)
                                .then(function (sp) {
                                if (sp) {
                                    if (sp.zipCode == null) {
                                        return res.status(404).json({ message: "Zipcode not found!! Please add zipCode in your profile" });
                                    }
                                    else {
                                        var zipcode = sp.zipCode;
                                        return _this.spPageService.getServiceRequestByZipcode(sp.zipCode, req.body.user.id)
                                            .then(function (serviceRequests) { return __awaiter(_this, void 0, void 0, function () {
                                            var sRequests, requestDetail;
                                            return __generator(this, function (_a) {
                                                switch (_a.label) {
                                                    case 0:
                                                        if (!(serviceRequests && serviceRequests.length > 0)) return [3 /*break*/, 5];
                                                        return [4 /*yield*/, this.spPageService.filterServiceRequestsCompatibleWithHelper(req.body.PetsAtHome, serviceRequests)];
                                                    case 1:
                                                        sRequests = _a.sent();
                                                        if (!sRequests) return [3 /*break*/, 3];
                                                        return [4 /*yield*/, this.spPageService.displayRequestDetail(sRequests)];
                                                    case 2:
                                                        requestDetail = _a.sent();
                                                        return [2 /*return*/, res.status(200).json(requestDetail)];
                                                    case 3: return [2 /*return*/, res.status(401).json({ message: "service requests not found" })];
                                                    case 4: return [3 /*break*/, 6];
                                                    case 5: return [2 /*return*/, res.status(404).json({ message: "service requests not found" })];
                                                    case 6: return [2 /*return*/];
                                                }
                                            });
                                        }); })
                                            .catch(function (error) {
                                            console.log(error);
                                            return res.status(500).json({ error: error });
                                        });
                                    }
                                }
                                else {
                                    return res.status(404).json({ message: "helper not found" });
                                }
                            })
                                .catch(function (error) {
                                console.log(error);
                                return res.status(500).json({ error: error });
                            })];
                    }
                    else {
                        return [2 /*return*/, res.status(422).json({ message: "helperId not found in request body" })];
                    }
                }
                else {
                    return [2 /*return*/, res.status(401).json({ message: "unauthorised user" })];
                }
                return [2 /*return*/];
            });
        }); };
        this.getServiceRequestDetail = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.spPageService.getServiceAddress(+req.params.addressId)
                        .then(function (address) {
                        if (!address) {
                            return res.status(404).json({ error: "Service Request address not found" });
                        }
                        else {
                            return _this.spPageService.getCustomer(req.body.user.id)
                                .then(function (user) {
                                if (!user) {
                                    return res.status(201).json({ msg: "User detail not found for this request" });
                                }
                                else {
                                    return _this.spPageService.getServiceRequest(address.ServiceRequestId)
                                        .then(function (customer) {
                                        if (!customer) {
                                            return res.status(201).json({ msg: "No service request found" });
                                        }
                                        else {
                                            return res.status(200).json({ customer: customer });
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
                            });
                        }
                    })
                        .catch(function (error) {
                        console.log(error);
                        return res.status(500).json({ error: error });
                    })];
            });
        }); };
        this.acceptRequest = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                // const serviceRequest = req.params.serviceId;
                if (req.params.serviceRequestId) {
                    return [2 /*return*/, this.spPageService.getServiceRequestById(req.params.serviceRequestId)
                            .then(function (service) { return __awaiter(_this, void 0, void 0, function () {
                            var serviceObj_1, result;
                            var _this = this;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (!!service) return [3 /*break*/, 1];
                                        return [2 /*return*/, res.status(404).json({ msg: "No such service request found" })];
                                    case 1:
                                        if (!(service.Status === 2)) return [3 /*break*/, 2];
                                        return [2 /*return*/, res.status(201).json({ msg: "This service request is no more available. It has been assigned to another Service provider." })];
                                    case 2:
                                        serviceObj_1 = {
                                            ServiceRequestId: service.ServiceRequestId,
                                            Status: 2,
                                            ServiceProviderId: service.ServiceProviderId,
                                            ModifiedBy: service.ServiceProviderId,
                                            SPAcceptedDate: new Date()
                                        };
                                        return [4 /*yield*/, models_1.default.ServiceRequest.update(serviceObj_1, { where: { ServiceRequestId: req.params.serviceRequestId } })];
                                    case 3:
                                        result = _a.sent();
                                        if (result) {
                                            return [2 /*return*/, this.spPageService.getServiceProvider(req.body.user.id)
                                                    .then(function (helpers) {
                                                    if (helpers) {
                                                        for (var sp in helpers) {
                                                            if (helpers[sp].email === req.body.user.email) {
                                                                continue;
                                                            }
                                                            var transporter = nodemailer_1.default.createTransport({
                                                                service: process.env.SERVICE,
                                                                auth: {
                                                                    user: process.env.USER,
                                                                    pass: process.env.PASS,
                                                                },
                                                            });
                                                            var data = _this.spPageService.mailData(helpers[sp].email, req.params.serviceId);
                                                            transporter.sendMail(data, function (error, info) {
                                                                if (error) {
                                                                    res.status(404).json({
                                                                        error: error,
                                                                        message: "Email cannot be sent.."
                                                                    });
                                                                }
                                                            });
                                                        }
                                                    }
                                                    return res.status(200).json({ serviceObj: serviceObj_1, msg: "Service accepted successfully" });
                                                })
                                                    .catch(function (error) {
                                                    console.log(error);
                                                    return res.status(500).json({ error: error });
                                                })];
                                        }
                                        else {
                                            return [2 /*return*/, res.status(201).json({ msg: "Error!! Please try again later" })];
                                        }
                                        ;
                                        _a.label = 4;
                                    case 4: return [2 /*return*/];
                                }
                            });
                        }); })
                            .catch(function (error) {
                            console.log(error);
                            return res.status(500).json({ error: error });
                        })];
                }
                else {
                    return [2 /*return*/, res.status(403).json({ msg: "No such service request found" })];
                }
                return [2 /*return*/];
            });
        }); };
        this.IsServiceAvailableOrNot = function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                if (req.params.serviceRequestId) {
                    return [2 /*return*/, this.spPageService
                            .getServiceRequestById(req.params.serviceRequestId)
                            .then(function (serviceRequest) {
                            if (serviceRequest) {
                                req.body.ZipCode = serviceRequest.ZipCode;
                                return _this.spPageService
                                    .getAllServiceRequestsOfHelper(req.body.user.id)
                                    .then(function (serviceRequests) { return __awaiter(_this, void 0, void 0, function () {
                                    var _a, srId, matched;
                                    return __generator(this, function (_b) {
                                        switch (_b.label) {
                                            case 0:
                                                req.body.totalHour =
                                                    serviceRequest.ExtraHours + serviceRequest.ServiceHours;
                                                if (!serviceRequests) return [3 /*break*/, 2];
                                                return [4 /*yield*/, this.spPageService.helperHasFutureSameDateAndTime(serviceRequest.ServiceStartDate, serviceRequests, req.body.totalHour, serviceRequest.ServiceStartTime)];
                                            case 1:
                                                _a = _b.sent(), srId = _a.srId, matched = _a.matched;
                                                if (matched) {
                                                    return [2 /*return*/, res.status(200).json({
                                                            message: "Another service request " +
                                                                srId +
                                                                " has already been assigned which has time overlap with this service request. You can’t pick this one!",
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
                                    return res.status(500).json({ error: error });
                                });
                            }
                            else {
                                return res.status(201).json({
                                    message: "This service request is no more available. It has been assigned to another provider",
                                });
                            }
                        })
                            .catch(function (error) {
                            console.log(error);
                            return res.status(500).json({ error: error });
                        })];
                }
                else {
                    return [2 /*return*/, res
                            .status(400)
                            .json({ message: "proper input not found in request" })];
                }
                return [2 /*return*/];
            });
        }); };
        ///////////////////////////////////////////////// 6.2 Upcoming Service API /////////////////////////////////////////////
        this.getUpcomingService = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (req.body.user.id && req.body.user.userTypeId === 3) {
                    return [2 /*return*/, this.spPageService.getUpcomingService(req.body.user.id)
                            .then(function (services) {
                            var serviceArray = [];
                            var currentDate = new Date((0, moment_1.default)(new Date()).format("YYYY-MM-DD"));
                            if (services) {
                                for (var service in services) {
                                    var serviceDate = new Date(services[service].ServiceStartDate);
                                    if (currentDate > serviceDate) {
                                        continue;
                                    }
                                    serviceArray.push(services[service]);
                                }
                                return res.status(200).json({ serviceArray: serviceArray });
                            }
                            else {
                                return res.status(404).json({ msg: "Upcoming request not found" });
                            }
                        })
                            .catch(function (error) {
                            console.log(error);
                            return res.status(500).json({ error: error });
                        })];
                }
                else {
                    return [2 /*return*/, res.status(401).json({ msg: "User not found " })];
                }
                return [2 /*return*/];
            });
        }); };
        this.completeService = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                if (req.body.user.id && req.body.user.userTypeId === 3) {
                    if (req.params.serviceRequestId) {
                        return [2 /*return*/, this.spPageService.getServiceRequestwithId(req.params.serviceRequestId)
                                .then(function (serviceRequest) {
                                if (serviceRequest) {
                                    if (serviceRequest.ServiceProviderId === req.body.user.id) {
                                        return _this.spPageService.compareCurrentAndServiceDateTime(serviceRequest)
                                            .then(function (newSR) {
                                            if (newSR) {
                                                return _this.spPageService.completeService(req.params.serviceRequestId, req.body.user.id)
                                                    .then(function (editedSR) {
                                                    if (editedSR) {
                                                        return res.status(200).json({ msg: "Service Request completed" });
                                                    }
                                                    else {
                                                        return res.status(404).json({ msg: "Error!! Please try again later" });
                                                    }
                                                })
                                                    .catch(function (error) {
                                                    console.log(error);
                                                    return res.status(500).json({ error: error });
                                                });
                                            }
                                            else {
                                                return res.status(201).json({ message: "Your service hours not completed yet!! Please try again later" });
                                            }
                                        })
                                            .catch(function (error) {
                                            console.log(error);
                                            return res.status(500).json({ error: error });
                                        });
                                    }
                                    else {
                                        return res.status(401).json({ message: "Service Provider Not found" });
                                    }
                                }
                                else {
                                    return res.status(401).json({ message: "Service Request Not found" });
                                }
                            })
                                .catch(function (error) {
                                console.log(error);
                                return res.status(500).json({ error: error });
                            })];
                    }
                    else {
                        return [2 /*return*/, res.status(400).json({ message: "Service Request Not found" })];
                    }
                }
                else {
                    return [2 /*return*/, res.status(401).json({ message: "User Not found" })];
                }
                return [2 /*return*/];
            });
        }); };
        this.cancelServiceRequest = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var serviceRequest;
            var _this = this;
            return __generator(this, function (_a) {
                serviceRequest = req.params.serviceRequestId;
                if (serviceRequest) {
                    return [2 /*return*/, this.spPageService.getServiceRequestById(req.params.serviceRequestId)
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
        ///////////////////////////////////////////////// 6.4 Service history API //////////////////////////////////////////////////
        this.getSPServiceHistory = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.spPageService.getSPServiceHistory(parseInt(req.body.user.id))
                        .then(function (serviceHistory) { return __awaiter(_this, void 0, void 0, function () {
                        var oldServiceHistory, services, _a, _b, _i, sr, sa, u, startTime, endTime, obj;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    if (!serviceHistory) return [3 /*break*/, 8];
                                    oldServiceHistory = this.spPageService.compareDateWithCurrentDate(serviceHistory);
                                    if (!(serviceHistory.length > 0)) return [3 /*break*/, 6];
                                    services = [];
                                    _a = [];
                                    for (_b in oldServiceHistory)
                                        _a.push(_b);
                                    _i = 0;
                                    _c.label = 1;
                                case 1:
                                    if (!(_i < _a.length)) return [3 /*break*/, 5];
                                    sr = _a[_i];
                                    return [4 /*yield*/, models_1.default.ServiceRequestAddress.findOne({ where: { ServiceRequestId: oldServiceHistory[sr].ServiceRequestId } })];
                                case 2:
                                    sa = _c.sent();
                                    return [4 /*yield*/, models_1.default.Users.findOne({ where: { id: oldServiceHistory[sr].UserId } })];
                                case 3:
                                    u = _c.sent();
                                    startTime = oldServiceHistory[sr].ServiceStartTime.toString().split(":");
                                    endTime = (parseFloat(startTime[0]) + parseFloat(startTime[1]) / 60 + oldServiceHistory[sr].ServiceHours + oldServiceHistory[sr].ExtraHours).toString().split(".");
                                    if (endTime[1]) {
                                        endTime[1] = (parseInt(endTime[1]) * 6).toString();
                                    }
                                    else {
                                        endTime[1] = "00";
                                    }
                                    obj = {
                                        ServiceRequestId: oldServiceHistory[sr].ServiceRequestId,
                                        ServiceStartDate: oldServiceHistory[sr].ServiceStartDate.toString().split("-").reverse().join("-"),
                                        ServiceHours: oldServiceHistory[sr].ServiceHours,
                                        Username: (u === null || u === void 0 ? void 0 : u.firstName) + " " + (u === null || u === void 0 ? void 0 : u.lastName),
                                        Address: {
                                            Street: sa === null || sa === void 0 ? void 0 : sa.Addressline1,
                                            HouseNumber: sa === null || sa === void 0 ? void 0 : sa.Addressline2,
                                            City: sa === null || sa === void 0 ? void 0 : sa.City,
                                            PostalCode: sa === null || sa === void 0 ? void 0 : sa.PostalCode,
                                        },
                                        ServiceStartTime: startTime[0] + ":" + startTime[1] + "-" + endTime[0] + ":" + endTime[1]
                                    };
                                    services.push(obj);
                                    _c.label = 4;
                                case 4:
                                    _i++;
                                    return [3 /*break*/, 1];
                                case 5: return [2 /*return*/, res.status(200).json(services)];
                                case 6: return [2 /*return*/, res.status(404).json({ msg: "Past service history is not available" })];
                                case 7: return [3 /*break*/, 9];
                                case 8: return [2 /*return*/, res.status(404).json({ msg: "Service history not found" })];
                                case 9: return [2 /*return*/];
                            }
                        });
                    }); })
                        .catch(function (error) {
                        return res.status(500).json({ error: error });
                    })];
            });
        }); };
        this.getServiceHistoryDetail = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.spPageService.getServiceAddress(+req.params.addressId)
                        .then(function (address) {
                        if (!address) {
                            return res.status(404).json({ error: "Service Request address not found" });
                        }
                        else {
                            return _this.spPageService.getCustomer(req.body.user.id)
                                .then(function (user) {
                                if (!user) {
                                    return res.status(201).json({ msg: "User detail not found for this request" });
                                }
                                else {
                                    return _this.spPageService.getServiceRequest(address.ServiceRequestId)
                                        .then(function (customer) {
                                        if (!customer) {
                                            return res.status(201).json({ msg: "No service request found" });
                                        }
                                        else {
                                            return res.status(200).json({ customer: customer });
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
                            });
                        }
                    })
                        .catch(function (error) {
                        console.log(error);
                        return res.status(500).json({ error: error });
                    })];
            });
        }); };
        this.downloadExcelData = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var historyData;
            var _this = this;
            return __generator(this, function (_a) {
                historyData = [];
                return [2 /*return*/, this.spPageService.getSPServiceHistory(parseInt(req.body.user.id))
                        .then(function (historydata) { return __awaiter(_this, void 0, void 0, function () {
                        var checkDate, workbook, worksheet;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (!historydata) return [3 /*break*/, 4];
                                    checkDate = this.spPageService.compareDateWithCurrentDate(historydata);
                                    if (!(historydata.length > 0)) return [3 /*break*/, 2];
                                    return [4 /*yield*/, this.spPageService.getExcelDataForExport(checkDate)];
                                case 1:
                                    historyData = _a.sent();
                                    workbook = new exceljs_1.default.Workbook();
                                    worksheet = workbook.addWorksheet("Service Provider history");
                                    worksheet.columns = [
                                        { header: "ServiceId", key: "ServiceId", width: 25 },
                                        { header: "StartDate", key: "StartDate", width: 25 },
                                        { header: "Customer", key: "Customer", width: 25 },
                                        { header: "Payment", key: "Payment", width: 15 },
                                    ];
                                    worksheet.addRows(historyData);
                                    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
                                    res.setHeader("Content-Disposition", "attachment; filename=" + "ServiceProviderHistory.xlsx");
                                    return [2 /*return*/, workbook.xlsx.write(res).then(function (err) {
                                            res.status(200).end();
                                        })];
                                case 2: return [2 /*return*/, res.status(404).json({ msg: "History data not found" })];
                                case 3: return [3 /*break*/, 5];
                                case 4: return [2 /*return*/, res.status(402).json(" msg: History data not found ")];
                                case 5: return [2 /*return*/];
                            }
                        });
                    }); })
                        .catch(function (error) {
                        console.log(error);
                        return res.status(500).json({ error: error });
                    })];
            });
        }); };
        ////////////////////////////////////////////////////// 6.5 My Ratings API ////////////////////////////////////////////////
        this.getSPRatings = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                if (req.body.user.id && req.body.user.userTypeId === 3) {
                    return [2 /*return*/, this.spPageService.getSPRatings(req.body.user.id)
                            .then(function (rating) { return __awaiter(_this, void 0, void 0, function () {
                            var ratings, _a, _b, _i, star, srDetail, startTime, endTime, uDetail, ratingObj;
                            return __generator(this, function (_c) {
                                switch (_c.label) {
                                    case 0:
                                        if (!rating) return [3 /*break*/, 6];
                                        ratings = [];
                                        _a = [];
                                        for (_b in rating)
                                            _a.push(_b);
                                        _i = 0;
                                        _c.label = 1;
                                    case 1:
                                        if (!(_i < _a.length)) return [3 /*break*/, 5];
                                        star = _a[_i];
                                        return [4 /*yield*/, this.spPageService.getServiceRequestDetailById(rating[star].ServiceRequestId)];
                                    case 2:
                                        srDetail = _c.sent();
                                        startTime = srDetail === null || srDetail === void 0 ? void 0 : srDetail.ServiceStartTime.toString().split(":");
                                        endTime = (parseFloat(startTime[0]) + parseFloat(startTime[1]) / 60 + (srDetail === null || srDetail === void 0 ? void 0 : srDetail.ServiceHours) + (srDetail === null || srDetail === void 0 ? void 0 : srDetail.ExtraHours)).toString().split(".");
                                        if (endTime[1]) {
                                            endTime[1] = (parseInt(endTime[1]) * 6).toString();
                                        }
                                        else {
                                            endTime[1] = "00";
                                        }
                                        return [4 /*yield*/, models_1.default.Users.findOne({ where: { id: rating[star].RatingFrom } })];
                                    case 3:
                                        uDetail = _c.sent();
                                        ratingObj = {
                                            ServiceRequestId: rating[star].ServiceRequestId,
                                            ServiceStartDate: srDetail === null || srDetail === void 0 ? void 0 : srDetail.ServiceStartDate.toString().split("-").reverse().join("-"),
                                            Username: (uDetail === null || uDetail === void 0 ? void 0 : uDetail.firstName) + " " + (uDetail === null || uDetail === void 0 ? void 0 : uDetail.lastName),
                                            Comments: rating[star].Comments,
                                            Ratings: rating[star].Ratings,
                                            ServiceStartTime: startTime[0] + ":" + startTime[1] + "-" + endTime[0] + ":" + endTime[1]
                                        };
                                        ratings.push(ratingObj);
                                        _c.label = 4;
                                    case 4:
                                        _i++;
                                        return [3 /*break*/, 1];
                                    case 5: return [2 /*return*/, res.status(200).json(ratings)];
                                    case 6: return [2 /*return*/, res.status(404).json({ msg: "Ratings not found" })];
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
        ////////////////////////////////////////////////////// 6.6 Block User API ////////////////////////////////////////////////
        this.getUserWorkedWithSP = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var user, serviceProvider, _a, _b, _i, sp, customer, userIds_1, filterArray;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!req.body.user.id) return [3 /*break*/, 6];
                        user = [];
                        return [4 /*yield*/, this.spPageService.getSPServiceHistory(req.body.user.id)];
                    case 1:
                        serviceProvider = _c.sent();
                        if (!serviceProvider) return [3 /*break*/, 5];
                        _a = [];
                        for (_b in serviceProvider)
                            _a.push(_b);
                        _i = 0;
                        _c.label = 2;
                    case 2:
                        if (!(_i < _a.length)) return [3 /*break*/, 5];
                        sp = _a[_i];
                        return [4 /*yield*/, this.spPageService.getCustomer(serviceProvider[sp].UserId)];
                    case 3:
                        customer = _c.sent();
                        if (customer) {
                            user.push({
                                Name: customer.firstName + " " + customer.lastName,
                                UserId: customer.id
                            });
                        }
                        _c.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 2];
                    case 5:
                        userIds_1 = user.map(function (o) { return o.UserId; });
                        filterArray = user.filter(function (_a, index) {
                            var UserId = _a.UserId;
                            return !userIds_1.includes(UserId, index + 1);
                        });
                        if (filterArray) {
                            return [2 /*return*/, res.status(200).json(filterArray)];
                        }
                        else {
                            return [2 /*return*/, res.status(404).json({ msg: "User not found" })];
                        }
                        return [3 /*break*/, 7];
                    case 6: return [2 /*return*/, res.status(401).json({ msg: "User not found" })];
                    case 7:
                        ;
                        return [2 /*return*/];
                }
            });
        }); };
        this.createBlockUser = function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            var matched, user, serviceProvider, _a, _b, _i, sp, customer, userIds_2, filterArray, us;
            var _this = this;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!req.body.user.id) return [3 /*break*/, 8];
                        req.body.TargetUserId = parseInt(req.params.customerId);
                        if (!req.body.IsBlocked) return [3 /*break*/, 6];
                        matched = false;
                        user = [];
                        return [4 /*yield*/, this.spPageService.getSPServiceHistory(req.body.user.id)];
                    case 1:
                        serviceProvider = _c.sent();
                        if (!serviceProvider) return [3 /*break*/, 5];
                        _a = [];
                        for (_b in serviceProvider)
                            _a.push(_b);
                        _i = 0;
                        _c.label = 2;
                    case 2:
                        if (!(_i < _a.length)) return [3 /*break*/, 5];
                        sp = _a[_i];
                        return [4 /*yield*/, this.spPageService.getCustomer(serviceProvider[sp].UserId)];
                    case 3:
                        customer = _c.sent();
                        if (customer) {
                            user.push({
                                Name: customer.firstName + " " + customer.lastName,
                                UserId: customer.id
                            });
                        }
                        _c.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 2];
                    case 5:
                        userIds_2 = user.map(function (o) { return o.UserId; });
                        filterArray = user.filter(function (_a, index) {
                            var UserId = _a.UserId;
                            return !userIds_2.includes(UserId, index + 1);
                        });
                        if (filterArray) {
                            for (us in filterArray) {
                                if (filterArray[us].UserId === parseInt(req.params.customerId)) {
                                    matched = true;
                                    break;
                                }
                                else {
                                    matched = false;
                                }
                            }
                        }
                        else {
                            matched = false;
                        }
                        if (matched) {
                            return [2 /*return*/, this.spPageService.getBlockedUser(req.body.user.id, req.params.customerId)
                                    .then(function (blockedCS) {
                                    if (blockedCS && blockedCS.IsBlocked) {
                                        return res.status(201).json({ msg: "User already blocked" });
                                    }
                                    else if (blockedCS && blockedCS.IsBlocked === false) {
                                        return _this.spPageService.blockUser(req.body.user.id, req.params.customerId)
                                            .then(function (addBlockCS) {
                                            if (addBlockCS[0] === 1) {
                                                return res.status(200).json({ msg: 'User block successfully' });
                                            }
                                            else {
                                                return res.status(200).json({ msg: 'User cannot block' });
                                            }
                                        })
                                            .catch(function (error) {
                                            console.log(error);
                                            return res.status(500).json({ error: error });
                                        });
                                    }
                                    else {
                                        req.body.UserId = req.body.user.id;
                                        req.body.IsFavorite = false;
                                        return _this.spPageService.createBlockUser(req.body)
                                            .then(function (blockUser) {
                                            if (blockUser) {
                                                return res.status(200).json(blockUser);
                                            }
                                            else {
                                                return res.status(404).json({ msg: "Cannot block user" });
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
                            return [2 /*return*/, res.status(400).json({ message: 'helper has not worked for this customer' })];
                        }
                        return [3 /*break*/, 7];
                    case 6:
                        next();
                        _c.label = 7;
                    case 7: return [3 /*break*/, 9];
                    case 8: return [2 /*return*/, res.status(404).json({ msg: "User not found" })];
                    case 9: return [2 /*return*/];
                }
            });
        }); };
        this.unBlockUser = function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                if (req.body.IsBlocked === false) {
                    return [2 /*return*/, this.spPageService.getBlockedUser(req.body.user.id, req.params.customerId)
                            .then(function (blockUser) {
                            if (blockUser && blockUser.IsBlocked) {
                                return _this.spPageService.unBlockUser(req.body.user.id, req.params.customerId)
                                    .then(function (updateBlockCS) {
                                    if (updateBlockCS[0] === 1) {
                                        return res.status(200).json({ message: 'User block successfully' });
                                    }
                                    else {
                                        return res.status(422).json({ message: 'Cannot block user' });
                                    }
                                })
                                    .catch(function (error) {
                                    console.log(error);
                                    return res.status(500).json({ error: error });
                                });
                            }
                            else if (blockUser && blockUser.IsBlocked === false) {
                                return res.status(201).json({ message: 'User is already in unblock mode' });
                            }
                            else {
                                return res.status(404).json({ message: 'no customer in blocklist to unblock' });
                            }
                        })
                            .catch(function (error) {
                            console.log(error);
                            return res.status(500).json({ error: error });
                        })];
                }
                else {
                    return [2 /*return*/, res.status(400).json({ message: 'Something went wrong' })];
                }
                return [2 /*return*/];
            });
        }); };
        ////////////////////////////////////////////////////// 6.7 My settings API ////////////////////////////////////////////////
        this.getUserDetailById = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var userId;
            var _this = this;
            return __generator(this, function (_a) {
                userId = req.body.user.id;
                if (userId && req.body.user.userTypeId == 3) {
                    return [2 /*return*/, this.spPageService
                            .getSPaddress(userId)
                            .then(function (userDetail) {
                            if (userDetail) {
                                return _this.spPageService.getSPDetailById(userDetail.UserId)
                                    .then(function (detail) {
                                    if (userId === (detail === null || detail === void 0 ? void 0 : detail.id)) {
                                        return res.status(200).json({ detail: detail });
                                    }
                                    else {
                                        return res.status(404).json({ msg: "User detail not found" });
                                    }
                                });
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
        this.updateMyDetails = function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (req.body.user.id) {
                    req.body.dateOfBirth = this.spPageService.convertStringtoDate(req.body.dateOfBirth);
                    return [2 /*return*/, this.spPageService.updateMyDetails(req.body, req.body.user.id)
                            .then(function (user) {
                            if (!user) {
                                return res.status(401).json({ msg: "Error!! while updating detail" });
                            }
                            else {
                                next();
                            }
                        })
                            .catch(function (error) {
                            return res.status(500).json({ error: error });
                        })];
                }
                else {
                    return [2 /*return*/, res.status(400).json({ msg: "User not found" })];
                }
                return [2 /*return*/];
            });
        }); };
        this.updateAddMyAddress = function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            var userId;
            var _this = this;
            return __generator(this, function (_a) {
                userId = req.body.user.id;
                if (userId && req.body.user.userTypeId === 3) {
                    return [2 /*return*/, this.spPageService.getSPaddress(userId)
                            .then(function (spAddress) {
                            if (spAddress) {
                                return _this.spPageService.updateAddMyAddress(req.body, spAddress.AddressId)
                                    .then(function (newSPAddress) {
                                    if (newSPAddress) {
                                        return res.status(200).json({ msg: "Address Updated" });
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
                            else {
                                return _this.spPageService.createNewAddress(userId, req.body)
                                    .then(function (spAddress) {
                                    if (spAddress) {
                                        return res.status(200).json({ spAddress: spAddress, msg: "Address added successfully" });
                                    }
                                    else {
                                        return res.status(404).json({ msg: "Error!! Cannot create or add address" });
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
                    return [2 /*return*/, res.status(404).json({ msg: "User not found" })];
                }
                return [2 /*return*/];
            });
        }); };
        this.changeSPPassword = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.spPageService.changePassById(req.body.user.id)
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
                                    return [2 /*return*/, this.spPageService.changeSPPassword(user.password, req.body.user.id)
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
        this.spPageService = spPageService;
    }
    return SPPageController;
}());
exports.SPPageController = SPPageController;
