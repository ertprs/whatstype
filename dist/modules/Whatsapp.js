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
exports.status = void 0;
var api_1 = require("../services/api");
var simple_oauth2_1 = require("simple-oauth2");
var operations = [];
exports.status = false;
var scriptOS = {
    1: 'Qual o nome da sua cooperativa ? (Exemplo: Vale Sul, Ouro Branco, Nossa Terra )',
    2: 'Qual a sua agência ? (Exemplo: 04, UAD, 25, SUREG)',
    3: 'Descreva o motivo da OS. (Exemplo: Ramal 1205 inoperante)',
    4: 'A sua OS foi registrada com sucesso!',
};
var scriptCONTATO = {
    1: "Digite: \n      *1* - Comprar um produto\n      *2* - Suporte T\u00E9cnico\n      ",
    2: 'Obrigado, logo nossos atendentes entrarão em contato'
};
function createOperation(id) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, coop, unity, description, client, responseToken, accessToken, contactsResponse, contacts, contact_1, customer_id, notes, line_items, error_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = operations[id], coop = _a.coop, unity = _a.unity, description = _a.description;
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 5, , 6]);
                    client = new simple_oauth2_1.ClientCredentials({
                        client: {
                            id: '1000.CQ7A4R0I7G9Q7JDKRMAL1N2LKF2XKY',
                            secret: '06381093ba30f8563267c372895a30f89c0c18c9be'
                        },
                        auth: {
                            tokenHost: 'https://accounts.zoho.com',
                            tokenPath: '/oauth/v2/token?'
                        },
                        options: {
                            authorizationMethod: "body"
                        }
                    });
                    return [4 /*yield*/, client.getToken(api_1.tokenParams)];
                case 2:
                    responseToken = _b.sent();
                    accessToken = responseToken.token.access_token;
                    return [4 /*yield*/, api_1.api.get('/contacts', {
                            params: {
                                company_name_contains: coop,
                            },
                            headers: {
                                Authorization: "Zoho-oauthtoken " + accessToken
                            }
                        })];
                case 3:
                    contactsResponse = _b.sent();
                    contacts = contactsResponse.data.contacts;
                    if (contacts.length < 0) {
                        throw new Error('Cooperativa não encontrada');
                    }
                    contact_1 = contacts.find(function (contact) { return contact.contact_name.toUpperCase() === contact.company_name.toUpperCase() + " - " + unity.toUpperCase(); });
                    if (contact_1 === undefined) {
                        throw new Error('Agência não encontrada');
                    }
                    customer_id = contact_1.contact_id;
                    notes = description;
                    line_items = [{ item_id: '2327669000000108154' }];
                    return [4 /*yield*/, api_1.api.post('salesorders', {
                            customer_id: customer_id,
                            notes: notes,
                            line_items: line_items
                        }, {
                            headers: {
                                Authorization: "Zoho-oauthtoken " + accessToken
                            }
                        })];
                case 4:
                    _b.sent();
                    return [2 /*return*/, true];
                case 5:
                    error_1 = _b.sent();
                    console.log(error_1);
                    return [2 /*return*/, false];
                case 6: return [2 /*return*/];
            }
        });
    });
}
function verifyCustomer(message) {
    var operationIndex = operations.findIndex(function (operation) { return operation.from === message.from; });
    if (operationIndex >= 0)
        return operationIndex;
    else {
        operations.push({
            from: message.from,
            title: '',
            coop: '',
            unity: '',
            description: '',
            level: 1
        });
        return operations.length - 1;
    }
}
function contact(operationIndex, message, client) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _a = operations[operationIndex].level;
                    switch (_a) {
                        case 1: return [3 /*break*/, 1];
                        case 2: return [3 /*break*/, 3];
                    }
                    return [3 /*break*/, 13];
                case 1: return [4 /*yield*/, client.sendText(message.from, scriptCONTATO[1])];
                case 2:
                    _c.sent();
                    operations[operationIndex].level++;
                    return [3 /*break*/, 13];
                case 3:
                    _b = message.body;
                    switch (_b) {
                        case '1': return [3 /*break*/, 4];
                        case '2': return [3 /*break*/, 7];
                    }
                    return [3 /*break*/, 10];
                case 4: return [4 /*yield*/, client.sendText('554192724349@c.us', "Pedido de contato para o n\u00FAmero: " + message.from.slice(2, 13))];
                case 5:
                    _c.sent();
                    return [4 /*yield*/, client.sendText(message.from, 'Obrigado, em breve entraremos em contato!')];
                case 6:
                    _c.sent();
                    return [3 /*break*/, 12];
                case 7: return [4 /*yield*/, client.sendText('5511952772090@c.us', "Pedido de contato para o n\u00FAmero: " + message.from.slice(2, 13))];
                case 8:
                    _c.sent();
                    return [4 /*yield*/, client.sendText(message.from, 'Obrigado, em breve entraremos em contato!')];
                case 9:
                    _c.sent();
                    return [3 /*break*/, 12];
                case 10: return [4 /*yield*/, client.sendText(message.from, "Op\u00E7\u00E3o Invalida")];
                case 11:
                    _c.sent();
                    _c.label = 12;
                case 12:
                    operations.splice(operationIndex, 1);
                    return [3 /*break*/, 13];
                case 13: return [2 /*return*/];
            }
        });
    });
}
function serviceOrder(operationIndex, message, client) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, createdOperation;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = operations[operationIndex].level;
                    switch (_a) {
                        case 1: return [3 /*break*/, 1];
                        case 2: return [3 /*break*/, 3];
                        case 3: return [3 /*break*/, 5];
                        case 4: return [3 /*break*/, 7];
                    }
                    return [3 /*break*/, 15];
                case 1: return [4 /*yield*/, client.sendText(message.from, scriptOS[1])];
                case 2:
                    _b.sent();
                    operations[operationIndex].level++;
                    return [3 /*break*/, 15];
                case 3:
                    operations[operationIndex].coop = message.body;
                    return [4 /*yield*/, client.sendText(message.from, scriptOS[2])];
                case 4:
                    _b.sent();
                    operations[operationIndex].level++;
                    return [3 /*break*/, 15];
                case 5:
                    operations[operationIndex].unity = message.body;
                    return [4 /*yield*/, client.sendText(message.from, scriptOS[3])];
                case 6:
                    _b.sent();
                    operations[operationIndex].level++;
                    return [3 /*break*/, 15];
                case 7:
                    operations[operationIndex].description = message.body;
                    return [4 /*yield*/, createOperation(operationIndex)];
                case 8:
                    createdOperation = _b.sent();
                    if (!createdOperation) return [3 /*break*/, 11];
                    return [4 /*yield*/, client.sendText(message.from, scriptOS[4])];
                case 9:
                    _b.sent();
                    return [4 /*yield*/, client.sendText('5511952772090@c.us', "Nova OS registrada")];
                case 10:
                    _b.sent();
                    return [3 /*break*/, 14];
                case 11: return [4 /*yield*/, client.sendText(message.from, "Falha em registrar OS, tente novamente.")];
                case 12:
                    _b.sent();
                    return [4 /*yield*/, client.sendText('5511952772090@c.us', "Falha de registro de OS")];
                case 13:
                    _b.sent();
                    _b.label = 14;
                case 14:
                    operations.splice(operationIndex, 1);
                    return [3 /*break*/, 15];
                case 15: return [2 /*return*/];
            }
        });
    });
}
function setStatus(client) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, client.isConnected()];
                case 1:
                    exports.status = _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function Whatsapp(client) {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, setStatus(client)];
                case 1:
                    _a.sent();
                    client.onMessage(function (message) { return __awaiter(_this, void 0, void 0, function () {
                        var operationIndex, formatedMessage, _a, _b;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    operationIndex = verifyCustomer(message);
                                    formatedMessage = message.body;
                                    _a = operations[operationIndex].title;
                                    switch (_a) {
                                        case '': return [3 /*break*/, 1];
                                        case 'Waiting': return [3 /*break*/, 2];
                                    }
                                    return [3 /*break*/, 8];
                                case 1:
                                    client.sendText(message.from, "Ol\u00E1! Eu sou o atendente virtual da Agora IP. Posso te ajudar ? \n        \n          *1* - Registrar uma OS\n          *2* - Entrar em contato conosco\n        ");
                                    operations[operationIndex].title = 'Waiting';
                                    return [3 /*break*/, 8];
                                case 2:
                                    _b = formatedMessage;
                                    switch (_b) {
                                        case '1': return [3 /*break*/, 3];
                                        case '2': return [3 /*break*/, 4];
                                    }
                                    return [3 /*break*/, 5];
                                case 3:
                                    operations[operationIndex].title = 'OS';
                                    return [3 /*break*/, 7];
                                case 4:
                                    operations[operationIndex].title = 'CONTATO';
                                    return [3 /*break*/, 7];
                                case 5: return [4 /*yield*/, client.sendText(message.from, "N\u00E3o entendi muito bem, atualmente podemos:\n              *1* - Registrar uma OS\n              *2* - Entrar em contato conosco\n            ")];
                                case 6:
                                    _c.sent();
                                    return [2 /*return*/];
                                case 7: return [3 /*break*/, 8];
                                case 8:
                                    if (operations[operationIndex].title !== '' && operations[operationIndex].title !== 'Waiting') {
                                        switch (operations[operationIndex].title) {
                                            case 'OS':
                                                serviceOrder(operationIndex, message, client);
                                                break;
                                            case 'CONTATO':
                                                contact(operationIndex, message, client);
                                                break;
                                        }
                                    }
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    return [2 /*return*/];
            }
        });
    });
}
exports.default = Whatsapp;
