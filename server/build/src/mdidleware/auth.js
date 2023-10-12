"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
const prisma_client_1 = __importDefault(require("../prisma-client"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth = async (req, res, next) => {
    var _a;
    try {
        let token = ((_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1]) || "";
        console.log(token);
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || "");
        if (typeof decoded === "object" && decoded.id) {
            const user = await prisma_client_1.default.user.findUnique({
                where: {
                    id: decoded.id,
                },
            });
            res.locals.user = user;
        }
        else {
            return res.status(400).json({ message: "Что-то пошло не так" });
        }
        next();
    }
    catch (error) {
        res.status(401).json({ message: "Не авторизован" });
    }
};
exports.auth = auth;
