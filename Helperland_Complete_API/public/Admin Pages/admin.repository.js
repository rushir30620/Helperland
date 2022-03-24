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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminRepository = void 0;
var index_1 = require("../models/index");
var AdminRepository = /** @class */ (function () {
    function AdminRepository() {
    }
    /////////////////////////////////////////// 7.1 Service Requests API //////////////////////////////////////////////////
    AdminRepository.prototype.getAllServiceRequests = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, index_1.db.ServiceRequest.findAll()];
            });
        });
    };
    AdminRepository.prototype.getCustomerDetail = function (custId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, index_1.db.Users.findOne({ where: { id: custId, userTypeId: 4 } })];
            });
        });
    };
    AdminRepository.prototype.getSPDetail = function (spId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, index_1.db.Users.findOne({ where: { id: spId, userTypeId: 3 } })];
            });
        });
    };
    AdminRepository.prototype.getSRAddress = function (srId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, index_1.db.ServiceRequestAddress.findOne({ where: { ServiceRequestId: srId } })];
            });
        });
    };
    AdminRepository.prototype.getServiceRequest = function (serviceRequestId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, index_1.db.ServiceRequest.findOne({ where: { ServiceRequestId: serviceRequestId }, include: ["ServiceRequestAddress", "ExtraService"] })];
            });
        });
    };
    AdminRepository.prototype.getServiceRequestByZipcode = function (postalCode) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, index_1.db.ServiceRequest.findOne({ where: { ZipCode: postalCode } })];
            });
        });
    };
    AdminRepository.prototype.getAllSPRequest = function (helperId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, index_1.db.ServiceRequest.findAll({
                        where: { ServiceProviderId: helperId },
                    })];
            });
        });
    };
    // public async rescheduleDateandTime(date: Date,time: string,serviceId: number): Promise<[number, ServiceRequest[]]> {
    //     return db.ServiceRequest.update(
    //       { ServiceStartDate: date, ServiceStartTime: time },
    //       { where: { ServiceRequestId: serviceId } }
    //     );
    // }
    AdminRepository.prototype.rescheduleDateandTime = function (sr, serviceId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, index_1.db.ServiceRequest.update({ ServiceStartDate: new Date(sr.ServiceStartDate.toString().split("-").reverse().join('-')), ServiceStartTime: sr.ServiceStartTime, Comments: sr.Comments + sr.Note }, { where: { ServiceRequestId: serviceId } })];
            });
        });
    };
    // public async updateMyAddress(address: ServiceRequestAddress, addressId:number){
    //     return db.ServiceRequestAddress.update(address, { where: {ServiceRequestId: addressId}});
    // }
    AdminRepository.prototype.updateMyAddress = function (address, addressId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, index_1.db.ServiceRequestAddress.update({
                        Addressline1: address.serviceAddress.StreetName,
                        Addressline2: address.serviceAddress.HouseNumber,
                        PostalCode: address.serviceAddress.PostalCode,
                        City: address.serviceAddress.City
                    }, { where: { ServiceRequestId: addressId } })];
            });
        });
    };
    AdminRepository.prototype.getServiceRequests = function (srId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, index_1.db.ServiceRequest.findAll({ where: { ServiceRequestId: srId } })];
            });
        });
    };
    /////////////////////////////////////////// 7.2 Filters API //////////////////////////////////////////////////
    AdminRepository.prototype.searchByServiceId = function (serviceId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, index_1.db.ServiceRequest.findAll({ where: { ServiceRequestId: serviceId } })];
            });
        });
    };
    AdminRepository.prototype.searchByPostalcode = function (postalCode) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, index_1.db.ServiceRequest.findAll({ where: { ZipCode: postalCode } })];
            });
        });
    };
    AdminRepository.prototype.getUserByEmail = function (email) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, index_1.db.Users.findOne({ where: { email: email } })];
            });
        });
    };
    AdminRepository.prototype.getUserByName = function (name1, name2) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, index_1.db.Users.findOne({ where: { firstName: name1, lastName: name2 } })];
            });
        });
    };
    AdminRepository.prototype.searchByEmailAndNameWithUserID = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, index_1.db.ServiceRequest.findAll({ where: { UserId: userId } })];
            });
        });
    };
    AdminRepository.prototype.getServiceByStatus = function (status) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, index_1.db.ServiceRequest.findOne({ where: { Status: status } })];
            });
        });
    };
    AdminRepository.prototype.searchByStatus = function (status) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, index_1.db.ServiceRequest.findAll({ where: { Status: status } })];
            });
        });
    };
    AdminRepository.prototype.getServiceByHasIssue = function (hasIssue) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, index_1.db.ServiceRequest.findOne({ where: { HasIssue: hasIssue } })];
            });
        });
    };
    AdminRepository.prototype.searchByHasIssue = function (hasIssue) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, index_1.db.ServiceRequest.findAll({ where: { HasIssue: hasIssue } })];
            });
        });
    };
    AdminRepository.prototype.getServiceByDate = function (date) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, index_1.db.ServiceRequest.findOne({ where: { ServiceStartDate: date } })];
            });
        });
    };
    AdminRepository.prototype.searchByDate = function (date) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, index_1.db.ServiceRequest.findAll({ where: { ServiceStartDate: date } })];
            });
        });
    };
    /////////////////////////////////////////// 7.3 User Management API //////////////////////////////////////////////////
    AdminRepository.prototype.getAllUsers = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, index_1.db.Users.findAll()];
            });
        });
    };
    AdminRepository.prototype.getUserManageDetail = function (usId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, index_1.db.Users.findOne({ where: { id: usId, userTypeId: [3, 4] } })];
            });
        });
    };
    return AdminRepository;
}());
exports.AdminRepository = AdminRepository;
