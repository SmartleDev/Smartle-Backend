import mysql from 'mysql';
import express, { Request, Response, urlencoded } from 'express';
import db from '../config/config';

const promisePool = db.promise();

export const getAllCourses = async (req: Request, res: Response) => {
  let sql = `SELECT * from smartle.course_general`;
  try {
    const [result]: any = await promisePool.query(sql);

    const resultsPerPage = 3;
    const numOfResult = result.length;
    const numberOfPages = Math.ceil(numOfResult / resultsPerPage);

    let page = req.query.page ? Number(req.query.page) : 1;

    if (page > numberOfPages) {
      res.redirect(`/?page=` + encodeURIComponent(numberOfPages));
    } else if (page < 1) {
      res.redirect(`/?page=` + encodeURIComponent('1'));
    }

    const startingLimit = (page - 1) * resultsPerPage;
    sql = `SELECT * from smartle.course_general`;

    try {
      const [rows]: any = await promisePool.query(sql);
      let iterator = page - 5 < 1 ? 1 : page - 5;
      let endingLink =
        iterator + 9 <= numberOfPages
          ? iterator + 9
          : page + (numberOfPages - page);

      if (endingLink < page + 4) {
        iterator -= page + 4 - numberOfPages;
      }

      res.send({ result, page, iterator, numberOfPages }).end();
    } catch (sqlError) {
      console.log(sqlError);
    }
  } catch (sqlError) {
    console.log(sqlError);
  }
};

export const getAllCoursesOnHome = async (req: Request, res: Response) => {
  let sql = `SELECT * FROM smartle.course_general WHERE course_displayonhome = TRUE;`;

  try {
    const [result]: any = await promisePool.query(sql);
    res.send(result);
  } catch (sqlError) {
    console.log(sqlError);
  }
};

export const getCourseView = async (req: Request, res: Response) => {
  let course_id = req.params.id;
  let sql = `SELECT * FROM smartle.course WHERE course_id = "${course_id}"`;
  try {
    const [rows]: any = await promisePool.query(sql);
    res.send(rows).end();
  } catch (sqlError) {
    console.log(sqlError);
  }
};

export const getCourseGeneralView = async (req: Request, res: Response) => {
  let course_id = req.params.id;
  let sql = `SELECT * FROM smartle.course_general WHERE course_title = "${course_id}"`;
  try {
    const [rows]: any = await promisePool.query(sql);
    res.send(rows).end();
  } catch (sqlError) {
    console.log(sqlError);
  }
};

export const getCourseDetailsHome = async (req: Request, res: Response) => {
  let { course_title, course_age, course_type } = req.body;
  try {
    const [rows]: any = await promisePool.query(
      `SELECT * FROM smartle.course WHERE course_title = ? AND course_age = ? AND course_type = ?`,
      [course_title, course_age, course_type]
    );
    res.send(rows).end();
  } catch (sqlError) {
    console.log(sqlError);
  }
};

export const getModuleforCourse = async (req: Request, res: Response) => {
  let course_id = req.params.id;
  let sql = `SELECT * FROM module JOIN coursemodule ON module.module_id = coursemodule.module_id AND coursemodule.course_id=${course_id}`;
  try {
    const [rows]: any = await promisePool.query(sql);

    res.send(rows).end();
  } catch (sqlError) {
    console.log(sqlError);
  }
};

export const getTopicforModule = async (req: Request, res: Response) => {
  let moduleId = req.params.id;
  let sql = `SELECT * FROM smartle.module_topic  INNER JOIN  topic ON module_topic.topic_id = topic.topic_id WHERE module_id = ${moduleId}`;
  try {
    const [result]: any = await promisePool.query(sql);
    res.send(result).end();
  } catch (sqlError) {
    console.log(sqlError);
  }
};

export const getModuleView = async (req: Request, res: Response) => {
  let moduleId = req.params.id;
  let sql = `SELECT * FROM smartle.module WHERE module_id = ${moduleId}`;
  try {
    const [result]: any = await promisePool.query(sql);
    res.send(result).end();
  } catch (sqlError) {
    console.log(sqlError);
  }
};

export const getEnrolledCourseView = async (req: Request, res: Response) => {
  let { moduleId, studentId } = req.body;
  try {
    const [result]: any = await promisePool.query(
      `SELECT * FROM smartle.enrollment WHERE student_id = ? AND course_id = ?`,
      [studentId, moduleId]
    );
    res.send(result).end();
  } catch (sqlError) {
    console.log(sqlError);
  }
};

export const getRecommendedCourses = async (req: Request, res: Response) => {
  let { learnerAge } = req.body;

  if (learnerAge === 9) {
    learnerAge = 8;
  }

  let sql = `SELECT * FROM smartle.course_general WHERE course_age REGEXP ${learnerAge}`;
  try {
    const [rows]: any = await promisePool.query(sql);
    res.send(rows).end();
  } catch (sqlError) {
    console.log(sqlError);
  }
};

export const getCourseName = async (req: Request, res: Response) => {
  let { courseID } = req.body;
  try {
    const [result]: any = await promisePool.query(
      `SELECT course_name FROM smartle.course WHERE course_id = ?;`,
      [courseID]
    );
    res.send(result).end();
  } catch (sqlError) {
    console.log(sqlError);
  }
};
