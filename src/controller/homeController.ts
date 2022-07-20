import mysql from 'mysql';
import express, {Request, Response} from 'express';
import db from '../config/config';

export const contactUs = ((req: Request, res: Response) => {

    const {name, email, contactno, message, contacting_as} = req.body
    
    db.query(`INSERT INTO smartle.contactus (name, email, contactno, message, contacting_as) VALUES(?,?,?,?,?)`, [name, email, contactno, message, contacting_as], (err: any, result: any) =>{
        if(err){
            console.log(err);
        }
        res.send({result: "success"});
    });
    
});

export const keyEvents = ((req: Request, res: Response) => {

    const {id} = req.params
    
    db.query(`SELECT * FROM smartle.enrollment JOIN session ON enrollment.session_id = session.session_id JOIN course ON enrollment.course_id = course.course_id where student_id = ?`, [parseInt(id)], (err: any, result: any) =>{
        if(err){
            console.log(err);
        }
        res.send(result);
    });
    
});


