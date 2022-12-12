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
exports.updateCourseProgress = exports.getKeyEvents = exports.getTopicContent = exports.updateSessionAvaliablity = exports.convertTrialToBuyCourse = exports.verifyUserEnrollment = exports.getEnrolledSessionDetails = exports.enrollLearner = exports.getSessionView = exports.getInstructorDetails = exports.getInstructorList = exports.getEnrolledCourseView = exports.getCertificatesOfStudent = exports.getEnrollmentStatus = exports.getLearnerCourses = void 0;
const config_1 = __importDefault(require("../config/config"));
const promisePool = config_1.default.promise();
const getLearnerCourses = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { studentId } = req.body;
    let sql = `SELECT * FROM smartle.enrollment INNER JOIN course ON course.course_id = enrollment.course_id WHERE student_id = ${studentId} AND course_progress != 100`;
    try {
        const [rows] = yield promisePool.query(sql);
        res.send(rows);
    }
    catch (sqlError) {
        console.log(sqlError);
    }
});
exports.getLearnerCourses = getLearnerCourses;
const getEnrollmentStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { studentId, courseId, courseType } = req.body;
    let sql = `SELECT * FROM smartle.enrollment INNER JOIN course ON course.course_id = enrollment.course_id WHERE enrollment.student_id = ${studentId} AND enrollment.course_id = ${courseId} AND course_type = "${courseType}"`;
    try {
        const [rows] = yield promisePool.query(sql);
        res.send(rows);
    }
    catch (sqlError) {
        console.log(sqlError);
    }
});
exports.getEnrollmentStatus = getEnrollmentStatus;
const getCertificatesOfStudent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { studentId } = req.body;
    let sql = `SELECT * FROM smartle.enrollment INNER JOIN course ON course.course_id = enrollment.course_id WHERE student_id = ${studentId} AND course_progress = 100`;
    try {
        const [rows] = yield promisePool.query(sql);
        res.send(rows);
    }
    catch (sqlError) {
        console.log(sqlError);
    }
});
exports.getCertificatesOfStudent = getCertificatesOfStudent;
const getEnrolledCourseView = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { courseId, studentId } = req.body;
    try {
        const [rows] = yield promisePool.query(`SELECT * FROM smartle.enrollment INNER JOIN smartle.course ON enrollment.course_id = course.course_id WHERE student_id = ? AND enrollment.course_id = ?`, [studentId, courseId]);
        res.send(rows);
    }
    catch (sqlError) {
        console.log(sqlError);
    }
});
exports.getEnrolledCourseView = getEnrolledCourseView;
const getInstructorList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { courseId } = req.body;
    try {
        const [rows] = yield promisePool.query(`SELECT * FROM smartle.instructor_course INNER JOIN instructor ON instructor_course.instructor_id = instructor.instructor_id WHERE course_id = ?`, [courseId]);
        res.send(rows);
    }
    catch (sqlError) {
        console.log(sqlError);
    }
});
exports.getInstructorList = getInstructorList;
const getInstructorDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let instructorId = req.params.id;
    try {
        const [rows] = yield promisePool.query(`SELECT * FROM smartle.instructor WHERE instructor_id = ?`, [instructorId]);
        res.send(rows);
    }
    catch (sqlError) {
        console.log(sqlError);
    }
});
exports.getInstructorDetails = getInstructorDetails;
const getSessionView = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { instructorId, courseId } = req.body;
    try {
        const [rows] = yield promisePool.query(` SELECT * FROM smartle.session WHERE course_id = ? AND date(session_date) >= curdate() ORDER BY session_date ASC`, [courseId]);
        res.send(rows);
    }
    catch (sqlError) {
        console.log(sqlError);
    }
});
exports.getSessionView = getSessionView;
const enrollLearner = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    let { courseId, studentId, sessionId, enrollmentType } = req.body;
    try {
        const [rows] = yield promisePool.query(`SELECT * FROM enrollment WHERE course_id = ? AND student_id = ?`, [courseId, studentId]);
        if (rows.length === 0) {
            const [result] = yield promisePool.query(`INSERT INTO enrollment (course_id, student_id,  course_progress, session_id, enrollment_type) VALUES(?,?,?,?,?)`, [courseId, studentId, 0, sessionId, enrollmentType]);
            const [row] = yield promisePool.query(`SELECT enrollment_id FROM smartle.enrollment WHERE course_id = ? AND student_id = ?;`, [courseId, studentId]);
            res.send({
                enrolmentId: (_a = row[0]) === null || _a === void 0 ? void 0 : _a.enrollment_id,
                message: 'Congratualtions You have Booked This Course',
            });
            // res.send({message : 'Congratualtions You have Booked This Course', status : 'success'});
        }
        else {
            res.send({
                message: 'User Already Register for This Course',
                status: 'error',
            });
        }
    }
    catch (sqlError) {
        console.log(sqlError);
    }
});
exports.enrollLearner = enrollLearner;
const getEnrolledSessionDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { courseId, studentId } = req.body;
    try {
        const [rows] = yield promisePool.query(`SELECT * FROM smartle.enrollment INNER JOIN smartle.session ON enrollment.session_id = session.session_id WHERE enrollment.course_id = ? AND enrollment.student_id = ?;`, [courseId, studentId]);
        res.send(rows);
    }
    catch (sqlError) {
        console.log(sqlError);
    }
});
exports.getEnrolledSessionDetails = getEnrolledSessionDetails;
const verifyUserEnrollment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { studentId, courseId } = req.body;
    try {
        const [result] = yield promisePool.query(`SELECT * FROM smartle.enrollment WHERE student_id = ? AND course_id = ?`, [studentId, courseId]);
        if (result.length === 0) {
            res.send(false);
        }
        else {
            res.send(true);
        }
    }
    catch (sqlError) {
        console.log(sqlError);
    }
});
exports.verifyUserEnrollment = verifyUserEnrollment;
const convertTrialToBuyCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { enrollmentId } = req.body;
    try {
        const [rows] = yield promisePool.query(`UPDATE smartle.enrollment SET enrollment_type = 'paid' WHERE enrollment_id = ${enrollmentId}`);
        res.send({
            message: 'Congratualtions Your Trial Is now a Compelet Course',
            status: 'success',
        });
    }
    catch (sqlError) {
        console.log(sqlError);
    }
});
exports.convertTrialToBuyCourse = convertTrialToBuyCourse;
const updateSessionAvaliablity = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { sessionId } = req.body;
    try {
        const [result] = yield promisePool.query(`UPDATE smartle.session SET session_avalibility = session_avalibility - 1 WHERE session_id = ${sessionId}`);
        res.send(true);
    }
    catch (sqlError) {
        console.log(sqlError);
    }
});
exports.updateSessionAvaliablity = updateSessionAvaliablity;
const getTopicContent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let topicId = req.params.id;
    try {
        const [result] = yield promisePool.query(`SELECT * FROM smartle.topic WHERE topic_id = ${topicId};`);
        res.send(result);
    }
    catch (sqlError) {
        console.log(sqlError);
    }
});
exports.getTopicContent = getTopicContent;
const getKeyEvents = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { student_id } = req.body;
    try {
        const [result] = yield promisePool.query(`SELECT * FROM smartle.enrollment INNER JOIN smartle.session ON smartle.enrollment.session_id=smartle.session.session_id WHERE student_id=${student_id};`);
        res.send(result);
    }
    catch (sqlError) {
        console.log(sqlError);
    }
});
exports.getKeyEvents = getKeyEvents;
exports.updateCourseProgress = ((req, res) => {
    const { enrollmentId } = req.body;
    let courseProgress;
    config_1.default.query('SELECT * FROM smartle.course_progress WHERE enrollment_id = ? ;', [enrollmentId], (err, result) => {
        if (err) {
            console.log(err);
        }
        console.log(result[0].course_modules_completed);
        let modulesCompleted = result[0].course_modules_completed.length;
        let totalModules = result[0].course_total_modules;
        courseProgress = (modulesCompleted / totalModules) * 100;
        config_1.default.query('UPDATE smartle.enrollment SET course_progress = ? WHERE enrollment_id = ?;', [courseProgress, enrollmentId], (err, rows) => {
            if (err) {
                console.log(err);
            }
            res.send({ message: "Success" });
            console.log(courseProgress);
        });
    });
});
