"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mysql2_1 = __importDefault(require("mysql2"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.default = mysql2_1.default.createConnection({
    host: 'smartle-database.chtrceswdnga.ap-south-1.rds.amazonaws.com',
    port: 3306,
    user: 'smartleadmin',
    password: 'smartleroot',
    database: 'smartle'
});
