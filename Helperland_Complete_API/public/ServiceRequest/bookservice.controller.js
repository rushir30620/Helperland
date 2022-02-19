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
exports.ServiceBookController = void 0;
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var ServiceBookController = /** @class */ (function () {
    function ServiceBookController(serviceBook) {
        var _this = this;
        this.serviceBook = serviceBook;
        this.serviceSetup = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var zipCode;
            var _this = this;
            return __generator(this, function (_a) {
                zipCode = [];
                if (!req.body.postalcode) {
                    return [2 /*return*/, res.status(301).json({
                            msg: "Please Enter Zipcode"
                        })];
                }
                else {
                    return [2 /*return*/, this.serviceBook.getAllServiceProvider()
                            .then(function (serviceProviders) {
                            var isPresent = false;
                            if (serviceProviders.length > 0) {
                                for (var sp in serviceProviders) {
                                    // console.log(req.body.postalcode);
                                    if (serviceProviders[sp].zipCode == req.body.postalcode) {
                                        isPresent = true;
                                    }
                                }
                                console.log(isPresent);
                                if (isPresent === true) {
                                    jsonwebtoken_1.default.verify(req.headers.authorization, process.env.JWT_KEY, function (err, user) {
                                        if (err) {
                                            return res.status(403).json({ msg: "Invalid Token" });
                                        }
                                        else {
                                            var userEmail = user.userEmail;
                                            var postalcode = req.body.postalcode;
                                            var token = _this.serviceBook.createToken(userEmail, postalcode);
                                            return res.status(200).cookie("token", token, { httpOnly: true });
                                        }
                                    });
                                    return res.status(200).json({ msg: "Service Provider Found" });
                                }
                                else {
                                    return res.status(301).json({ msg: "We are not providing service in this area. We will notify you if any helper would start working near your area." });
                                }
                            }
                            else {
                                return res.status(301).json({ msg: "No Service Provider Present." });
                            }
                        })
                            .catch(function (error) {
                            console.log(error);
                            return res.status(500).json({ error: error });
                        })];
                }
                return [2 /*return*/];
            });
        }); };
        this.tokenDecode = function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            var token;
            var _this = this;
            return __generator(this, function (_a) {
                token = req.headers.authorization;
                if (token) {
                    jsonwebtoken_1.default.verify(token, process.env.JWT_KEY, function (err, user) {
                        if (err) {
                            return res.status(403).json({ msg: "Invalid Token" });
                        }
                        else {
                            console.log(user);
                            req.body.ZipCode = user.postalcode;
                            req.body.email = user.userEmail;
                            return _this.serviceBook.getUserWithEmail(user.userEmail)
                                .then(function (user) {
                                // console.log(user?.userTypeId);
                                var abc = user === null || user === void 0 ? void 0 : user.userTypeId;
                                console.log(abc);
                                if (abc == 1) {
                                    next();
                                }
                                else {
                                    return res.status(301).json({ message: 'Please Use Your User Account!!' });
                                }
                            })
                                .catch(function (error) {
                                console.log(error);
                                return res.status(500).json({
                                    error: error,
                                });
                            });
                        }
                    });
                }
                else {
                    return [2 /*return*/, res.status(301).json('Token is not available')];
                }
                ;
                return [2 /*return*/];
            });
        }); };
        this.createScheduleRequest = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var token;
            var _this = this;
            return __generator(this, function (_a) {
                token = req.headers.authorization;
                req.body.ServiceHourlyRate = 18;
                req.body.ExtraHours = req.body.ExtraService.length * 0.5;
                req.body.SubTotal = req.body.ServiceHourlyRate * req.body.ServiceHours;
                req.body.TotalCost = req.body.ExtraService.length * 9 + req.body.SubTotal;
                req.body.ServiceRequestAddress.email = req.body.email;
                return [2 /*return*/, this.serviceBook.getUserWithEmail(req.body.email)
                        .then(function (user) {
                        if (user) {
                            if (user.userTypeId === 1) {
                                req.body.UserId = user.id;
                                req.body.ModifiedBy = user.id;
                            }
                            else {
                                return res.status(301).json({ msg: "Please Use Your User Account!!" });
                            }
                        }
                        else {
                            return res.status(301).json("User not found");
                        }
                        return _this.serviceBook.createScheduleRequestWithAddress(req.body)
                            .then(function (request) {
                            return res.status(200).json(request);
                        })
                            .catch(function (error) {
                            console.log(error);
                            return res.status(500).json({
                                error: error,
                            });
                        });
                    })
                        .catch(function (error) {
                        console.log(error);
                        return res.status(500).json({
                            error: error,
                        });
                    })];
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
                            req.body.email = user.userEmail;
                            req.body.PostalCode = user.postalcode;
                            return _this.serviceBook.getUserWithEmail(user.userEmail)
                                .then(function (user) {
                                if (user) {
                                    req.body.UserId = user.id;
                                    return _this.serviceBook.addNewAddress(req.body)
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
        this.getExistingAddress = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var existingAddress;
            var _this = this;
            return __generator(this, function (_a) {
                existingAddress = [];
                if (req.headers.authorization) {
                    jsonwebtoken_1.default.verify(req.headers.authorization, process.env.JWT_KEY, function (error, user) {
                        if (error) {
                            return res.status(403).json({ msg: "Invalid Token" });
                        }
                        else {
                            return _this.serviceBook.getUserWithEmail(user.userEmail)
                                .then(function (userWithEmail) {
                                if (userWithEmail) {
                                    return _this.serviceBook.getUserWithAddress(userWithEmail.id)
                                        .then(function (users) {
                                        if (users.length > 0) {
                                            for (var us in users) {
                                                if (users[us].PostalCode === user.postalcode) {
                                                    existingAddress.push(users[us]);
                                                }
                                            }
                                            if (existingAddress.length > 0) {
                                                return res.status(200).json(existingAddress);
                                            }
                                            else {
                                                return res.status(404).json({ msg: "Address Not Found" });
                                            }
                                        }
                                        else {
                                            return res.status(301).json({ msg: "Address Not Available!! Please add new address" });
                                        }
                                    })
                                        .catch(function (error) {
                                        console.log(error);
                                        return res.status(500).json({
                                            error: error,
                                        });
                                    });
                                }
                                else {
                                    return res.status(301).json("User not found");
                                }
                            })
                                .catch(function (error) {
                                console.log(error);
                                return res.status(500).json({
                                    error: error,
                                });
                            });
                        }
                    });
                }
                else {
                    return [2 /*return*/, res.status(301).json({ message: "Token not available" })];
                }
                return [2 /*return*/];
            });
        }); };
        this.getFavoriteAndBlockedSP = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                if (req.headers.authorization) {
                    jsonwebtoken_1.default.verify(req.headers.authorization, process.env.JWT_KEY, function (error, user) {
                        if (error) {
                            return res.status(403).json({ message: "Invalid token" });
                        }
                        else {
                            return _this.serviceBook.getUserWithEmail(user.userEmail)
                                .then(function (user) {
                                if (user === null) {
                                    return res.status(404).json({ message: "user not found" });
                                }
                                else {
                                    return _this.serviceBook.getFavoriteAndBlockedSP(user.id)
                                        .then(function (user) { return __awaiter(_this, void 0, void 0, function () {
                                        var serviceProvider, favoriteSP;
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0:
                                                    serviceProvider = [];
                                                    if (!(user === null)) return [3 /*break*/, 1];
                                                    return [2 /*return*/, res.status(404).json({ message: "user not found" })];
                                                case 1: return [4 /*yield*/, this.serviceBook.getTargetUser(user)];
                                                case 2:
                                                    favoriteSP = _a.sent();
                                                    if (favoriteSP.length > 0) {
                                                        return [2 /*return*/, this.serviceBook.getUserWithId(favoriteSP)
                                                                .then(function (helper) {
                                                                return res.status(200).json(helper);
                                                            })
                                                                .catch(function (error) {
                                                                console.log(error);
                                                                return res.status(500).json({
                                                                    error: error,
                                                                });
                                                            })];
                                                    }
                                                    else {
                                                        return [2 /*return*/, res.status(404).json({ message: "favorite helper not found" })];
                                                    }
                                                    _a.label = 3;
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
                            })
                                .catch(function (error) {
                                console.log(error);
                                return res.status(500).json({
                                    error: error,
                                });
                            });
                        }
                    });
                }
                else {
                    return [2 /*return*/, res.status(301).json({ message: "token not found" })];
                }
                return [2 /*return*/];
            });
        }); };
        this.serviceBook = serviceBook;
    }
    return ServiceBookController;
}());
exports.ServiceBookController = ServiceBookController;
