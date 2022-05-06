import mysql from 'mysql';
import express, {Request, Response, urlencoded} from 'express';
import db from '../config/config';

export const getAllCourses =  ((req: Request, res: Response) => {

    let sql = `SELECT * from course`;

    db.query(sql, (err:any, result:any) =>{
        if(err){
            console.log(err);
        }

        const resultsPerPage = 3;
        const numOfResult = result.length;
        const numberOfPages = Math.ceil(numOfResult/resultsPerPage);

        let page = req.query.page ? Number(req.query.page) : 1;

        if(page > numberOfPages){
            res.redirect(`/?page=`+encodeURIComponent(numberOfPages));
        }else if(page < 1){
            res.redirect(`/?page=`+encodeURIComponent('1'));
        }

        const startingLimit = (page - 1) * resultsPerPage;
        sql = `SELECT * from course`;
        
        db.query(sql, (err:any, result:any) =>{
            if(err){
                console.log(err);
            }
            let iterator = (page - 5) < 1 ? 1 : page - 5;
            let endingLink = (iterator + 9) <= numberOfPages ? (iterator + 9) : page + 
            (numberOfPages - page);

            if(endingLink  < (page + 4)){
                iterator -= (page + 4) - numberOfPages;
            }

            res.send({result, page, iterator, numberOfPages});
        })
 
    })

});

export const getAllCoursesOnHome =  ((req: Request, res: Response) => {

    let sql = `SELECT * from course LIMIT ${8}`;

    db.query(sql, (err:any, result:any) =>{
        if(err){
            console.log(err);
        }
        res.send(result);   
    })
});

export const getCourseView =  ((req: Request, res: Response) => {
    let course_id = req.params.id;
    let sql = `SELECT * FROM course WHERE course_id = ${course_id}`;
    db.query(sql, (err: any, rows: any) =>{
        if(err){
            console.log(err);
        }
        res.send(rows);
    });
});

export const getModuleforCourse =  ((req: Request, res: Response) => {
    let course_id = req.params.id;
    let sql = `SELECT * FROM module JOIN coursemodule ON module.module_id = coursemodule.module_id AND coursemodule.course_id=${course_id}`;
    db.query(sql, (err: any, rows: any) =>{
        if(err){
            console.log(err);
        }

        res.send(rows);
    });
});

export const getTopicforModule =  ((req: Request, res: Response) => {
    let moduleId = req.params.id;
    let sql = `SELECT * FROM smartle.module_topic  INNER JOIN  topic ON module_topic.topic_id = topic.topic_id WHERE module_id = ${moduleId}`;
    db.query(sql, (err: any, result: any) =>{
        if(err){
            console.log(err);
        }
        res.send(result);
    });
}); 

export const getModuleView =  ((req: Request, res: Response) => {
    let moduleId = req.params.id;
    let sql = `SELECT * FROM smartle.module WHERE module_id = ${moduleId}`;
    db.query(sql, (err: any, result: any) =>{
        if(err){
            console.log(err);
        }
        res.send(result);
    });
}); 

export const getEnrolledCourseView =  ((req: Request, res: Response) => {
    let {moduleId, studentId} = req.body;
    db.query(`SELECT * FROM smartle.enrollment WHERE student_id = ? AND course_id = ?`, [studentId, moduleId], (err: any, result: any) =>{
        if(err){
            console.log(err);
        }
        res.send(result);
    });
}); 

export const getRecommendedCourses =  ((req: Request, res: Response) => {
    let {learnerAge} = req.body;

    if(learnerAge === 9){
        learnerAge = 8
    }

    let sql = `SELECT * FROM smartle.course WHERE course_age REGEXP ${learnerAge}`;
    db.query(sql, (err: any, rows: any) =>{
        if(err){
            console.log(err);
        }
        res.send(rows);
    });
});
