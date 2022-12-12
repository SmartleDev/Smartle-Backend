import mysql from 'mysql';
import express, { Request, Response, urlencoded } from 'express';
import db from '../config/config';

const promisePool = db.promise();

export const getModuleforCourse = async (req: Request, res: Response) => {
  let course_id = req.params.id;
  let sql = `SELECT * FROM module JOIN coursemodule ON module.module_id = coursemodule.module_id AND coursemodule.course_id=${course_id}`;
  try {
    const [rows]: any = await promisePool.query(sql);
    res.send(rows);
  } catch (sqlError) {
    console.log(sqlError);
  }
};
