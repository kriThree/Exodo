"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importStar(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const index_1 = require("./config/index");
const users_1 = __importDefault(require("./routes/users"));
const todos_1 = __importDefault(require("./routes/todos"));
const commands_1 = __importDefault(require("./routes/commands"));
const notifications_1 = __importDefault(require("./routes/notifications"));
const isProduction = process.env.NODE_ENV === "production";
let config;
if (isProduction) {
    config = index_1.productionConfig;
}
else {
    config = index_1.developmentConfig;
}
const app = (0, express_1.default)();
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: "*"
}));
app.use((0, express_1.json)());
app.use((0, express_1.urlencoded)({ extended: true }));
app.use("/user", users_1.default);
app.use("/todo", todos_1.default);
app.use("/command", commands_1.default);
app.use("/notification", notifications_1.default);
app.use("*", (req, res) => {
    console.log(req.path);
    res.status(200).send("Success");
});
app.listen(config.port, async () => {
    try {
        console.log("🚀 Server ready to handle requests");
    }
    catch (e) {
        console.log(e);
    }
});
