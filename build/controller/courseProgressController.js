"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProgressModuleTopic = exports.getProgressCourseModule = void 0;
const config_1 = __importDefault(require("../config/config"));
exports.getProgressCourseModule = ((req, res) => {
    const courseId = req.params.id;
    config_1.default.query('SELECT module_id FROM smartle.coursemodule WHERE course_id = ?;', [courseId], (err, rows) => {
        if (err) {
            console.log(err);
        }
        const val = rows === null || rows === void 0 ? void 0 : rows.map((dataItem) => dataItem === null || dataItem === void 0 ? void 0 : dataItem.module_id);
        res.send(val);
    });
});
exports.getProgressModuleTopic = ((req, res) => {
    const moduleId = req.params.id;
    config_1.default.query('SELECT topic_id FROM smartle.module_topic WHERE module_id = ?;', [moduleId], (err, rows) => {
        if (err) {
            console.log(err);
        }
        const val = rows === null || rows === void 0 ? void 0 : rows.map((dataItem) => dataItem === null || dataItem === void 0 ? void 0 : dataItem.topic_id);
        res.send(val);
    });
});
