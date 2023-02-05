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
exports.getGradeInfo = exports.getGrads = exports.getEnterpriseCourse = exports.getHomeEnterpriseCourses = void 0;
const config_1 = __importDefault(require("../config/config"));
const promisePool = config_1.default.promise();
const getHomeEnterpriseCourses = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [rows] = yield promisePool.query('SELECT * from enterprise_courses WHERE enterprise = "True"');
        res.send(rows);
    }
    catch (sqlError) {
        console.log(sqlError);
    }
});
exports.getHomeEnterpriseCourses = getHomeEnterpriseCourses;
const getEnterpriseCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { courseName } = req.params;
    try {
        const [rows] = yield promisePool.query(`SELECT * from enterprise_courses WHERE enterprise = "True" AND enterprise_courses.slug = '${courseName}'`);
        res.send(rows);
    }
    catch (sqlError) {
        console.log(sqlError);
    }
});
exports.getEnterpriseCourse = getEnterpriseCourse;
const getGrads = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { courseName } = req.params;
    try {
        const [rows] = yield promisePool.query(`SELECT grade from enterprise_courses WHERE enterprise_courses.slug = '${courseName}'`);
        let val = rows.map((item) => item.grade);
        res.send(val);
    }
    catch (sqlError) {
        console.log(sqlError);
    }
});
exports.getGrads = getGrads;
const getGradeInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { courseName, grade } = req.body;
    try {
        const [rows] = yield promisePool.query(`SELECT timeline FROM smartle.enterprise_courses WHERE enterprise_courses.slug = ? AND enterprise_courses.grade = ?`, [courseName, grade]);
        res.send(rows[0].timeline);
    }
    catch (sqlError) {
        console.log(sqlError);
    }
});
exports.getGradeInfo = getGradeInfo;
