"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRecommendedCourses = exports.getEnrolledCourseView = exports.getModuleView = exports.getTopicforModule = exports.getModuleforCourse = exports.getCourseView = exports.getAllCoursesOnHome = exports.getAllCourses = void 0;
const config_1 = __importDefault(require("../config/config"));
exports.getAllCourses = ((req, res) => {
    let sql = `SELECT * from course`;
    config_1.default.query(sql, (err, result) => {
        if (err) {
            console.log(err);
        }
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
        sql = `SELECT * from course`;
        config_1.default.query(sql, (err, result) => {
            if (err) {
                console.log(err);
            }
            let iterator = (page - 5) < 1 ? 1 : page - 5;
            let endingLink = (iterator + 9) <= numberOfPages ? (iterator + 9) : page +
                (numberOfPages - page);
            if (endingLink < (page + 4)) {
                iterator -= (page + 4) - numberOfPages;
            }
            res.send({ result, page, iterator, numberOfPages });
        });
    });
});
exports.getAllCoursesOnHome = ((req, res) => {
    let sql = `SELECT * from course LIMIT ${8}`;
    config_1.default.query(sql, (err, result) => {
        if (err) {
            console.log(err);
        }
        res.send(result);
    });
});
exports.getCourseView = ((req, res) => {
    let course_id = req.params.id;
    let sql = `SELECT * FROM course WHERE course_id = ${course_id}`;
    config_1.default.query(sql, (err, rows) => {
        if (err) {
            console.log(err);
        }
        res.send(rows);
    });
});
exports.getModuleforCourse = ((req, res) => {
    let course_id = req.params.id;
    let sql = `SELECT * FROM module JOIN coursemodule ON module.module_id = coursemodule.module_id AND coursemodule.course_id=${course_id}`;
    config_1.default.query(sql, (err, rows) => {
        if (err) {
            console.log(err);
        }
        res.send(rows);
    });
});
exports.getTopicforModule = ((req, res) => {
    let moduleId = req.params.id;
    let sql = `SELECT * FROM smartle.module_topic  INNER JOIN  topic ON module_topic.topic_id = topic.topic_id WHERE module_id = ${moduleId}`;
    config_1.default.query(sql, (err, result) => {
        if (err) {
            console.log(err);
        }
        res.send(result);
    });
});
exports.getModuleView = ((req, res) => {
    let moduleId = req.params.id;
    let sql = `SELECT * FROM smartle.module WHERE module_id = ${moduleId}`;
    config_1.default.query(sql, (err, result) => {
        if (err) {
            console.log(err);
        }
        res.send(result);
    });
});
exports.getEnrolledCourseView = ((req, res) => {
    let { moduleId, studentId } = req.body;
    config_1.default.query(`SELECT * FROM smartle.enrollment WHERE student_id = ? AND course_id = ?`, [studentId, moduleId], (err, result) => {
        if (err) {
            console.log(err);
        }
        res.send(result);
    });
});
exports.getRecommendedCourses = ((req, res) => {
    let { learnerAge } = req.body;
    if (learnerAge === 9) {
        learnerAge = 8;
    }
    let sql = `SELECT * FROM smartle.course WHERE course_age REGEXP ${learnerAge}`;
    config_1.default.query(sql, (err, rows) => {
        if (err) {
            console.log(err);
        }
        res.send(rows);
    });
});
