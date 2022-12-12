import mysql from 'mysql';
import express, { Request, Response } from 'express';
import db from '../config/config';
import e from 'express';

const promisePool = db.promise();

export const checkVoucher = async (req: Request, res: Response) => {
  //need to add the course if null

  const { code, course_id, parent_id } = req.body;
  console.log(req.body);

  try {
    const [rows]: any = await promisePool.query(
      'SELECT * FROM smartle.voucher  WHERE voucher_code=? AND date(voucher_expirydate) >= curdate()',
      [code]
    );

    const id = '' + rows[0]?.voucher_course_id;

    if (rows.length === 0) {
      res.send({ result: 'Code Invalid or Expired' });
    } else if (rows[0]?.voucher_usagecount >= rows[0]?.voucher_limit) {
      res.send({ result: 'Usage Count Reached!' });
    } else if (
      rows[0]?.voucher_active !== 'ACTIVE' ||
      rows[0]?.voucher_active === ''
    ) {
      res.send({ result: 'Code Invalid or Expired' });
    } else if (rows[0]?.voucher_course_id !== '0') {
      if (id !== course_id) {
        res.send({ result: 'Code Invalid or Expired' });
      } else if (rows[0]?.voucher_pid !== '0') {
        if (rows[0]?.voucher_pid !== parent_id) {
          res.send({ result: 'Code Invalid or Expired' });
        } else if (rows[0]?.voucher_pid !== '0') {
          if (rows[0]?.voucher_pid !== parent_id) {
            res.send({ result: 'Code Invalid or Expired' });
          } else {
            res.send(rows);
          }
        } else {
          res.send({ result: 'Code Invalid or Expired' });
        }
      } else {
        res.send(rows);
      }
    } else if (rows[0]?.voucher_pid !== '0') {
      if (rows[0]?.voucher_pid !== parent_id) {
        res.send({ result: 'Code Invalid or Expired' });
      } else {
        res.send(rows);
      }
    } else {
      res.send(rows);
    }
  } catch (sqlError) {
    console.log(sqlError);
  }
};

export const voucherUsageCount = async (req: Request, res: Response) => {
  let { voucherId } = req.body;
  try {
    const [rows]: any = await promisePool.query(
      'UPDATE smartle.voucher SET voucher_usagecount = voucher_usagecount  + 1 WHERE voucher_id = ?',
      [voucherId]
    );
    res.send({ result: 'Success' });
  } catch (sqlError) {
    console.log(sqlError);
  }
};
