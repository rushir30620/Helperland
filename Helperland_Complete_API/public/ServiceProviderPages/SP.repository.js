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
exports.SPPageRepository = void 0;
var index_1 = require("../models/index");
var SPPageRepository = /** @class */ (function () {
    function SPPageRepository() {
    }
    //////////////////////////// 6.1 Accept Service Request API /////////////////////////
    SPPageRepository.prototype.getServiceRequest = function (srId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, index_1.db.ServiceRequest.findAll({ where: { ServiceRequestId: srId }, include: ["CustomerRequest", "ServiceRequestAddress"] })];
            });
        });
    };
    SPPageRepository.prototype.getCustomer = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, index_1.db.Users.findOne({ where: { id: userId } })];
            });
        });
    };
    SPPageRepository.prototype.getServiceAddress = function (addressId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, index_1.db.ServiceRequestAddress.findOne({ where: { ServiceRequestId: addressId }, include: ["ServiceRequest"] })];
            });
        });
    };
    SPPageRepository.prototype.getServiceRequestById = function (serviceRequestId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, index_1.db.ServiceRequest.findOne({ where: { ServiceRequestId: serviceRequestId, Status: 1 }, include: ["ServiceRequestAddress", "ExtraService"] })];
            });
        });
    };
    SPPageRepository.prototype.getServiceProvider = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, index_1.db.Users.findAll({ where: { id: userId, userTypeId: 3 } })];
            });
        });
    };
    SPPageRepository.prototype.getAllServiceRequestsOfHelper = function (helperId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, index_1.db.ServiceRequest.findAll({ where: { ServiceProviderId: helperId, Status: 2 } })];
            });
        });
    };
    SPPageRepository.prototype.getServiceRequestByZipcode = function (zipcode) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, index_1.db.ServiceRequest.findAll({ where: { ZipCode: "361210", Status: 1 } })];
            });
        });
    };
    SPPageRepository.prototype.getBlockedUserById = function (spId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, index_1.db.FavoriteAndBlocked.findAll({ where: { UserId: spId, IsBlocked: true } })];
            });
        });
    };
    //////////////////////////// 6.2 Upcoming Service API /////////////////////////
    SPPageRepository.prototype.getUpcomingService = function (spId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, index_1.db.ServiceRequest.findAll({ where: { ServiceProviderId: spId, Status: 2 } })];
            });
        });
    };
    SPPageRepository.prototype.getServiceRequestwithId = function (serviceId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, index_1.db.ServiceRequest.findOne({ where: { ServiceRequestId: serviceId, Status: 2 } })];
            });
        });
    };
    SPPageRepository.prototype.completeService = function (serviceId, spId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, index_1.db.ServiceRequest.update({ Status: 3, ModifiedBy: spId }, { where: { ServiceRequestId: serviceId } })];
            });
        });
    };
    //////////////////////////// 6.4 Service history API /////////////////////////
    SPPageRepository.prototype.getSPServiceHistory = function (spId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, index_1.db.ServiceRequest.findAll({ where: { ServiceProviderId: spId, Status: 3 }, include: ["ServiceRequestAddress", "CustomerRequest"] })];
            });
        });
    };
    SPPageRepository.prototype.getServiceRequestDetailById = function (srId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, index_1.db.ServiceRequest.findOne({ where: { ServiceRequestId: srId }, include: ["ServiceRequestAddress", "ExtraService"], })];
            });
        });
    };
    SPPageRepository.prototype.getSPRatings = function (spId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, index_1.db.Rating.findAll({ where: { RatingTo: spId }, include: ["SPRating"] })];
            });
        });
    };
    //////////////////////////// 6.6 Block customer API /////////////////////////
    SPPageRepository.prototype.getBlockedUser = function (spId, targetId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, index_1.db.FavoriteAndBlocked.findOne({ where: { UserId: spId, TargetUserId: targetId } })];
            });
        });
    };
    SPPageRepository.prototype.blockUser = function (spId, targetId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, index_1.db.FavoriteAndBlocked.update({ IsBlocked: true }, { where: { UserId: spId, TargetUserId: targetId } })];
            });
        });
    };
    SPPageRepository.prototype.unBlockUser = function (spId, targetId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, index_1.db.FavoriteAndBlocked.update({ IsBlocked: false }, { where: { UserId: spId, TargetUserId: targetId } })];
            });
        });
    };
    SPPageRepository.prototype.createBlockUser = function (blockedUser) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, index_1.db.FavoriteAndBlocked.create(blockedUser)];
            });
        });
    };
    //////////////////////////// 6.7 My settings API /////////////////////////
    SPPageRepository.prototype.getSPDetailById = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, index_1.db.Users.findOne({ where: { id: userId, userTypeId: 3 }, include: ["UserAddress"] })];
            });
        });
    };
    SPPageRepository.prototype.getSPaddress = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, index_1.db.UserAddress.findOne({ where: { UserId: userId, IsDeleted: false }, include: ["Users"] })];
            });
        });
    };
    SPPageRepository.prototype.updateMyDetails = function (sp, userId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, index_1.db.Users.update({
                        firstName: sp.firstName,
                        lastName: sp.lastName,
                        mobile: sp.mobile,
                        dateOfBirth: sp.dateOfBirth,
                        nationalityId: sp.nationalityId,
                        gender: sp.gender,
                        ModifiedBy: userId,
                        zipCode: sp.userAddress.PostalCode
                    }, { where: { id: userId } })];
            });
        });
    };
    SPPageRepository.prototype.updateAddMyAddress = function (address, addressId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, index_1.db.UserAddress.update({
                        Addressline1: address.userAddress.StreetName,
                        Addressline2: address.userAddress.HouseNumber,
                        PostalCode: address.userAddress.PostalCode,
                        City: address.userAddress.City
                    }, { where: { AddressId: addressId } })];
            });
        });
    };
    SPPageRepository.prototype.createNewAddress = function (userId, userAddress) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, index_1.db.UserAddress.create({
                        Addressline1: userAddress.userAddress.StreetName,
                        Addressline2: userAddress.userAddress.HouseNumber,
                        PostalCode: userAddress.userAddress.PostalCode,
                        City: userAddress.userAddress.City,
                        IsDefault: true,
                        IsDeleted: false,
                        UserId: userId
                    })];
            });
        });
    };
    SPPageRepository.prototype.changeSPPassword = function (password, userId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, index_1.db.Users.update({ password: password }, { where: { id: userId } })];
            });
        });
    };
    SPPageRepository.prototype.changePassById = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, index_1.db.Users.findOne({ where: { id: userId } })];
            });
        });
    };
    return SPPageRepository;
}());
exports.SPPageRepository = SPPageRepository;
