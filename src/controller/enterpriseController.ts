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
