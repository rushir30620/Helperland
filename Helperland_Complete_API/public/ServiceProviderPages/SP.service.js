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
exports.SPPageService = void 0;
var moment_1 = __importDefault(require("moment"));
var models_1 = __importDefault(require("../models"));
var SPPageService = /** @class */ (function () {
    function SPPageService(spPageRepository) {
        this.spPageRepository = spPageRepository;
        this.spPageRepository = spPageRepository;
    }
    //////////////////////////// 6.1 Accept Service Request API /////////////////////////
    SPPageService.prototype.getServiceRequest = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.spPageRepository.getServiceRequest(userId)];
            });
        });
    };
    SPPageService.prototype.getCustomer = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.spPageRepository.getCustomer(userId)];
            });
        });
    };
    SPPageService.prototype.getServiceAddress = function (addressId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.spPageRepository.getServiceAddress(addressId)];
            });
        });
    };
    SPPageService.prototype.getServiceRequestById = function (serviceRequestId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.spPageRepository.getServiceRequestById(parseInt(serviceRequestId))];
            });
        });
    };
    SPPageService.prototype.getAcceptedServiceRequest = function (serviceRequestId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.spPageRepository.getAcceptedServiceRequest(serviceRequestId)];
            });
        });
    };
    SPPageService.prototype.getServiceProvider = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.spPageRepository.getServiceProvider(userId)];
            });
        });
    };
    SPPageService.prototype.getAllServiceRequestsOfHelper = function (helperId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.spPageRepository.getAllServiceRequestsOfHelper(parseInt(helperId))];
            });
        });
    };
    SPPageService.prototype.getServiceRequestByZipcode = function (zipcode, spId) {
        return __awaiter(this, void 0, void 0, function () {
            var Request, serviceRequest, blockUser;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        Request = [];
                        return [4 /*yield*/, this.spPageRepository.getServiceRequestByZipcode(zipcode)];
                    case 1:
                        serviceRequest = _a.sent();
                        return [4 /*yield*/, this.spPageRepository.getBlockedUserById(parseInt(spId))];
                    case 2:
                        blockUser = _a.sent();
                        if (serviceRequest) {
                            if (blockUser) {
                                Request = serviceRequest.filter(function (sr) { return !blockUser.find(function (rm) { return (rm.TargetUserId === sr.UserId); }); });
                            }
                        }
                        return [2 /*return*/, Request];
                }
            });
        });
    };
    SPPageService.prototype.filterServiceRequestsCompatibleWithHelper = function (includePets, serviceRequests) {
        return __awaiter(this, void 0, void 0, function () {
            var sRequests, sr;
            return __generator(this, function (_a) {
                sRequests = [];
                if (includePets === false) {
                    for (sr in serviceRequests) {
                        if (serviceRequests[sr].HasPets === false) {
                            sRequests.push(serviceRequests[sr]);
                        }
                    }
                }
                else {
                    return [2 /*return*/, serviceRequests];
                }
                return [2 /*return*/, sRequests];
            });
        });
    };
    SPPageService.prototype.displayRequestDetail = function (srequest) {
        return __awaiter(this, void 0, void 0, function () {
            var services, _a, _b, _i, sr, requestAddress, user, startTime, endTime;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        services = [];
                        _a = [];
                        for (_b in srequest)
                            _a.push(_b);
                        _i = 0;
                        _c.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 5];
                        sr = _a[_i];
                        return [4 /*yield*/, models_1.default.ServiceRequestAddress.findOne({ where: { ServiceRequestId: srequest[sr].ServiceRequestId } })];
                    case 2:
                        requestAddress = _c.sent();
                        return [4 /*yield*/, models_1.default.Users.findOne({ where: { id: srequest[sr].UserId } })];
                    case 3:
                        user = _c.sent();
                        startTime = srequest[sr].ServiceStartTime.toString().split(":");
                        endTime = (parseFloat(startTime[0]) + parseFloat(startTime[1]) / 60 + srequest[sr].ServiceHours + srequest[sr].ExtraHours).toString().split(".");
                        if (endTime[1]) {
                            endTime[1] = (parseInt(endTime[1]) * 6).toString();
                        }
                        else {
                            endTime[1] = "00";
                        }
                        if (user) {
                            if (requestAddress) {
                                services.push({
                                    ServiceRequestId: srequest[sr].ServiceRequestId,
                                    ServiceStartDate: srequest[sr].ServiceStartDate.toString().split("-").reverse().join("-"),
                                    ServiceStartTime: startTime[0] + ":" + startTime[1] + "-" + endTime[0] + ":" + endTime[1],
                                    Customer: user.firstName + " " + user.lastName,
                                    Address: {
                                        Street: requestAddress.Addressline1,
                                        HouseNumber: requestAddress.Addressline2,
                                        City: requestAddress.City,
                                        PostalCode: requestAddress.PostalCode,
                                    },
                                    Payment: srequest[sr].TotalCost + " €"
                                });
                            }
                        }
                        _c.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 1];
                    case 5: return [2 /*return*/, services];
                }
            });
        });
    };
    SPPageService.prototype.helperHasFutureSameDateAndTime = function (date, serviceRequest, acceptTotalHour, time) {
        var srId;
        var matched = false;
        for (var sr in serviceRequest) {
            if (serviceRequest[sr].ServiceStartDate.toLocaleDateString() === date.toLocaleDateString()) {
                var acceptTime = time.toString().split(":");
                if (acceptTime[1] === "30") {
                    acceptTime[1] = "0.5";
                }
                var acceptStartTime = parseFloat(acceptTime[0]) + parseFloat(acceptTime[1]);
                var availableTime = serviceRequest[sr].ServiceStartTime.toString().split(":");
                if (availableTime[1] === "30") {
                    availableTime[1] = "0.5";
                }
                var availableStartTime = parseFloat(availableTime[0]) + parseFloat(availableTime[1]);
                var availableTotalHour = serviceRequest[sr].ServiceHours + serviceRequest[sr].ExtraHours;
                var totalAcceptTime = acceptStartTime + acceptTotalHour + 1;
                var totalAvailableTime = availableStartTime + availableTotalHour + 1;
                if (availableStartTime >= totalAcceptTime ||
                    acceptStartTime >= totalAvailableTime) {
                    matched = false;
                }
                else {
                    srId = serviceRequest[sr].ServiceRequestId;
                    matched = true;
                    break;
                }
            }
            else {
                matched = false;
            }
        }
        return { matched: matched, srId: srId };
    };
    SPPageService.prototype.mailData = function (userEmail, serviceRequestId) {
        var mailOptions = {
            from: process.env.USER,
            to: userEmail,
            subject: "Service Request Assigned",
            html: "<h3>A service request ".concat(serviceRequestId, " has already been accepted by someone and is no more available to you.</h3>")
        };
        return mailOptions;
    };
    //////////////////////////// 6.2 Upcoming Service API /////////////////////////
    SPPageService.prototype.getUpcomingService = function (spId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.spPageRepository.getUpcomingService(parseInt(spId))];
            });
        });
    };
    SPPageService.prototype.getServiceRequestwithId = function (serviceId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.spPageRepository.getServiceRequestwithId(parseInt(serviceId))];
            });
        });
    };
    SPPageService.prototype.completeService = function (serviceId, spId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.spPageRepository.completeService(parseInt(serviceId), parseInt(spId))];
            });
        });
    };
    SPPageService.prototype.compareCurrentAndServiceDateTime = function (serviceRequest) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var serviceDate, currentDate, time, serviceTime, serviceTotalTime, currentTotalTime;
            return __generator(this, function (_b) {
                serviceDate = new Date((_a = serviceRequest) === null || _a === void 0 ? void 0 : _a.ServiceStartDate);
                currentDate = new Date((0, moment_1.default)(new Date()).format("YYYY-MM-DD"));
                time = serviceRequest.ServiceStartTime.toString().split(":");
                serviceTime = parseFloat(time[0]) + parseFloat(time[1]) / 60;
                serviceTotalTime = serviceTime + serviceRequest.ServiceHours + serviceRequest.ExtraHours;
                currentTotalTime = new Date().getHours() + new Date().getMinutes() / 60;
                if (serviceDate < currentDate) {
                    return [2 /*return*/, serviceRequest];
                }
                else if (serviceDate > currentDate) {
                    return [2 /*return*/, null];
                }
                else {
                    if (serviceTotalTime < currentTotalTime) {
                        return [2 /*return*/, serviceRequest];
                    }
                    else {
                        return [2 /*return*/, null];
                    }
                }
                return [2 /*return*/];
            });
        });
    };
    //////////////////////////// 6.4 Service history API /////////////////////////
    SPPageService.prototype.getSPServiceHistory = function (spId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.spPageRepository.getSPServiceHistory(spId)];
            });
        });
    };
    SPPageService.prototype.getServiceRequestDetailById = function (srId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.spPageRepository.getServiceRequestDetailById(srId)];
            });
        });
    };
    SPPageService.prototype.getSPRatings = function (spId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.spPageRepository.getSPRatings(parseInt(spId))];
            });
        });
    };
    SPPageService.prototype.compareDateWithCurrentDate = function (requestHistory) {
        var srHistory = [];
        var formatedDate2 = new Date((0, moment_1.default)(new Date()).format("YYYY-MM-DD"));
        for (var sr in requestHistory) {
            var date = requestHistory[sr].ServiceStartDate;
            var formatedDate1 = new Date((0, moment_1.default)(date).format("YYYY-MM-DD"));
            if (formatedDate1 <= formatedDate2) {
                srHistory.push(requestHistory[sr]);
            }
        }
        return srHistory;
    };
    SPPageService.prototype.getExcelDataForExport = function (serviceRequest) {
        return __awaiter(this, void 0, void 0, function () {
            var historyData, _a, _b, _i, history_1, user;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        historyData = [];
                        _a = [];
                        for (_b in serviceRequest)
                            _a.push(_b);
                        _i = 0;
                        _c.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 4];
                        history_1 = _a[_i];
                        return [4 /*yield*/, this.spPageRepository.getCustomer(serviceRequest[history_1].UserId)];
                    case 2:
                        user = _c.sent();
                        historyData.push({
                            ServiceId: serviceRequest[history_1].ServiceRequestId,
                            StartDate: serviceRequest[history_1].ServiceStartDate,
                            Customer: (user === null || user === void 0 ? void 0 : user.firstName) + " " + (user === null || user === void 0 ? void 0 : user.lastName),
                            Payment: serviceRequest[history_1].TotalCost,
                        });
                        _c.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/, historyData];
                }
            });
        });
    };
    //////////////////////////// 6.7 My settings API /////////////////////////
    SPPageService.prototype.getBlockedUser = function (spId, targetId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.spPageRepository.getBlockedUser(parseInt(spId), parseInt(targetId))];
            });
        });
    };
    SPPageService.prototype.blockUser = function (spId, targetId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.spPageRepository.blockUser(parseInt(spId), parseInt(targetId))];
            });
        });
    };
    SPPageService.prototype.unBlockUser = function (spId, targetId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.spPageRepository.unBlockUser(parseInt(spId), parseInt(targetId))];
            });
        });
    };
    SPPageService.prototype.createBlockUser = function (blockedUser) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.spPageRepository.createBlockUser(blockedUser)];
            });
        });
    };
    //////////////////////////// 6.7 My settings API /////////////////////////
    SPPageService.prototype.getSPDetailById = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.spPageRepository.getSPDetailById(userId)];
            });
        });
    };
    SPPageService.prototype.getSPaddress = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.spPageRepository.getSPaddress(userId)];
            });
        });
    };
    SPPageService.prototype.updateMyDetails = function (sp, userId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.spPageRepository.updateMyDetails(sp, userId)];
            });
        });
    };
    SPPageService.prototype.updateAddMyAddress = function (address, addressId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.spPageRepository.updateAddMyAddress(address, addressId)];
            });
        });
    };
    SPPageService.prototype.createNewAddress = function (userId, userAddress) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.spPageRepository.createNewAddress(userId, userAddress)];
            });
        });
    };
    SPPageService.prototype.changePassById = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.spPageRepository.changePassById(userId)];
            });
        });
    };
    SPPageService.prototype.changeSPPassword = function (password, userId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.spPageRepository.changeSPPassword(password, userId)];
            });
        });
    };
    SPPageService.prototype.convertStringtoDate = function (date) {
        var updateddate = date.toString().split('-').reverse().join('-');
        var convertedDate = new Date(updateddate);
        return convertedDate;
    };
    return SPPageService;
}());
exports.SPPageService = SPPageService;
