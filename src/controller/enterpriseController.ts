import mysql from 'mysql';
import express, { Request, Response } from 'express';
import db from '../config/config';

const promisePool = db.promise();

export const getHomeEnterpriseCourses = async (req: Request, res: Response) => {
  try {
    const [rows]: any = await promisePool.query(
      'SELECT * from enterprise_courses WHERE enterprise = "True"'
    );
    res.send(rows);
  } catch (sqlError) {
    console.log(sqlError);
  }
};

export const getEnterpriseCourse = async (req: Request, res: Response) => {
  const { courseName } = req.params;
  try {
    const [rows]: any = await promisePool.query(
      `SELECT * from enterprise_courses WHERE enterprise = "True" AND enterprise_courses.slug = '${courseName}'`
    );
    res.send(rows);
  } catch (sqlError) {
    console.log(sqlError);
  }
};
export const getGrads = async (req: Request, res: Response) => {
  const { courseName } = req.params;
  try {
    const [rows]: any = await promisePool.query(
      `SELECT grade from enterprise_courses WHERE enterprise_courses.slug = '${courseName}'`
    );
    let val = rows.map((item: any) => item.grade)
    res.send(val);
  } catch (sqlError) {
    console.log(sqlError);
  }
};
export const getGradeInfo = async (req: Request, res: Response) => {
  const { courseName, grade } = req.body;
  try {
    const [rows]: any = await promisePool.query(
      `SELECT timeline FROM smartle.enterprise_courses WHERE enterprise_courses.slug = ? AND enterprise_courses.grade = ?`,
      [courseName, grade]
    );
    res.send(rows[0].timeline);
  } catch (sqlError) {
    console.log(sqlError);
  }
};
