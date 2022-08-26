import mysql from 'mysql';
import express, {Request, Response} from 'express';
import db from '../config/config';

export const getHomeEnterpriseCourses = ((req: Request, res: Response) => {
    
        db.query('SELECT * from enterprise_courses WHERE enterprise = "True"', (err: any, rows: any) =>{
            if(err){
                console.log(err);
            }
            res.send(rows);
        });
    
});


