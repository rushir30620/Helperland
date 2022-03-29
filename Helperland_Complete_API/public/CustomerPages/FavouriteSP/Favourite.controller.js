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
exports.FavouriteSPController = void 0;
require("dotenv").config();
var FavouriteSPController = /** @class */ (function () {
    function FavouriteSPController(favouriteSPService) {
        var _this = this;
        this.favouriteSPService = favouriteSPService;
        this.getSPworkedwithUser = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                if (req.body.user.id && req.body.user.userTypeId === 4) {
                    return [2 /*return*/, this.favouriteSPService.getAllServiceRequest(req.body.user.id)
                            .then(function (serviceRequest) {
                            var spId = [];
                            for (var sr in serviceRequest) {
                                if (serviceRequest[sr].Status === 3 && serviceRequest[sr].ServiceProviderId != null) {
                                    spId.push(serviceRequest[sr].ServiceProviderId);
                                }
                            }
                            if (spId.length > 0) {
                                return _this.favouriteSPService.getSPworkedwithUser(spId)
                                    .then(function (serviceProviders) {
                                    if (serviceProviders && serviceProviders.length > 0) {
                                        return res.status(200).json(serviceProviders);
                                    }
                                    else {
                                        return res.status(404).json({ msg: "No Service Provider Worked With Customer" });
                                    }
                                })
                                    .catch(function (error) {
                                    console.log(error);
                                    return res.status(500).json({ error: error });
                                });
                            }
                            else {
                                return res.status(404).json({ msg: "No Service Provider Worked With Customer" });
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
        this.createFavouriteSP = function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            var userId, spId;
            var _this = this;
            return __generator(this, function (_a) {
                userId = parseInt(req.body.user.id);
                spId = parseInt(req.params.spId);
                if (req.body.user.id && req.body.user.userTypeId === 4) {
                    req.body.UserId = userId;
                    req.body.TargetUserId = spId;
                    return [2 /*return*/, this.favouriteSPService.getAllServiceRequest(req.body.user.id)
                            .then(function (serviceRequest) {
                            var spIds = [];
                            for (var sr in serviceRequest) {
                                if (serviceRequest[sr].Status === 3 && serviceRequest[sr].ServiceProviderId != null) {
                                    spIds.push(serviceRequest[sr].ServiceProviderId);
                                }
                            }
                            if (spIds.length > 0) {
                                var isAvailable = spIds.includes(parseInt(req.params.spId));
                                if (isAvailable && req.body.IsFavorite) {
                                    return _this.favouriteSPService.getFavouriteSP(userId, spId)
                                        .then(function (favourite) {
                                        if (favourite) {
                                            if (favourite.IsFavorite) {
                                                return res.status(402).json({ msg: "Service Provider already in your favourite list" });
                                            }
                                            else {
                                                return _this.favouriteSPService.updateFavouriteSP(req.body)
                                                    .then(function (favourite) {
                                                    if (favourite) {
                                                        return res.status(201).json({ msg: "Service Provider Favourite Status updated successfully" });
                                                    }
                                                    else {
                                                        return res.status(403).json({ msg: "Error!!! Service Provider cannot add your favourite list" });
                                                    }
                                                })
                                                    .catch(function (error) {
                                                    console.log(error);
                                                    return res.status(500).json({ error: error });
                                                });
                                            }
                                        }
                                        else {
                                            req.body.IsBlocked = false;
                                            return _this.favouriteSPService.createFavouriteSP(req.body)
                                                .then(function (favouritesp) {
                                                if (favouritesp) {
                                                    return res.status(200).json({ msg: "Service Provider added your favourite list successfully" });
                                                }
                                                else {
                                                    return res.status(402).json({ msg: "Error!! while added service provider in your favourite list" });
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
                                else if (req.body.IsFavorite === false) {
                                    next();
                                }
                                else {
                                    return res.status(404).json({ message: "Please enter valid input" });
                                }
                            }
                            else {
                                return res.status(404).json({ msg: "No Service Provider Worked With Customer" });
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
        this.Unfavourite = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.favouriteSPService.getFavouriteSP(req.body.user.id, req.body.TargetUserId)
                        .then(function (favouriteSP) {
                        if (favouriteSP && favouriteSP.IsFavorite) {
                            return _this.favouriteSPService.updateFavouriteSP(req.body)
                                .then(function (isFavourite) {
                                if (isFavourite) {
                                    return res.status(201).json({ msg: "Service Provider UnFavourite Status updated successfully" });
                                }
                                else {
                                    return res.status(401).json({ msg: "Error!!! Service Provider cannot add your unfavourite list" });
                                }
                            })
                                .catch(function (error) {
                                console.log(error);
                                return res.status(500).json({ error: error });
                            });
                        }
                        else if ((favouriteSP === null || favouriteSP === void 0 ? void 0 : favouriteSP.IsFavorite) === false) {
                            return res.status(402).json({ msg: "Service Provider already in your Unfavourite list" });
                        }
                        else {
                            return res.status(404).json({ msg: "No Service Provider to remove from favourite list" });
                        }
                    })
                        .catch(function (error) {
                        console.log(error);
                        return res.status(500).json({ error: error });
                    })];
            });
        }); };
        this.blockSP = function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            var userId, spId;
            var _this = this;
            return __generator(this, function (_a) {
                userId = parseInt(req.body.user.id);
                spId = parseInt(req.params.spId);
                if (req.body.user.id && req.body.user.userTypeId === 4) {
                    req.body.UserId = userId;
                    req.body.TargetUserId = spId;
                    return [2 /*return*/, this.favouriteSPService.getAllServiceRequest(req.body.user.id)
                            .then(function (serviceRequest) {
                            var spIds = [];
                            for (var sr in serviceRequest) {
                                if (serviceRequest[sr].Status === 3 && serviceRequest[sr].ServiceProviderId != null) {
                                    spIds.push(serviceRequest[sr].ServiceProviderId);
                                }
                            }
                            if (spIds.length > 0) {
                                var isAvailable = spIds.includes(parseInt(req.params.spId));
                                if (isAvailable && req.body.IsBlocked) {
                                    return _this.favouriteSPService.getFavouriteSP(userId, spId)
                                        .then(function (favourite) {
                                        if (favourite) {
                                            if (favourite.IsBlocked) {
                                                return res.status(402).json({ msg: "Service Provider already in your block list" });
                                            }
                                            else {
                                                return _this.favouriteSPService.updateFavouriteSP(req.body)
                                                    .then(function (favourite) {
                                                    if (favourite) {
                                                        return res.status(201).json({ msg: "Service Provider Block Status updated successfully" });
                                                    }
                                                    else {
                                                        return res.status(403).json({ msg: "Error!!! Service Provider cannot add your block list" });
                                                    }
                                                })
                                                    .catch(function (error) {
                                                    console.log(error);
                                                    return res.status(500).json({ error: error });
                                                });
                                            }
                                        }
                                        else {
                                            req.body.IsFavorite = false;
                                            return _this.favouriteSPService.createFavouriteSP(req.body)
                                                .then(function (blocksp) {
                                                if (blocksp) {
                                                    return res.status(200).json({ msg: "Service Provider added your block list successfully" });
                                                }
                                                else {
                                                    return res.status(403).json({ msg: "Error!! while added service provider in your block list" });
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
                                else if (req.body.IsBlocked === false) {
                                    next();
                                }
                                else {
                                    return res.status(404).json({ message: "Please enter valid input" });
                                }
                            }
                            else {
                                return res.status(404).json({ msg: "No Service Provider Worked With Customer" });
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
        this.Unblock = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.favouriteSPService.getFavouriteSP(req.body.user.id, req.body.TargetUserId)
                        .then(function (blockedSP) {
                        if (blockedSP && blockedSP.IsBlocked) {
                            return _this.favouriteSPService.updateFavouriteSP(req.body)
                                .then(function (isBlocked) {
                                if (isBlocked) {
                                    return res.status(201).json({ msg: "Service Provider UnBlock Status updated successfully" });
                                }
                                else {
                                    return res.status(403).json({ msg: "Error!!! Service Provider cannot add your unblock list" });
                                }
                            })
                                .catch(function (error) {
                                console.log(error);
                                return res.status(500).json({ error: error });
                            });
                        }
                        else if ((blockedSP === null || blockedSP === void 0 ? void 0 : blockedSP.IsBlocked) === false) {
                            return res.status(402).json({ msg: "Service Provider already in your UnBlock list" });
                        }
                        else {
                            return res.status(404).json({ msg: "No Service Provider to remove from block list" });
                        }
                    })
                        .catch(function (error) {
                        console.log(error);
                        return res.status(500).json({ error: error });
                    })];
            });
        }); };
        this.favouriteSPService = favouriteSPService;
    }
    return FavouriteSPController;
}());
exports.FavouriteSPController = FavouriteSPController;
