import mysql from 'mysql';
import express, {Request, Response, urlencoded} from 'express';
import db from '../config/config';

export const getModuleforCourse =  ((req: Request, res: Response) => {
    let course_id = req.params.id;
    let sql = `SELECT * FROM module JOIN coursemodule ON module.module_id = coursemodule.module_id AND coursemodule.course_id=${course_id}`;
    db.query(sql, (err: any, result: any) =>{
        if(err){
            console.log(err);
        }
        res.send(result);
    });
}); 