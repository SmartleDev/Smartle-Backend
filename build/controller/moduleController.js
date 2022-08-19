"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getModuleforCourse = void 0;
const config_1 = __importDefault(require("../config/config"));
exports.getModuleforCourse = ((req, res) => {
    let course_id = req.params.id;
    let sql = `SELECT * FROM module JOIN coursemodule ON module.module_id = coursemodule.module_id AND coursemodule.course_id=${course_id}`;
    config_1.default.query(sql, (err, result) => {
        if (err) {
            console.log(err);
        }
        res.send(result);
    });
});
