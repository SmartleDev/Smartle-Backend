import mysql from 'mysql';
import express, { Request, Response } from 'express';
import db from '../config/config';
const promisePool = db.promise();

export const keyEvents = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const [rows]: any = await promisePool.query(
      `SELECT * FROM smartle.enrollment JOIN session ON enrollment.session_id = session.session_id JOIN course ON enrollment.course_id = course.course_id where student_id = ?`,
      [parseInt(id)]
    );
    res.send(rows);
  } catch (sqlError) {
    console.log(sqlError);
  }
};
