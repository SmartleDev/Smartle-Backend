"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.keyEvents = void 0;
const config_1 = __importDefault(require("../config/config"));
exports.keyEvents = ((req, res) => {
    const { id } = req.params;
    config_1.default.query(`SELECT * FROM smartle.enrollment JOIN session ON enrollment.session_id = session.session_id JOIN course ON enrollment.course_id = course.course_id where student_id = ?`, [parseInt(id)], (err, result) => {
        if (err) {
            console.log(err);
        }
        res.send(result);
    });
});
