"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productionConfig = exports.developmentConfig = void 0;
const baseUrl = "http://192.168.0.12";
exports.developmentConfig = {
    port: 4000,
    allowedOrigin: `${baseUrl}:5173`,
};
exports.productionConfig = {
    port: 4000,
    allowedOrigin: `${baseUrl}:5173`,
};
process.env.JWT_SECRET = "pWG#zXQj@6_ymI'swe1AL|}Gq!iD3K";
