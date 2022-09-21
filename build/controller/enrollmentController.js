"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getKeyEvents = exports.getTopicContent = exports.updateSessionAvaliablity = exports.convertTrialToBuyCourse = exports.verifyUserEnrollment = exports.getEnrolledSessionDetails = exports.enrollLearner = exports.getSessionView = exports.getInstructorDetails = exports.getInstructorList = exports.getEnrolledCourseView = exports.getLearnerCourses = void 0;
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
    config_1.default.query(` SELECT * FROM smartle.session WHERE course_id = ? AND date(session_date) >= curdate() ORDER BY session_date ASC`, [courseId], (err, result) => {
        if (err) {
            console.log(err);
        }
        res.send(result);
    });
});
exports.enrollLearner = ((req, res) => {
    let { courseId, studentId, sessionId, enrollmentType } = req.body;
    config_1.default.query(`SELECT * FROM enrollment WHERE course_id = ? AND student_id = ?`, [courseId, studentId], (err, result) => {
        if (err) {
            console.log(err);
        }
        if (result.length === 0) {
            config_1.default.query(`INSERT INTO enrollment (course_id, student_id,  course_progress, session_id, enrollment_type) VALUES(?,?,?,?,?)`, [courseId, studentId, 0, sessionId, enrollmentType], (err, result) => {
                if (err) {
                    console.log(err);
                }
                config_1.default.query(`SELECT enrollment_id FROM smartle.enrollment WHERE course_id = ? AND student_id = ?;`, [courseId, studentId], (err, result) => {
                    var _a;
                    if (err) {
                        console.log(err);
                    }
                    res.send({ enrolmentId: (_a = result[0]) === null || _a === void 0 ? void 0 : _a.enrollment_id, message: 'Congratualtions You have Booked This Course' });
                });
                // res.send({message : 'Congratualtions You have Booked This Course', status : 'success'});
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
    config_1.default.query(`UPDATE smartle.enrollment SET enrollment_type = 'paid' WHERE enrollment_id = ${enrollmentId}`, (err, result) => {
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
exports.getTopicContent = ((req, res) => {
    let topicId = req.params.id;
    config_1.default.query(`SELECT * FROM smartle.topic WHERE topic_id = ${topicId};`, (err, result) => {
        if (err) {
            console.log(err);
        }
        res.send(result);
    });
});
exports.getKeyEvents = ((req, res) => {
    let { student_id } = req.body;
    config_1.default.query(`SELECT * FROM smartle.enrollment INNER JOIN smartle.session ON smartle.enrollment.session_id=smartle.session.session_id WHERE student_id=${student_id};`, (err, result) => {
        if (err) {
            console.log(err);
        }
        res.send(result);
    });
});
