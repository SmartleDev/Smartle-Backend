import mysql from 'mysql';
import express, { Request, Response, urlencoded } from 'express';
import db from '../config/config';
const promisePool = db.promise();
export const getLearnerCourses = async (req: Request, res: Response) => {
  let { studentId } = req.body;

  let sql = `SELECT * FROM smartle.enrollment INNER JOIN course ON course.course_id = enrollment.course_id WHERE student_id = ${studentId} AND course_progress != 100`;
  try {
    const [rows]: any = await promisePool.query(sql);
    res.send(rows);
  } catch (sqlError) {
    console.log(sqlError);
  }
};

export const getEnrollmentStatus = async (req: Request, res: Response) => {
  let { studentId, courseId, courseType } = req.body;

  let sql = `SELECT * FROM smartle.enrollment INNER JOIN course ON course.course_id = enrollment.course_id WHERE enrollment.student_id = ${studentId} AND enrollment.course_id = ${courseId} AND course_type = "${courseType}"`;
  try {
    const [rows]: any = await promisePool.query(sql);
    res.send(rows);
  } catch (sqlError) {
    console.log(sqlError);
  }
};
export const getCertificatesOfStudent = async (req: Request, res: Response) => {
  let { studentId } = req.body;

  let sql = `SELECT * FROM smartle.enrollment INNER JOIN course ON course.course_id = enrollment.course_id WHERE student_id = ${studentId} AND course_progress = 100`;
  try {
    const [rows]: any = await promisePool.query(sql);
    res.send(rows);
  } catch (sqlError) {
    console.log(sqlError);
  }
};

export const getEnrolledCourseView = async (req: Request, res: Response) => {
  let { courseId, studentId } = req.body;
  try {
    const [rows]: any = await promisePool.query(
      `SELECT * FROM smartle.enrollment INNER JOIN smartle.course ON enrollment.course_id = course.course_id WHERE student_id = ? AND enrollment.course_id = ?`,
      [studentId, courseId]
    );
    res.send(rows);
  } catch (sqlError) {
    console.log(sqlError);
  }
};

export const getInstructorList = async (req: Request, res: Response) => {
  let { courseId } = req.body;
  try {
    const [rows]: any = await promisePool.query(
      `SELECT * FROM smartle.instructor_course INNER JOIN instructor ON instructor_course.instructor_id = instructor.instructor_id WHERE course_id = ?`,
      [courseId]
    );
    res.send(rows);
  } catch (sqlError) {
    console.log(sqlError);
  }
};
export const getInstructorDetails = async (req: Request, res: Response) => {
  let instructorId = req.params.id;
  try {
    const [rows]: any = await promisePool.query(
      `SELECT * FROM smartle.instructor WHERE instructor_id = ?`,
      [instructorId]
    );
    res.send(rows);
  } catch (sqlError) {
    console.log(sqlError);
  }
};

export const getSessionView = async (req: Request, res: Response) => {
  let { instructorId, courseId } = req.body;
  try {
    const [rows]: any = await promisePool.query(
      ` SELECT * FROM smartle.session WHERE course_id = ? AND date(session_date) >= curdate() ORDER BY session_date ASC`,
      [courseId]
    );
    res.send(rows);
  } catch (sqlError) {
    console.log(sqlError);
  }
};

export const enrollLearner = async (req: Request, res: Response) => {
  let { courseId, studentId, sessionId, enrollmentType } = req.body;
  try {
    const [rows]: any = await promisePool.query(
      `SELECT * FROM enrollment WHERE course_id = ? AND student_id = ?`,
      [courseId, studentId]
    );

    if (rows.length === 0) {
      const [result]: any = await promisePool.query(
        `INSERT INTO enrollment (course_id, student_id,  course_progress, session_id, enrollment_type) VALUES(?,?,?,?,?)`,
        [courseId, studentId, 0, sessionId, enrollmentType]
      );
      const [row]: any = await promisePool.query(
        `SELECT enrollment_id FROM smartle.enrollment WHERE course_id = ? AND student_id = ?;`,
        [courseId, studentId]
      );
      res.send({
        enrolmentId: row[0]?.enrollment_id,
        message: 'Congratualtions You have Booked This Course',
      });

      // res.send({message : 'Congratualtions You have Booked This Course', status : 'success'});
    } else {
      res.send({
        message: 'User Already Register for This Course',
        status: 'error',
      });
    }
  } catch (sqlError) {
    console.log(sqlError);
  }
};

