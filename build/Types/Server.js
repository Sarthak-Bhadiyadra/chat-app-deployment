"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.API_ENDPOINTS = void 0;
var API_ENDPOINTS;
(function (API_ENDPOINTS) {
    API_ENDPOINTS["CREATE"] = "/users";
    API_ENDPOINTS["LIST"] = "/users";
    API_ENDPOINTS["ALL_USERS"] = "/users";
    API_ENDPOINTS["UPDATE"] = "/users/:id";
    API_ENDPOINTS["DELETE"] = "/users/:id";
    API_ENDPOINTS["LOGIN"] = "/login";
    API_ENDPOINTS["DETAILS"] = "/users/:id";
    API_ENDPOINTS["LIST_CHAT"] = "/chat";
    API_ENDPOINTS["SINGLE_CHAT"] = "/chat/:id";
    API_ENDPOINTS["LIST_ALL_USERS_CHAT"] = "/chat/";
    API_ENDPOINTS["CHECK_ACCESS_OR_CREATE"] = "/chat";
    API_ENDPOINTS["GET_ALL_CONVERSATION"] = "/chat/:id";
    API_ENDPOINTS["GET_LIST_OF_CHATS"] = "/chat-all";
    API_ENDPOINTS["CREATE_GROUP_CHAT"] = "/chat";
    API_ENDPOINTS["UPDATE_GROUP_CHAT"] = "/chat/:id";
    API_ENDPOINTS["CREATE_MESSAGE"] = "/chat/:chat_id/message";
})(API_ENDPOINTS || (exports.API_ENDPOINTS = API_ENDPOINTS = {}));
