import mysql from 'mysql';
import express, {Request, Response} from 'express';
import db from '../config/config';

export const getAllParents = ((req: Request, res: Response) => {
    // db.getConnection(function (err: any, conn: any){
    //     if(err){
    //         console.log(err)
    //     }
    
        db.query('SELECT * from parent', (err: any, rows: any) =>{
            if(err){
                console.log(err);
            }
            res.send(rows);
        });
    
    //     conn.release();
    
    // })   
});

