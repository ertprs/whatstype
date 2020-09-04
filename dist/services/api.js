"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenParams = exports.config = exports.api = void 0;
var axios_1 = __importDefault(require("axios"));
exports.api = axios_1.default.create({
    baseURL: 'https://books.zoho.com/api/v3/'
});
exports.config = {
    client: {
        id: '1000.CQ7A4R0I7G9Q7JDKRMAL1N2LKF2XKY',
        secret: '06381093ba30f8563267c372895a30f89c0c18c9be'
    },
    auth: {
        tokenHost: 'https://accounts.zoho.com',
        tokenPath: '/oauth/v2/token?'
    },
    options: {
        authorizationMethod: "body",
    }
};
exports.tokenParams = {
    scope: 'ZohoBooks.fullaccess.all'
};
