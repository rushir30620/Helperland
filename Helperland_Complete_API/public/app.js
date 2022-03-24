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
var http_1 = __importDefault(require("http"));
var express_1 = __importDefault(require("express"));
var dotenv_1 = __importDefault(require("dotenv"));
var body_parser_1 = __importDefault(require("body-parser"));
var multer_1 = __importDefault(require("multer"));
var models_1 = require("./models");
var swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
var swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
dotenv_1.default.config();
var hostname = 'localhost';
var port = process.env.PORT || 3000;
var app = (0, express_1.default)();
var server = http_1.default.createServer(app);
app.use(express_1.default.json());
var swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Helperland System',
            version: '1.0.0',
            description: 'Helperland API',
            contact: {
                name: 'Rathod Rushikesh',
                url: 'https://helperland.com',
                email: 'rushir306@gmail.com'
            },
            servers: ["http://localhost:3000"]
        }
    },
    apis: ['./routes/contact.routes.ts', './routes/user.routes.ts', './routes/serviceRequest.routes.ts', './routes/customerPage.routes.ts', './routes/spPage.routes.ts', './routes/admin.routes.ts']
};
var swaggerDocs = (0, swagger_jsdoc_1.default)(swaggerOptions);
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocs));
var contact_routes_1 = __importDefault(require("./routes/contact.routes"));
var user_routes_1 = __importDefault(require("./routes/user.routes"));
var serviceRequest_routes_1 = __importDefault(require("./routes/serviceRequest.routes"));
var customerPage_routes_1 = __importDefault(require("./routes/customerPage.routes"));
var spPage_routes_1 = __importDefault(require("./routes/spPage.routes"));
var admin_routes_1 = __importDefault(require("./routes/admin.routes"));
//Parse incoming requests data
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use((0, multer_1.default)({ dest: 'images' }).single('file'));
app.use('/', contact_routes_1.default);
app.use('/', user_routes_1.default);
app.use('/', serviceRequest_routes_1.default);
app.use('/', customerPage_routes_1.default);
app.use('/', spPage_routes_1.default);
app.use('/', admin_routes_1.default);
server.listen(port, function () {
    console.log("Server running at http://".concat(hostname, ":").concat(port, "/"));
    models_1.sequelize.authenticate().then(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            console.log("database connected");
            return [2 /*return*/];
        });
    }); })
        .catch(function (e) {
        console.log(e.message);
    });
});
