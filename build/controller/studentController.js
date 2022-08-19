"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllStudents = void 0;
const config_1 = __importDefault(require("../config/config"));
exports.getAllStudents = ((req, res) => {
    config_1.default.query('SELECT * from student', (err, rows) => {
        if (err) {
            console.log(err);
        }
        res.send(rows);
    });
});
