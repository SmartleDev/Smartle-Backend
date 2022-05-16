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

export const setParentInfo = ((req: Request, res: Response) => {
    
    const {parent_id} = req.body;
    db.query(`SELECT * FROM smartle.parent WHERE parent_id = "${parent_id}"`,(err: any, rows: any) =>{
        if(err){
            console.log(err);
        }
        res.send(rows);
    });
});



export const updateParent = ((req: Request, res: Response) => {
    
    const {phone, parent_id} = req.body

    db.query(`UPDATE smartle.parent SET parent_contactno = ? WHERE parent_id = '${parent_id}'`,[phone],(err: any, rows: any) =>{
        if(err){
            console.log(err);
        }
        res.send({result : "Success"});
    });
     
});

