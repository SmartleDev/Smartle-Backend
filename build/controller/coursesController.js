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
exports.getCourseName = exports.getRecommendedCourses = exports.getEnrolledCourseView = exports.getModuleView = exports.getTopicforModule = exports.getModuleforCourse = exports.getCourseDetailsHome = exports.getCourseGeneralView = exports.getCourseView = exports.getAllCoursesOnHome = exports.getAllCourses = void 0;
const config_1 = __importDefault(require("../config/config"));
const promisePool = config_1.default.promise();
const getAllCourses = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let sql = `SELECT * from smartle.course_general`;
    try {
        const [result] = yield promisePool.query(sql);
        const resultsPerPage = 3;
        const numOfResult = result.length;
        const numberOfPages = Math.ceil(numOfResult / resultsPerPage);
        let page = req.query.page ? Number(req.query.page) : 1;
        if (page > numberOfPages) {
            res.redirect(`/?page=` + encodeURIComponent(numberOfPages));
        }
        else if (page < 1) {
            res.redirect(`/?page=` + encodeURIComponent('1'));
        }
        const startingLimit = (page - 1) * resultsPerPage;
        sql = `SELECT * from smartle.course_general`;
        try {
            const [rows] = yield promisePool.query(sql);
            let iterator = page - 5 < 1 ? 1 : page - 5;
            let endingLink = iterator + 9 <= numberOfPages
                ? iterator + 9
                : page + (numberOfPages - page);
            if (endingLink < page + 4) {
                iterator -= page + 4 - numberOfPages;
            }
            res.send({ result, page, iterator, numberOfPages }).end();
        }
        catch (sqlError) {
            console.log(sqlError);
        }
    }
    catch (sqlError) {
        console.log(sqlError);
    }
});
exports.getAllCourses = getAllCourses;
const getAllCoursesOnHome = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let sql = `SELECT * FROM smartle.course_general WHERE course_displayonhome = TRUE;`;
    try {
        const [result] = yield promisePool.query(sql);
        res.send(result);
    }
    catch (sqlError) {
        console.log(sqlError);
    }
});
exports.getAllCoursesOnHome = getAllCoursesOnHome;
const getCourseView = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let course_id = req.params.id;
    let sql = `SELECT * FROM smartle.course WHERE course_id = "${course_id}"`;
    try {
        const [rows] = yield promisePool.query(sql);
        res.send(rows).end();
    }
    catch (sqlError) {
        console.log(sqlError);
    }
});
exports.getCourseView = getCourseView;
const getCourseGeneralView = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let course_id = req.params.id;
    let sql = `SELECT * FROM smartle.course_general WHERE course_title = "${course_id}"`;
    try {
        const [rows] = yield promisePool.query(sql);
        res.send(rows).end();
    }
    catch (sqlError) {
        console.log(sqlError);
    }
});
exports.getCourseGeneralView = getCourseGeneralView;
const getCourseDetailsHome = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { course_title, course_age, course_type } = req.body;
    try {
        const [rows] = yield promisePool.query(`SELECT * FROM smartle.course WHERE course_title = ? AND course_age = ? AND course_type = ?`, [course_title, course_age, course_type]);
        res.send(rows).end();
    }
    catch (sqlError) {
        console.log(sqlError);
    }
});
exports.getCourseDetailsHome = getCourseDetailsHome;
const getModuleforCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let course_id = req.params.id;
    let sql = `SELECT * FROM module JOIN coursemodule ON module.module_id = coursemodule.module_id AND coursemodule.course_id=${course_id}`;
    try {
        const [rows] = yield promisePool.query(sql);
        res.send(rows).end();
    }
    catch (sqlError) {
        console.log(sqlError);
    }
});
exports.getModuleforCourse = getModuleforCourse;
const getTopicforModule = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let moduleId = req.params.id;
    let sql = `SELECT * FROM smartle.module_topic  INNER JOIN  topic ON module_topic.topic_id = topic.topic_id WHERE module_id = ${moduleId}`;
    try {
        const [result] = yield promisePool.query(sql);
        res.send(result).end();
    }
    catch (sqlError) {
        console.log(sqlError);
    }
});
exports.getTopicforModule = getTopicforModule;
const getModuleView = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let moduleId = req.params.id;
    let sql = `SELECT * FROM smartle.module WHERE module_id = ${moduleId}`;
    try {
        const [result] = yield promisePool.query(sql);
        res.send(result).end();
    }
    catch (sqlError) {
        console.log(sqlError);
    }
});
exports.getModuleView = getModuleView;
const getEnrolledCourseView = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { moduleId, studentId } = req.body;
    try {
        const [result] = yield promisePool.query(`SELECT * FROM smartle.enrollment WHERE student_id = ? AND course_id = ?`, [studentId, moduleId]);
        res.send(result).end();
    }
    catch (sqlError) {
        console.log(sqlError);
    }
});
exports.getEnrolledCourseView = getEnrolledCourseView;
const getRecommendedCourses = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { learnerAge } = req.body;
    if (learnerAge === 9) {
        learnerAge = 8;
    }
    let sql = `SELECT * FROM smartle.course_general WHERE course_age REGEXP ${learnerAge}`;
    try {
        const [rows] = yield promisePool.query(sql);
        res.send(rows).end();
    }
    catch (sqlError) {
        console.log(sqlError);
    }
});
exports.getRecommendedCourses = getRecommendedCourses;
const getCourseName = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { courseID } = req.body;
    try {
        const [result] = yield promisePool.query(`SELECT course_name FROM smartle.course WHERE course_id = ?;`, [courseID]);
        res.send(result).end();
    }
    catch (sqlError) {
        console.log(sqlError);
    }
});
exports.getCourseName = getCourseName;
