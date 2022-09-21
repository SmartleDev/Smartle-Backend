"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHomeEnterpriseCourses = void 0;
const config_1 = __importDefault(require("../config/config"));
exports.getHomeEnterpriseCourses = ((req, res) => {
    config_1.default.query('SELECT * from enterprise_courses WHERE enterprise = "True"', (err, rows) => {
        if (err) {
            console.log(err);
        }
        res.send(rows);
    });
});