export const getEnrolledSessionDetails = async (
  req: Request,
  res: Response
) => {
  let { courseId, studentId } = req.body;
  try {
    const [rows]: any = await promisePool.query(
      `SELECT * FROM smartle.enrollment INNER JOIN smartle.session ON enrollment.session_id = session.session_id WHERE enrollment.course_id = ? AND enrollment.student_id = ?;`,
      [courseId, studentId]
    );
    res.send(rows);
  } catch (sqlError) {
    console.log(sqlError);
  }
};

export const verifyUserEnrollment = async (req: Request, res: Response) => {
  let { studentId, courseId } = req.body;
  try {
    const [result]: any = await promisePool.query(
      `SELECT * FROM smartle.enrollment WHERE student_id = ? AND course_id = ?`,
      [studentId, courseId]
    );
    if (result.length === 0) {
      res.send(false);
    } else {
      res.send(true);
    }
  } catch (sqlError) {
    console.log(sqlError);
  }
};

export const convertTrialToBuyCourse = async (req: Request, res: Response) => {
  let { enrollmentId } = req.body;

  try {
    const [rows]: any = await promisePool.query(
      `UPDATE smartle.enrollment SET enrollment_type = 'paid' WHERE enrollment_id = ${enrollmentId}`
    );
    res.send({
      message: 'Congratualtions Your Trial Is now a Compelet Course',
      status: 'success',
    });
  } catch (sqlError) {
    console.log(sqlError);
  }
};

export const updateSessionAvaliablity = async (req: Request, res: Response) => {
  let { sessionId } = req.body;
  try {
    const [result]: any = await promisePool.query(
      `UPDATE smartle.session SET session_avalibility = session_avalibility - 1 WHERE session_id = ${sessionId}`
    );
    res.send(true);
  } catch (sqlError) {
    console.log(sqlError);
  }
};
export const getTopicContent = async (req: Request, res: Response) => {
  let topicId = req.params.id;
  try {
    const [result]: any = await promisePool.query(
      `SELECT * FROM smartle.topic WHERE topic_id = ${topicId};`
    );
    res.send(result);
  } catch (sqlError) {
    console.log(sqlError);
  }
};

export const getKeyEvents = async (req: Request, res: Response) => {
  let { student_id } = req.body;
  try {
    const [result]: any = await promisePool.query(
      `SELECT * FROM smartle.enrollment INNER JOIN smartle.session ON smartle.enrollment.session_id=smartle.session.session_id WHERE student_id=${student_id};`
    );
    res.send(result);
  } catch (sqlError) {
    console.log(sqlError);
  }
};

export const updateCourseProgress = ((req: Request, res: Response) => {
  const {enrollmentId} = req.body
  let courseProgress: any;
  db.query('SELECT * FROM smartle.course_progress WHERE enrollment_id = ? ;',[enrollmentId], (err: any, result: any) =>{
    if(err){
        console.log(err);
    }
    console.log(result[0].course_modules_completed)
    let modulesCompleted = result[0].course_modules_completed.length
    let totalModules = result[0].course_total_modules
    courseProgress = (modulesCompleted/totalModules)*100
        db.query('UPDATE smartle.enrollment SET course_progress = ? WHERE enrollment_id = ?;',[courseProgress, enrollmentId], (err: any, rows: any) =>{
            if(err){
                console.log(err);
            }
            res.send({message : "Success"})
            console.log(courseProgress)
        });
});


});

