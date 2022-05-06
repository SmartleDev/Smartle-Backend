import mysql from 'mysql';
import express, {Request, Response, urlencoded} from 'express';
import db from '../config/config';

export const getLearnerCourses =  ((req: Request, res: Response) => {
	
    let {studentId} = req.body

    let sql = `SELECT * FROM smartle.enrollment INNER JOIN course ON course.course_id = enrollment.course_id WHERE student_id = ${studentId}`;
    db.query(sql, (err: any, rows: any) =>{
        if(err){
            console.log(err);
        }
        res.send(rows);
    });
});

export const getEnrolledCourseView =  ((req: Request, res: Response) => {
    let {courseId, studentId} = req.body;
    db.query(`SELECT * FROM smartle.enrollment INNER JOIN smartle.course ON enrollment.course_id = course.course_id WHERE student_id = ? AND enrollment.course_id = ?`, [studentId, courseId], (err: any, result: any) =>{
        if(err){
            console.log(err);
        }
        res.send(result);
    });
}); 

export const getInstructorList =  ((req: Request, res: Response) => {
    let {courseId} = req.body;
    db.query(`SELECT * FROM smartle.instructor_course INNER JOIN instructor ON instructor_course.instructor_id = instructor.instructor_id WHERE course_id = ?`, [courseId],
     (err: any, result: any) =>{
        if(err){
            console.log(err);
        }
        res.send(result);
    });
}); 
export const getInstructorDetails =  ((req: Request, res: Response) => {
    let instructorId = req.params.id;
    db.query(`SELECT * FROM smartle.instructor WHERE instructor_id = ?`, [instructorId],
     (err: any, result: any) =>{
        if(err){
            console.log(err);
        }
        res.send(result);
    });
}); 

export const getSessionView =  ((req: Request, res: Response) => {
    let {instructorId, courseId} = req.body;
    db.query(` SELECT * FROM smartle.session WHERE course_id = ? ORDER BY session_datetime`, [courseId], (err: any, result: any) =>{
        if(err){
            console.log(err);
        }
        res.send(result);
    });
}); 

export const enrollLearner=  ((req: Request, res: Response) => {

    let {courseId, studentId, studentFeeStatus, sessionId, enrollmentType} = req.body;
    db.query(`SELECT * FROM enrollment WHERE course_id = ? AND student_id = ?`, [courseId, studentId], (err: any, result: any) =>{
        if(err){
            console.log(err);
        }
        if(result.length === 0){
            db.query(`INSERT INTO enrollment (course_id, student_id, student_feestatus, course_progress, session_id, enrollment_type) VALUES(?,?,?,?,?,?)`, [courseId, studentId, studentFeeStatus,0,sessionId, enrollmentType], (err: any, result: any) =>{
                if(err){
                    console.log(err);
                }
                db.query(`SELECT enrollment_id FROM smartle.enrollment WHERE course_id = ? AND student_id = ?;`, [courseId, studentId], (err: any, result: any) =>{
                    if(err){
                        console.log(err);
                    }
                    res.send({enrolmentId : result[0]?.enrollment_id, message : 'Congratualtions You have Booked This Course'});
                });
                // res.send({message : 'Congratualtions You have Booked This Course', status : 'success'});
            });
        }else{
            res.send({message : 'User Already Register for This Course', status : 'error'})
        }
    });
}); 


export const getEnrolledSessionDetails =  ((req: Request, res: Response) => {
    let {courseId, studentId} = req.body;
    db.query(`SELECT * FROM smartle.enrollment INNER JOIN smartle.session ON enrollment.session_id = session.session_id WHERE enrollment.course_id = ? AND enrollment.student_id = ?;`, [courseId, studentId], (err: any, result: any) =>{
        if(err){
            console.log(err);
        }
        res.send(result);
    });
}); 


export const verifyUserEnrollment =  ((req: Request, res: Response) => {
    let {studentId, courseId} = req.body;
    db.query(`SELECT * FROM smartle.enrollment WHERE student_id = ? AND course_id = ?`, [studentId, courseId], (err: any, result: any) =>{
        if(err){
            console.log(err);
        }
        if(result.length === 0){
            res.send(false)
        }else{
            res.send(true)
        }
    });
}); 

export const convertTrialToBuyCourse =  ((req: Request, res: Response) => {
    let {enrollmentId} = req.body;
    db.query(`UPDATE smartle.enrollment SET enrollment_type = 'paid' WHERE enrollment_id = ${enrollmentId}`, (err: any, result: any) =>{
        if(err){
            console.log(err);
        }
        res.send({message : "Congratualtions Your Trial Is now a Compelet Course", status : "success"});
    });
}); 

export const updateSessionAvaliablity =  ((req: Request, res: Response) => {
    let {sessionId} = req.body;
    db.query(`UPDATE smartle.session SET session_avalibility = session_avalibility - 1 WHERE session_id = ${sessionId}`, (err: any, result: any) =>{
        if(err){
            console.log(err);
        }
        res.send(true);
    });
}); 
export const getTopicContent =  ((req: Request, res: Response) => {
    let topicId = req.params.id;
    db.query(`SELECT * FROM smartle.topic WHERE topic_id = ${topicId};`, (err: any, result: any) =>{
        if(err){
            console.log(err);
        }
        res.send(result);
    });
}); 




