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
  const {courseName} = req.params;
  try {
    const [rows]: any = await promisePool.query(
      `SELECT * from enterprise_courses WHERE enterprise = "True" AND enterprise_courses.slug = '${courseName}'`
    );
    res.send(rows);
  } catch (sqlError) {
    console.log(sqlError);
  }
};
