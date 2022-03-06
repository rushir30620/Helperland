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
exports.UserController = void 0;
var index_1 = require("../models/index");
var bcryptjs_1 = __importDefault(require("bcryptjs"));
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var nodemailer_1 = __importDefault(require("nodemailer"));
require('dotenv').config();
var userTypeID = 4;
var UserController = /** @class */ (function () {
    function UserController(userService) {
        var _this = this;
        this.userService = userService;
        this.createUsers = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var password, cpassword, exist, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        req.body.userTypeId = userTypeID;
                        req.body.isRegisteredUser = false;
                        password = req.body.password;
                        cpassword = req.body.cpassword;
                        if (!!(password === cpassword)) return [3 /*break*/, 1];
                        return [2 /*return*/, res.json({ message: "Please enter same password.." })];
                    case 1: return [4 /*yield*/, index_1.db.Users.findOne({ where: { email: req.body.email } })];
                    case 2:
                        exist = _b.sent();
                        if (exist) {
                            return [2 /*return*/, res.status(403).json({ message: "Email already in use.." })];
                        }
                        _a = req.body;
                        return [4 /*yield*/, bcryptjs_1.default.hash(password, 10)];
                    case 3:
                        _a.password = _b.sent();
                        return [2 /*return*/, this.userService
                                .createUsers(req.body)
                                .then(function (user) {
                                var token = jsonwebtoken_1.default.sign({ user: user }, process.env.JWT_KEY, { expiresIn: '2h' });
                                var transporter = nodemailer_1.default.createTransport({
                                    service: process.env.SERVICE,
                                    auth: {
                                        user: process.env.USER,
                                        pass: process.env.PASS,
                                    },
                                });
                                var mailOptions = {
                                    from: process.env.USER,
                                    to: req.body.email,
                                    subject: "Account Verification",
                                    html: "<h4>Kindly click on the below given link to activate your account</h2>\n                                <p>".concat(process.env.URL, "/verify/user/").concat(token)
                                };
                                transporter.sendMail(mailOptions, function (error, info) {
                                    if (error) {
                                        res.status(404).json({
                                            error: error,
                                            message: "Email cannot be sent.."
                                        });
                                    }
                                    else {
                                        if (info.response.includes("OK")) {
                                            console.log("email sent");
                                            return res.status(200).json({
                                                msg: "Email sent successfully !"
                                            });
                                        }
                                    }
                                });
                                return res.status(200).json({ user: user });
                            })
                                .catch(function (error) {
                                console.log(error);
                                return res.status(500).json({
                                    error: error
                                });
                            })];
                    case 4:
                        ;
                        return [2 /*return*/];
                }
            });
        }); };
        this.verifyEmail = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var token;
            var _this = this;
            return __generator(this, function (_a) {
                token = req.params.token;
                if (token) {
                    jsonwebtoken_1.default.verify(token, process.env.JWT_KEY, function (error, decodedToken) { return __awaiter(_this, void 0, void 0, function () {
                        var user, userUpdate;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (error) {
                                        return [2 /*return*/, res.status(400).json({
                                                error: 'Incorrect Link'
                                            })];
                                    }
                                    user = decodedToken.user;
                                    console.log(user);
                                    if (!user) return [3 /*break*/, 2];
                                    user.isRegisteredUser = true;
                                    return [4 /*yield*/, index_1.db.Users.update(user, { where: { email: user.email } })];
                                case 1:
                                    userUpdate = _a.sent();
                                    console.log(userUpdate);
                                    if (userUpdate) {
                                        return [2 /*return*/, res.status(200).json({ user: user })];
                                    }
                                    else {
                                        console.log(error);
                                        return [2 /*return*/, res.status(500).json(error)];
                                    }
                                    ;
                                    _a.label = 2;
                                case 2: return [2 /*return*/];
                            }
                        });
                    }); });
                }
                else {
                    return [2 /*return*/, res.status(404).json({
                            error: "Something went wrong!!"
                        })];
                }
                ;
                return [2 /*return*/];
            });
        }); };
        this.loginUser = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.userService.loginUser(req.body.email)
                        .then(function (user) { return __awaiter(_this, void 0, void 0, function () {
                        var isUserRegister, passwordMatch, userObj, token;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (!(user === null)) return [3 /*break*/, 1];
                                    console.log(user);
                                    return [2 /*return*/, res.status(403).json({ message: "Invalid Email or Password" })];
                                case 1:
                                    isUserRegister = user.isRegisteredUser;
                                    if (!isUserRegister) return [3 /*break*/, 3];
                                    return [4 /*yield*/, bcryptjs_1.default.compare(req.body.password, user.password)];
                                case 2:
                                    passwordMatch = _a.sent();
                                    if (passwordMatch) {
                                        userObj = {
                                            id: user.id,
                                            firstName: user.firstName,
                                            lastName: user.lastName,
                                            email: user.email,
                                            mobile: user.mobile
                                        };
                                        console.log(user);
                                        token = jsonwebtoken_1.default.sign(userObj, process.env.JWT_KEY, { expiresIn: '2h' });
                                        // const token = this.userService.createToken(user.email!);
                                        return [2 /*return*/, res.status(200)
                                                .cookie("token", token, { httpOnly: true, expires: new Date(Date.now() + 600000) })
                                                .json({ message: "User login successful " })];
                                    }
                                    return [2 /*return*/, res.status(401).json({ message: "Invalid Email or Password" })];
                                case 3: return [2 /*return*/, res.status(401).json({ message: "Please Active Your Account" })];
                            }
                        });
                    }); })
                        .catch(function (error) {
                        console.log(error);
                        return res.status(500).json({
                            error: error,
                        });
                    })];
            });
        }); };
        this.validateTokenMiddleware = function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            var token;
            var _this = this;
            return __generator(this, function (_a) {
                token = req.headers.authorization;
                if (token == null) {
                    return [2 /*return*/, res.status(401).json({ message: "Invalid login credentials" })];
                }
                jsonwebtoken_1.default.verify(token, process.env.JWT_KEY, function (err, user) {
                    if (err) {
                        return res.status(403).json({ message: 'Invalid login credentials' });
                    }
                    else {
                        console.log(user);
                        req.body.user = user;
                        return _this.userService.loginUser(user.email)
                            .then(function (user) {
                            if (user === null) {
                                return res.status(401).json({ message: 'user not found' });
                            }
                            else {
                                next();
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
                return [2 /*return*/];
            });
        }); };
        this.deleteToken = function (req, res) {
            try {
                res.clearCookie('token');
                return res.status(200).json({ message: 'User Logout successfully' });
            }
            catch (error) {
                return res.status(401).json({ message: 'cannot logout' });
            }
        };
        this.userService = userService;
    }
    return UserController;
}());
exports.UserController = UserController;
;
