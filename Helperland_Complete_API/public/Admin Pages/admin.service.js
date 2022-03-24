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
exports.AdminService = void 0;
var moment_1 = __importDefault(require("moment"));
var AdminService = /** @class */ (function () {
    function AdminService(adminRepository) {
        this.adminRepository = adminRepository;
        this.adminRepository = adminRepository;
    }
    ;
    /////////////////////////////////////////// 7.1 Service Requets API //////////////////////////////////////////////////
    AdminService.prototype.getAllServiceRequests = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.adminRepository.getAllServiceRequests()];
            });
        });
    };
    ;
    AdminService.prototype.getCustomerDetail = function (custId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.adminRepository.getCustomerDetail(custId)];
            });
        });
    };
    ;
    AdminService.prototype.getSPDetail = function (spId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.adminRepository.getSPDetail(spId)];
            });
        });
    };
    AdminService.prototype.getSRAddress = function (srId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.adminRepository.getSRAddress(srId)];
            });
        });
    };
    AdminService.prototype.getServiceRequest = function (serviceRequestId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.adminRepository.getServiceRequest(serviceRequestId)];
            });
        });
    };
    AdminService.prototype.getServiceRequestByZipcode = function (postalCode) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.adminRepository.getServiceRequestByZipcode(postalCode)];
            });
        });
    };
    AdminService.prototype.getAllSPRequest = function (helperId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.adminRepository.getAllSPRequest(helperId)];
            });
        });
    };
    ;
    AdminService.prototype.rescheduleDateandTime = function (sr, serviceId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.adminRepository.rescheduleDateandTime(sr, serviceId)];
            });
        });
    };
    AdminService.prototype.getSRaddress = function (srId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.adminRepository.getSRAddress(srId)];
            });
        });
    };
    AdminService.prototype.updateMyAddress = function (address, addressId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.adminRepository.updateMyAddress(address, addressId)];
            });
        });
    };
    AdminService.prototype.getServiceRequests = function (srId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.adminRepository.getServiceRequests(srId)];
            });
        });
    };
    AdminService.prototype.compareTwoDates = function (date) {
        var date1 = new Date(date.split("-").reverse().join("-"));
        var date2 = new Date((0, moment_1.default)(new Date()).format("YYYY-MM-DD"));
        if (date1 > date2) {
            return true;
        }
        else {
            return false;
        }
    };
    AdminService.prototype.mailData = function (userEmail, serviceRequestId) {
        var mailOptions = {
            from: process.env.USER,
            to: userEmail,
            subject: "Service Request Rescheduled",
            html: "<h3>A service request ".concat(serviceRequestId, " has been rescheduled. Please check it out.</h3>")
        };
        return mailOptions;
    };
    ////////////////////////////////////////////// 7.2 Filters API ///////////////////////////////////////////////
    AdminService.prototype.searchByServiceId = function (serviceId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.adminRepository.searchByServiceId(serviceId)];
            });
        });
    };
    AdminService.prototype.searchByPostalcode = function (postalCode) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.adminRepository.searchByPostalcode(postalCode)];
            });
        });
    };
    AdminService.prototype.getUserByEmail = function (email) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.adminRepository.getUserByEmail(email)];
            });
        });
    };
    AdminService.prototype.getUserByName = function (name1, name2) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.adminRepository.getUserByName(name1, name2)];
            });
        });
    };
    AdminService.prototype.searchByEmailAndNameWithUserID = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.adminRepository.searchByEmailAndNameWithUserID(userId)];
            });
        });
    };
    AdminService.prototype.getServiceByStatus = function (status) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.adminRepository.getServiceByStatus(status)];
            });
        });
    };
    AdminService.prototype.searchByStatus = function (status) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.adminRepository.searchByStatus(status)];
            });
        });
    };
    AdminService.prototype.getServiceByHasIssue = function (hasIssue) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.adminRepository.getServiceByHasIssue(hasIssue)];
            });
        });
    };
    AdminService.prototype.searchByHasIssue = function (hasIssue) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.adminRepository.searchByHasIssue(hasIssue)];
            });
        });
    };
    AdminService.prototype.getServiceByDate = function (date) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.adminRepository.getServiceByDate(date)];
            });
        });
    };
    AdminService.prototype.searchByDate = function (date) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.adminRepository.searchByDate(date)];
            });
        });
    };
    AdminService.prototype.requestData = function (request) {
        return __awaiter(this, void 0, void 0, function () {
            var serviceDetail, _a, _b, _i, sr, user, address, helper, startTime, endTime;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        serviceDetail = [];
                        _a = [];
                        for (_b in request)
                            _a.push(_b);
                        _i = 0;
                        _c.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 6];
                        sr = _a[_i];
                        return [4 /*yield*/, this.adminRepository.getCustomerDetail(request[sr].UserId)];
                    case 2:
                        user = _c.sent();
                        return [4 /*yield*/, this.adminRepository.getSRAddress(request[sr].ServiceRequestId)];
                    case 3:
                        address = _c.sent();
                        return [4 /*yield*/, this.adminRepository.getSPDetail(request[sr].ServiceProviderId)];
                    case 4:
                        helper = _c.sent();
                        startTime = request[sr].ServiceStartTime.toString().split(":");
                        endTime = (parseFloat(startTime[0]) + parseFloat(startTime[1]) / 60 + request[sr].ServiceHours + request[sr].ExtraHours).toString().split(".");
                        if (endTime[1]) {
                            endTime[1] = (parseInt(endTime[1]) * 6).toString();
                        }
                        else {
                            endTime[1] = "00";
                        }
                        if (user && address && helper) {
                            serviceDetail.push({
                                ServiceId: request[sr].ServiceRequestId,
                                ServiceDate: request[sr].ServiceStartDate.toString().split("-").reverse().join("-"),
                                ServiceTime: startTime[0] + ":" + startTime[1] + "-" + endTime[0] + ":" + endTime[1],
                                Customer: user.firstName + " " + user.lastName,
                                serviceAddress: {
                                    Street: address.Addressline1,
                                    HouseNumber: address.Addressline2,
                                    City: address.City,
                                    PostalCode: address.PostalCode
                                },
                                ServiceProvider: helper.firstName + " " + helper.lastName,
                                GrossAmount: request[sr].TotalCost + " €",
                                NetAmount: request[sr].TotalCost + " €",
                                Discount: request[sr].Discount,
                                Status: request[sr].Status
                            });
                        }
                        _c.label = 5;
                    case 5:
                        _i++;
                        return [3 /*break*/, 1];
                    case 6: return [2 /*return*/, serviceDetail];
                }
            });
        });
    };
    AdminService.prototype.convertStringtoDate = function (date) {
        var updateddate = date.toString().split('-').reverse().join('-');
        var convertedDate = new Date(updateddate);
        return convertedDate;
    };
    /////////////////////////////////////////// 7.3 User Management API //////////////////////////////////////////////////
    AdminService.prototype.getAllUsers = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.adminRepository.getAllUsers()];
            });
        });
    };
    ;
    AdminService.prototype.getUserManageDetail = function (usId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.adminRepository.getUserManageDetail(usId)];
            });
        });
    };
    AdminService.prototype.userManageData = function (users) {
        return __awaiter(this, void 0, void 0, function () {
            var userDetail, _a, _b, _i, us, user, userType;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        userDetail = [];
                        _a = [];
                        for (_b in users)
                            _a.push(_b);
                        _i = 0;
                        _c.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 4];
                        us = _a[_i];
                        return [4 /*yield*/, this.adminRepository.getUserManageDetail(users[us].id)];
                    case 2:
                        user = _c.sent();
                        userType = void 0;
                        if ((user === null || user === void 0 ? void 0 : user.userTypeId) === 3) {
                            userType = "Service Provider";
                        }
                        else {
                            userType = "Customer";
                        }
                        if (user) {
                            userDetail.push({
                                UserName: user.firstName + " " + user.lastName,
                                DateOfRegistration: user.createdAt.toString().split("-").reverse().join("-"),
                                UserType: userType,
                                Phone: user.mobile,
                                PostalCode: user.zipCode,
                                Status: user.isRegisteredUser
                            });
                        }
                        _c.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/, userDetail];
                }
            });
        });
    };
    return AdminService;
}());
exports.AdminService = AdminService;
