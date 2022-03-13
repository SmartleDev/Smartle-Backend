import mysql from 'mysql';
import express, {Request, Response} from 'express';
import db from '../config/config';

export const getAllStudents = ((req: Request, res: Response) => {
    // db.getConnection(function (err: any, conn: any){
    //     if(err){
    //         console.log(err)
    //     }
    
        db.query('SELECT * from student', (err: any, rows: any) =>{
            if(err){
                console.log(err);
            }
            res.send(rows);
        });
    
    //     conn.release();
    
    // })   
});


