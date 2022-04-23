"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSessionAvaliablity = exports.convertTrialToBuyCourse = exports.verifyUserEnrollment = exports.getEnrolledSessionDetails = exports.enrollLearner = exports.getSessionView = exports.getInstructorDetails = exports.getInstructorList = exports.getEnrolledCourseView = exports.getLearnerCourses = void 0;
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
exports.getInstructorDetails = ((req, res) => {
    let instructorId = req.params.id;
    config_1.default.query(`SELECT * FROM smartle.instructor WHERE instructor_id = ?`, [instructorId], (err, result) => {
        if (err) {
            console.log(err);
        }
        res.send(result);
    });
});
exports.getSessionView = ((req, res) => {
    let { instructorId, courseId } = req.body;
    config_1.default.query(` SELECT * FROM smartle.session WHERE course_id = ? ORDER BY session_datetime`, [courseId], (err, result) => {
        if (err) {
            console.log(err);
        }
        res.send(result);
    });
});
exports.enrollLearner = ((req, res) => {
    let { courseId, studentId, studentFeeStatus, sessionId, enrollmentType, courseProgress } = req.body;
    config_1.default.query(`SELECT * FROM enrollment WHERE course_id = ? AND student_id = ?`, [courseId, studentId], (err, result) => {
        if (err) {
            console.log(err);
        }
        if (result.length === 0) {
            config_1.default.query(`INSERT INTO enrollment (course_id, student_id, student_feestatus, course_progress, session_id, enrollment_type) VALUES(?,?,?,?,?,?)`, [courseId, studentId, studentFeeStatus, courseProgress, 0, sessionId, enrollmentType], (err, result) => {
                if (err) {
                    console.log(err);
                }
                res.send({ message: 'Congratualtions You have Booked This Trial Course', status: 'success' });
            });
        }
        else {
            res.send({ message: 'User Already Register for This Course', status: 'error' });
        }
    });
});
exports.getEnrolledSessionDetails = ((req, res) => {
    let { courseId, studentId } = req.body;
    config_1.default.query(`SELECT * FROM smartle.enrollment INNER JOIN smartle.session ON enrollment.session_id = session.session_id WHERE enrollment.course_id = ? AND enrollment.student_id = ?;`, [courseId, studentId], (err, result) => {
        if (err) {
            console.log(err);
        }
        res.send(result);
    });
});
exports.verifyUserEnrollment = ((req, res) => {
    let { studentId, courseId } = req.body;
    config_1.default.query(`SELECT * FROM smartle.enrollment WHERE student_id = ? AND course_id = ?`, [studentId, courseId], (err, result) => {
        if (err) {
            console.log(err);
        }
        if (result.length === 0) {
            res.send(false);
        }
        else {
            res.send(true);
        }
    });
});
exports.convertTrialToBuyCourse = ((req, res) => {
    let { enrollmentId } = req.body;
    config_1.default.query(`UPDATE smartle.enrollment SET enrollment_type = 'paid', course_progress = 0 WHERE enrollment_id = ${enrollmentId}`, (err, result) => {
        if (err) {
            console.log(err);
        }
        res.send({ message: "Congratualtions Your Trial Is now a Compelet Course", status: "success" });
    });
});
exports.updateSessionAvaliablity = ((req, res) => {
    let { sessionId } = req.body;
    config_1.default.query(`UPDATE smartle.session SET session_avalibility = session_avalibility - 1 WHERE session_id = ${sessionId}`, (err, result) => {
        if (err) {
            console.log(err);
        }
        res.send(true);
    });
});
