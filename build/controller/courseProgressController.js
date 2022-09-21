"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.courseProgressTopic = exports.getAllTopicsCompleted = exports.updateTopicsCompleted = exports.enrolledUserProgressDefault = exports.updateModuleCompeletedStatus = exports.updateModuleStatus = exports.updateTopicStatus = exports.getTrackedCourse = exports.getProgressModuleTopic = exports.getProgressCourseModule = void 0;
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
    const { enrollmentId } = req.body;
    config_1.default.query('SELECT * FROM smartle.course_progress WHERE course_modules_completed < course_total_modules AND enrollment_id = ?', [enrollmentId], (err, result) => {
        if (err) {
            console.log(err);
        }
        if (result.length === 0) {
            res.send({ message: 'User Course Successfully Compeleted', status: 'error' });
        }
        else {
            config_1.default.query('UPDATE smartle.course_progress SET course_modules_completed = course_modules_completed + 1 WHERE enrollment_id = ?', [enrollmentId], (err, row) => {
                if (err) {
                    console.log(err);
                }
                config_1.default.query('SELECT * FROM smartle.course_progress WHERE enrollment_id = ?', [enrollmentId], (err, rowNumMain) => {
                    var _a, _b;
                    if (err) {
                        console.log(err);
                    }
                    const course_modules_completed = (_a = rowNumMain[0]) === null || _a === void 0 ? void 0 : _a.course_modules_completed;
                    const course_total_modules = (_b = rowNumMain[0]) === null || _b === void 0 ? void 0 : _b.course_total_modules;
                    const progress_done = (course_modules_completed / course_total_modules) * 100;
                    config_1.default.query('UPDATE smartle.enrollment SET course_progress = ? WHERE enrollment_id = ?', [progress_done, enrollmentId], (err, rowNum) => {
                        if (err) {
                            console.log(err);
                        }
                        // res.send({result : "success"});
                    });
                });
                res.send({ result: "success" });
            });
        }
    });
});
exports.enrolledUserProgressDefault = ((req, res) => {
    const { enrollmentId, courseId } = req.body;
    let moduleId = null;
    let topicId = null;
    let courseModuleLength = null;
    config_1.default.query('SELECT module_id FROM smartle.coursemodule WHERE course_id = ?;', [courseId], (err, rows) => {
        if (err) {
            console.log(err);
        }
        const valModule = rows === null || rows === void 0 ? void 0 : rows.map((dataItem) => dataItem === null || dataItem === void 0 ? void 0 : dataItem.module_id);
        moduleId = valModule[0];
        courseModuleLength = valModule === null || valModule === void 0 ? void 0 : valModule.length;
        if (moduleId !== null) {
            config_1.default.query('SELECT topic_id FROM smartle.module_topic WHERE module_id = ?;', [moduleId], (err, rows) => {
                if (err) {
                    console.log(err);
                }
                const valTopic = rows === null || rows === void 0 ? void 0 : rows.map((dataItem) => dataItem === null || dataItem === void 0 ? void 0 : dataItem.topic_id);
                topicId = valTopic[0];
                console.log(topicId);
                config_1.default.query(`INSERT INTO course_progress (course_topic, course_module, enrollment_id, course_total_modules, course_modules_completed,course_topics_completed) VALUES(?,?,?,?,?,?)`, [topicId, moduleId, enrollmentId, courseModuleLength, 0, '[]'], (err, result) => {
                    if (err) {
                        console.log(err);
                    }
                    res.send({ result: "success" });
                });
            });
        }
    });
});
exports.updateTopicsCompleted = ((req, res) => {
    const { courseTopic, enrollmentId } = req.body;
    config_1.default.query('SELECT course_topics_completed FROM course_progress WHERE enrollment_id = ?', [enrollmentId], (err, result) => {
        if (err) {
            console.log(err);
        }
        const val = result === null || result === void 0 ? void 0 : result.map((dataItem) => dataItem === null || dataItem === void 0 ? void 0 : dataItem.course_topics_completed);
        //val[0].push(courseTopic);
        config_1.default.query(`UPDATE smartle.course_progress SET course_topics_completed = '[${val[0]}]' WHERE enrollment_id = ${enrollmentId}`, (err, result) => {
            if (err) {
                console.log(err);
            }
            res.send({ result: "success" });
        });
    });
});
exports.getAllTopicsCompleted = ((req, res) => {
    const { id } = req.params;
    config_1.default.query('SELECT course_topics_completed FROM smartle.course_progress WHERE enrollment_id = ?', [id], (err, result) => {
        if (err) {
            console.log(err);
        }
        const val = result === null || result === void 0 ? void 0 : result.map((dataItem) => dataItem === null || dataItem === void 0 ? void 0 : dataItem.course_topics_completed);
        res.send(val[0]);
    });
});
exports.courseProgressTopic = ((req, res) => {
    const { id } = req.body;
    let topics;
    let progress;
    config_1.default.query('SELECT * FROM smartle.course_progress WHERE enrollment_id = ?', [id], (err, result) => {
        if (err) {
            console.log(err);
        }
        const val = result === null || result === void 0 ? void 0 : result.map((dataItem) => dataItem === null || dataItem === void 0 ? void 0 : dataItem.course_topics_completed);
        topics = val[0].length;
        console.log(topics);
        progress = Math.ceil((0.2 / topics) * 100);
        console.log(progress);
        config_1.default.query(`UPDATE smartle.enrollment SET course_progress = ${progress} WHERE enrollment_id = ?`, [progress, id], (err, result) => {
            if (err) {
                console.log(err);
            }
        });
        res.send({ result: "Success" });
    });
});
