"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateModuleCompeletedStatus = exports.updateModuleStatus = exports.updateTopicStatus = exports.getTrackedCourse = exports.getProgressModuleTopic = exports.getProgressCourseModule = void 0;
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
exports.getTrackedCourse = ((req, res) => {
    const enrollmentId = req.params.id;
    config_1.default.query('SELECT * FROM smartle.course_progress WHERE enrollment_id = ?;', [enrollmentId], (err, result) => {
        if (err) {
            console.log(err);
        }
        res.send(result);
    });
});
exports.updateTopicStatus = ((req, res) => {
    const { courseTopic, enrollmentId } = req.body;
    config_1.default.query('UPDATE smartle.course_progress SET course_topic = ? WHERE enrollment_id = ?', [courseTopic, enrollmentId], (err, result) => {
        if (err) {
            console.log(err);
        }
        res.send({ result: "success" });
    });
});
exports.updateModuleStatus = ((req, res) => {
    const { courseModule, enrollmentId } = req.body;
    config_1.default.query('UPDATE smartle.course_progress SET course_module = ? WHERE enrollment_id = ?', [courseModule, enrollmentId], (err, result) => {
        if (err) {
            console.log(err);
        }
        res.send({ result: "success" });
    });
});
exports.updateModuleCompeletedStatus = ((req, res) => {
    const { modulesCompleted, enrollmentId } = req.body;
    config_1.default.query('UPDATE smartle.course_progress SET course_modules_completed = ? WHERE enrollment_id = ?', [modulesCompleted, enrollmentId], (err, result) => {
        if (err) {
            console.log(err);
        }
        res.send({ result: "success" });
    });
});
