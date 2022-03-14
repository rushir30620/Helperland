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
exports.forgotPassController = void 0;
var bcryptjs_1 = __importDefault(require("bcryptjs"));
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var nodemailer_1 = __importDefault(require("nodemailer"));
require('dotenv').config();
var forgotPassController = /** @class */ (function () {
    function forgotPassController(forgotPassService) {
        var _this = this;
        this.forgotPassService = forgotPassService;
        this.forgotPass = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var userEmail;
            var _this = this;
            return __generator(this, function (_a) {
                userEmail = req.body.email;
                if (userEmail) {
                    return [2 /*return*/, this.forgotPassService.forgotPass(userEmail)
                            .then(function (user) { return __awaiter(_this, void 0, void 0, function () {
                            var userId, token, transporter, mailOptions;
                            return __generator(this, function (_a) {
                                if (!user) {
                                    return [2 /*return*/, res.status(400).json({
                                            message: "User with given email doesn't exist"
                                        })];
                                }
                                ;
                                userId = user.id;
                                token = jsonwebtoken_1.default.sign({ userId: userId }, process.env.FORGOT_PASS_KEY, { expiresIn: '20m' });
                                transporter = nodemailer_1.default.createTransport({
                                    service: process.env.SERVICE,
                                    auth: {
                                        user: process.env.USER,
                                        pass: process.env.PASS,
                                    },
                                });
                                mailOptions = {
                                    from: process.env.USER,
                                    to: user.email,
                                    subject: "Account Verification",
                                    html: "<h3>Kindly click on the below link to reset your password\n                            <p>".concat(process.env.URL, "/reset-Password/").concat(token)
                                };
                                transporter.sendMail(mailOptions, function (error, info) {
                                    if (error) {
                                        res.status(404).json({
                                            errror: error,
                                            meassage: "Email cannot be sent..."
                                        });
                                    }
                                    else {
                                        if (info.response.includes("OK")) {
                                            console.log("Email sent");
                                            return res.status(200).json({
                                                msg: "Email sent successfully !"
                                            });
                                        }
                                    }
                                });
                                return [2 /*return*/, res.status(200).json({ msg: "Password reset link successfully sent to your email account" })];
                            });
                        }); })
                            .catch(function (error) {
                            console.log(error);
                            return res.status(500).json({
                                error: error
                            });
                        })];
                }
                else {
                    return [2 /*return*/, res.status(400).json({
                            msg: "Email doesn't exist"
                        })];
                }
                return [2 /*return*/];
            });
        }); };
        this.resetPass = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var token;
            var _this = this;
            return __generator(this, function (_a) {
                token = req.body.token;
                // const { token } = req.params;
                if (token) {
                    jsonwebtoken_1.default.verify(token, process.env.FORGOT_PASS_KEY, function (error, decodedToken) { return __awaiter(_this, void 0, void 0, function () {
                        var userId;
                        var _this = this;
                        return __generator(this, function (_a) {
                            if (error) {
                                return [2 /*return*/, res.status(400).json({
                                        error: "Incorrect Link"
                                    })];
                            }
                            userId = decodedToken.userId;
                            return [2 /*return*/, this.forgotPassService.forgotPassId(userId)
                                    .then(function (user) { return __awaiter(_this, void 0, void 0, function () {
                                    var passMatch, _a;
                                    return __generator(this, function (_b) {
                                        switch (_b.label) {
                                            case 0:
                                                if (!user) {
                                                    return [2 /*return*/, res.status(400).json({ msg: "User with this link does not exist" })];
                                                }
                                                ;
                                                return [4 /*yield*/, bcryptjs_1.default.compare(req.body.newPassword, user.password)];
                                            case 1:
                                                passMatch = _b.sent();
                                                if (!passMatch) return [3 /*break*/, 2];
                                                return [2 /*return*/, res.status(200).json({
                                                        message: "This password used recently. Please choose different password",
                                                    })];
                                            case 2:
                                                _a = user;
                                                return [4 /*yield*/, bcryptjs_1.default.hash(req.body.newPassword, 10)];
                                            case 3:
                                                _a.password = _b.sent();
                                                return [2 /*return*/, this.forgotPassService.updateUser(user.password, userId)
                                                        .then(function (user) {
                                                        return res.status(200).json({ msg: "Password reset successfully", user: user });
                                                    })
                                                        .catch(function (error) {
                                                        // console.log(error);
                                                        return res.status(500).json(error);
                                                    })];
                                        }
                                    });
                                }); })
                                    .catch(function (error) {
                                    // console.log(error);
                                    return res.status(500).json(error);
                                })];
                        });
                    }); });
                }
                else {
                    return [2 /*return*/, res.status(400).json({ message: "Somethin went wrong" })];
                }
                ;
                return [2 /*return*/];
            });
        }); };
        this.forgotPassService = forgotPassService;
    }
    return forgotPassController;
}());
exports.forgotPassController = forgotPassController;
;
