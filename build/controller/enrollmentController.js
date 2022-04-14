"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.enrollLearner = exports.getSessionView = exports.getCourseAndInstructorDetails = exports.getInstructorList = exports.getEnrolledCourseView = exports.getLearnerCourses = void 0;
const config_1 = __importDefault(require("../config/config"));
exports.getLearnerCourses = ((req, res) => {
    let { studentId } = req.body;
    let sql = `SELECT * FROM smartle.enrollment INNER JOIN course ON course.course_id = enrollment.course_id WHERE student_id = ${studentId}`;
    config_1.default.query(sql, (err, rows) => {
        if (err) {
            console.log(err);
        }
        res.send(rows);
    });
});
exports.getEnrolledCourseView = ((req, res) => {
    let { courseId, studentId } = req.body;
    config_1.default.query(`SELECT * FROM smartle.enrollment INNER JOIN smartle.course ON enrollment.course_id = course.course_id WHERE student_id = ? AND enrollment.course_id = ?`, [studentId, courseId], (err, result) => {
        if (err) {
            console.log(err);
        }
        res.send(result);
    });
});
exports.getInstructorList = ((req, res) => {
    let { courseId } = req.body;
    config_1.default.query(`SELECT * FROM smartle.instructor_course INNER JOIN instructor ON instructor_course.instructor_id = instructor.instructor_id WHERE course_id = ?`, [courseId], (err, result) => {
        if (err) {
            console.log(err);
        }
        res.send(result);
    });
});
exports.getCourseAndInstructorDetails = ((req, res) => {
    let { courseId, instructorId } = req.body;
    config_1.default.query(`SELECT * FROM smartle.instructor_course INNER JOIN instructor ON instructor_course.instructor_id = instructor.instructor_id INNER JOIN course ON instructor_course.course_id = course.course_id WHERE instructor_course.course_id = ? AND instructor_course.instructor_id = ?`, [courseId, instructorId], (err, result) => {
        if (err) {
            console.log(err);
        }
        res.send(result);
    });
});
exports.getSessionView = ((req, res) => {
    let { instructorId, courseId } = req.body;
    config_1.default.query(` SELECT * FROM smartle.session INNER JOIN instructor_course ON session.instructor_course_id = instructor_course.instructor_course_id WHERE instructor_id = ? AND course_id = ?`, [instructorId, courseId], (err, result) => {
        if (err) {
            console.log(err);
        }
        res.send(result);
    });
});
exports.enrollLearner = ((req, res) => {
    let { courseId, studentId, studentFeeStatus, instructorId } = req.body;
    config_1.default.query(`INSERT INTO enrollment (course_id, student_id, student_feestatus, course_progress, instructor_id) VALUES(?,?,?,?,?)`, [courseId, studentId, studentFeeStatus, 0, instructorId], (err, result) => {
        if (err) {
            console.log(err);
        }
        res.send(result);
    });
});
