"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLearnerCourses = void 0;
const config_1 = __importDefault(require("../config/config"));
exports.getLearnerCourses = ((req, res) => {
    let { studentId } = req.body;
    let sql = `SELECT * FROM enrollment WHERE student_id = ${studentId}`;
    config_1.default.query(sql, (err, rows) => {
        if (err) {
            console.log(err);
        }
        res.send(rows);
    });
});
