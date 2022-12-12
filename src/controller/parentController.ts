import mysql from 'mysql';
import express, { Request, Response } from 'express';
import db from '../config/config';

const promisePool = db.promise();

export const getAllParents = async (req: Request, res: Response) => {
  // db.getConnection(function (err: any, conn: any){
  //     if(err){
  //         console.log(err)
  //     }

  try {
    const [rows]: any = await promisePool.query('SELECT * from parent');
    res.send(rows);
  } catch (sqlError) {
    console.log(sqlError);
  }

  //     conn.release();

  // })
};

export const setParentInfo = async (req: Request, res: Response) => {
  const { parent_id } = req.body;
  try {
    const [rows]: any = await promisePool.query(
      `SELECT * FROM smartle.parent WHERE parent_id = "${parent_id}"`
    );
    res.send(rows);
  } catch (sqlError) {
    console.log(sqlError);
  }
};

export const updateParent = async (req: Request, res: Response) => {
  const { phone, parent_id } = req.body;

  try {
    const [rows]: any = await promisePool.query(
      `UPDATE smartle.parent SET parent_contactno = ? WHERE parent_id = '${parent_id}'`,
      [phone]
    );
    res.send({ result: 'Success' });
  } catch (sqlError) {
    console.log(sqlError);
  }
};
