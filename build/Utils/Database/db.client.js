"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nsql_db = void 0;
const client_1 = require("@prisma/client");
const nsql_db = new client_1.PrismaClient({ datasources: { db: { url: process.env.NS_DATABASE_URL } } });
exports.nsql_db = nsql_db;
