"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getModuleTopicIdList = exports.getDoneModulesID = exports.updateModuleCompeletedArray = exports.courseModulesDone = exports.courseModulesRemaining = exports.courseProgressTopic = exports.getAllTopicsCompleted = exports.updateTopicsCompleted = exports.enrolledUserProgressDefault = exports.updateModuleCompeletedStatus = exports.updateModuleStatus = exports.updateTopicStatus = exports.getTrackedCourse = exports.getProgressModuleTopic = exports.getProgressCourseModule = void 0;
const config_1 = __importDefault(require("../config/config"));
const promisePool = config_1.default.promise();
const getProgressCourseModule = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req);
    const courseId = req.params.id;
    try {
        const [rows] = yield promisePool.query('SELECT module_id FROM smartle.coursemodule WHERE course_id = ?', [courseId]);
        const val = rows === null || rows === void 0 ? void 0 : rows.map((dataItem) => dataItem === null || dataItem === void 0 ? void 0 : dataItem.module_id);
        res.send(val);
    }
    catch (sqlError) {
        console.log(sqlError);
    }
});
exports.getProgressCourseModule = getProgressCourseModule;
const getProgressModuleTopic = (req, res) => {
    const moduleId = req.params.id;
    config_1.default.query('SELECT topic_id FROM smartle.module_topic WHERE module_id = ?;', [moduleId], (err, rows) => {
        if (err) {
            console.log(err);
        }
        const val = rows === null || rows === void 0 ? void 0 : rows.map((dataItem) => dataItem === null || dataItem === void 0 ? void 0 : dataItem.topic_id);
        res.send(val);
    });
};
exports.getProgressModuleTopic = getProgressModuleTopic;
const getTrackedCourse = (req, res) => {
    const enrollmentId = req.params.id;
    config_1.default.query('SELECT * FROM smartle.course_progress WHERE enrollment_id = ?;', [enrollmentId], (err, result) => {
        if (err) {
            console.log(err);
        }
        res.send(result);
    });
};
exports.getTrackedCourse = getTrackedCourse;
const updateTopicStatus = (req, res) => {
    const { courseTopic, enrollmentId } = req.body;
    config_1.default.query('UPDATE smartle.course_progress SET course_topic = ? WHERE enrollment_id = ?', [courseTopic, enrollmentId], (err, result) => {
        if (err) {
            console.log(err);
        }
        res.send({ result: 'success' });
    });
};
exports.updateTopicStatus = updateTopicStatus;
const updateModuleStatus = (req, res) => {
    const { courseModule, enrollmentId } = req.body;
    config_1.default.query('UPDATE smartle.course_progress SET course_module = ? WHERE enrollment_id = ?', [courseModule, enrollmentId], (err, result) => {
        if (err) {
            console.log(err);
        }
        res.send({ result: 'success' });
    });
};
exports.updateModuleStatus = updateModuleStatus;
const updateModuleCompeletedStatus = (req, res) => {
    const { enrollmentId } = req.body;
    config_1.default.query('SELECT * FROM smartle.course_progress WHERE course_modules_completed < course_total_modules AND enrollment_id = ?', [enrollmentId], (err, result) => {
        if (err) {
            console.log(err);
        }
        if (result.length === 0) {
            res.send({
                message: 'User Course Successfully Compeleted',
                status: 'error',
            });
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
                res.send({ result: 'success' });
            });
        }
    });
};
exports.updateModuleCompeletedStatus = updateModuleCompeletedStatus;
const enrolledUserProgressDefault = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { enrollmentId, courseId } = req.body;
    let moduleId = null;
    let topicId = null;
    let courseModuleLength = null;
    try {
        const [rows] = yield promisePool.query('SELECT module_id FROM smartle.coursemodule WHERE course_id = ?', [courseId]);
        const valModule = rows === null || rows === void 0 ? void 0 : rows.map((dataItem) => dataItem === null || dataItem === void 0 ? void 0 : dataItem.module_id);
        moduleId = valModule[0];
        courseModuleLength = valModule === null || valModule === void 0 ? void 0 : valModule.length;
        console.log(moduleId);
        console.log(valModule);
        console.log(courseModuleLength);
    }
    catch (sqlError) {
        console.log(sqlError);
    }
    if (moduleId !== null) {
        try {
            const [rows_module] = yield promisePool.query('SELECT topic_id FROM smartle.module_topic WHERE module_id = ?;', [moduleId]);
            const valTopic = rows_module === null || rows_module === void 0 ? void 0 : rows_module.map((dataItem) => dataItem === null || dataItem === void 0 ? void 0 : dataItem.topic_id);
            topicId = valTopic[0];
            console.log(topicId);
        }
        catch (sqlError) {
            console.log(sqlError);
        }
        try {
            const [rows] = yield promisePool.query(`INSERT INTO course_progress (course_topic, course_module, enrollment_id, course_total_modules, course_modules_completed_total,course_topics_completed, course_modules_completed) VALUES(?,?,?,?,?,?,?)`, [
                topicId,
                moduleId,
                enrollmentId,
                courseModuleLength,
                0,
                '[]',
                `[${moduleId}]`,
            ]);
            res.send({ result: 'success' });
        }
        catch (sqlError) {
            console.log(sqlError);
        }
    }
});
exports.enrolledUserProgressDefault = enrolledUserProgressDefault;
const updateTopicsCompleted = (req, res) => {
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
            res.send({ result: 'success' });
        });
    });
};
exports.updateTopicsCompleted = updateTopicsCompleted;
const getAllTopicsCompleted = (req, res) => {
    const { id } = req.params;
    config_1.default.query('SELECT course_topics_completed FROM smartle.course_progress WHERE enrollment_id = ?', [id], (err, result) => {
        if (err) {
            console.log(err);
        }
        const val = result === null || result === void 0 ? void 0 : result.map((dataItem) => dataItem === null || dataItem === void 0 ? void 0 : dataItem.course_topics_completed);
        res.send(val[0]);
    });
};
exports.getAllTopicsCompleted = getAllTopicsCompleted;
const courseProgressTopic = (req, res) => {
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
        res.send({ result: 'Success' });
    });
};
exports.courseProgressTopic = courseProgressTopic;
const courseModulesRemaining = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { courseId, enrollmentId } = req.body;
    let totalModules = [];
    let completedModules;
    let activeModules = [];
    try {
        const [rows] = yield promisePool.query('SELECT module_id FROM smartle.coursemodule WHERE course_id = ?', [courseId]);
        const val = rows === null || rows === void 0 ? void 0 : rows.map((dataItem) => dataItem === null || dataItem === void 0 ? void 0 : dataItem.module_id);
        totalModules = rows.map((dataItem) => dataItem === null || dataItem === void 0 ? void 0 : dataItem.module_id);
    }
    catch (sqlError) {
        console.log(sqlError);
    }
    try {
        const [rows1] = yield promisePool.query('SELECT course_modules_completed FROM smartle.course_progress WHERE enrollment_id = ?;', [enrollmentId]);
        completedModules = rows1[0].course_modules_completed;
        activeModules = totalModules.filter((val) => !completedModules.includes(val));
    }
    catch (sqlError) {
        console.log(sqlError);
    }
    try {
        const [rows2] = yield promisePool.query(`SELECT * FROM module JOIN coursemodule ON module.module_id = coursemodule.module_id AND coursemodule.course_id=?`, [courseId]);
        let finalArray = activeModules.map((dataID) => {
            let individualVal = rows2.filter((dataItem) => dataItem.module_id === dataID);
            return individualVal[0];
        });
        res.send(finalArray);
    }
    catch (sqlError) {
        console.log(sqlError);
    }
});
exports.courseModulesRemaining = courseModulesRemaining;
const courseModulesDone = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { courseId, enrollmentId } = req.body;
    let completedModules;
    try {
        const [rows] = yield promisePool.query('SELECT course_modules_completed FROM smartle.course_progress WHERE enrollment_id = ?;', [enrollmentId]);
        completedModules = (_a = rows[0]) === null || _a === void 0 ? void 0 : _a.course_modules_completed;
        console.log(completedModules);
        try {
            const [rows2] = yield promisePool.query(`SELECT * FROM module JOIN coursemodule ON module.module_id = coursemodule.module_id AND coursemodule.course_id=?`, [courseId]);
            let finalArray = completedModules.map((dataID) => {
                let individualVal = rows2.filter((dataItem) => dataItem.module_id === dataID);
                return individualVal[0];
            });
            res.send(finalArray);
        }
        catch (sqlError) {
            console.log(sqlError);
        }
    }
    catch (sqlError) {
        console.log(sqlError);
    }
});
exports.courseModulesDone = courseModulesDone;
const updateModuleCompeletedArray = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { moduleIDCompleted, enrollmentId } = req.body;
    let val;
    try {
        const [result] = yield promisePool.query('SELECT course_modules_completed FROM course_progress WHERE enrollment_id = ?', [enrollmentId]);
        val = result === null || result === void 0 ? void 0 : result.map((dataItem) => dataItem === null || dataItem === void 0 ? void 0 : dataItem.course_modules_completed);
        val[0].push(moduleIDCompleted);
        try {
            const [updated] = yield promisePool.query(`UPDATE smartle.course_progress SET course_modules_completed = '[${val[0]}]' WHERE enrollment_id = ${enrollmentId}`);
            res.send({ result: 'success' });
        }
        catch (sqlError) {
            console.log(sqlError);
        }
    }
    catch (sqlError) {
        console.log(sqlError);
    }
});
exports.updateModuleCompeletedArray = updateModuleCompeletedArray;
const getDoneModulesID = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { enrollmentId } = req.body;
    try {
        const [rows] = yield promisePool.query('SELECT course_modules_completed FROM smartle.course_progress WHERE enrollment_id = ?', [enrollmentId]);
        let result = rows[0].course_modules_completed;
        res.send(result);
    }
    catch (sqlError) {
        console.log(sqlError);
    }
});
exports.getDoneModulesID = getDoneModulesID;
const getModuleTopicIdList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { moduleId } = req.body;
    try {
        const [rows] = yield promisePool.query('SELECT * FROM smartle.module_topic INNER JOIN topic ON module_topic.topic_id = topic.topic_id WHERE module_id = ?;', [moduleId]);
        let result = rows.map((dataItem, index) => dataItem.topic_id);
        res.json(result);
    }
    catch (sqlError) {
        console.log(sqlError);
    }
});
exports.getModuleTopicIdList = getModuleTopicIdList;
