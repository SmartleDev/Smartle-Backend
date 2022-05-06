import mysql from 'mysql';
import express, {Request, Response} from 'express';
import db from '../config/config';

export const getProgressCourseModule = ((req: Request, res: Response) => {
		const courseId = req.params.id
        db.query('SELECT module_id FROM smartle.coursemodule WHERE course_id = ?;',[courseId], (err: any, rows: any) =>{
            if(err){
                console.log(err);
            }
		const val =	rows?.map((dataItem : any)=> dataItem?.module_id)
            res.send(val);
        });
    
});

export const getProgressModuleTopic = ((req: Request, res: Response) => {
		const moduleId = req.params.id
        db.query('SELECT topic_id FROM smartle.module_topic WHERE module_id = ?;',[moduleId], (err: any, rows: any) =>{
            if(err){
                console.log(err);
            }
		const val =	rows?.map((dataItem : any)=> dataItem?.topic_id)
            res.send(val);
        });
    
});

export const getTrackedCourse = ((req: Request, res: Response) => {
		const enrollmentId = req.params.id
        db.query('SELECT * FROM smartle.course_progress WHERE enrollment_id = ?;',[enrollmentId], (err: any, result: any) =>{
            if(err){
                console.log(err);
            }
            res.send(result);
        });
    
});

export const updateTopicStatus = ((req: Request, res: Response) => {
		const {courseTopic,enrollmentId} = req.body
        db.query('UPDATE smartle.course_progress SET course_topic = ? WHERE enrollment_id = ?',[courseTopic, enrollmentId], (err: any, result: any) =>{
            if(err){
                console.log(err);
            }
            res.send({result : "success"});
        });
    

});

export const updateModuleStatus = ((req: Request, res: Response) => {
		const {courseModule,enrollmentId} = req.body
        db.query('UPDATE smartle.course_progress SET course_module = ? WHERE enrollment_id = ?',[courseModule, enrollmentId], (err: any, result: any) =>{
            if(err){
                console.log(err);
            }
            res.send({result : "success"});
        });
    
});


export const updateModuleCompeletedStatus = ((req: Request, res: Response) => {
		const {enrollmentId} = req.body

        db.query('SELECT * FROM smartle.course_progress WHERE course_modules_completed < course_total_modules AND enrollment_id = ?',[enrollmentId], (err: any, result: any) =>{
            if(err){
                console.log(err);
            }
            if(result.length === 0){
                res.send({message : 'User Course Successfully Compeleted', status : 'error'})
            }else{
                db.query('UPDATE smartle.course_progress SET course_modules_completed = course_modules_completed + 1 WHERE enrollment_id = ?',[enrollmentId], (err: any, row: any) =>{
                    if(err){
                        console.log(err);
                    }
                    db.query('SELECT * FROM smartle.course_progress WHERE enrollment_id = ?',[enrollmentId], (err: any, rowNumMain: any) =>{
                        if(err){
                            console.log(err);
                        }
                        const course_modules_completed = rowNumMain[0]?.course_modules_completed
                        const course_total_modules = rowNumMain[0]?.course_total_modules
                        const progress_done = (course_modules_completed/course_total_modules)*100

                         db.query('UPDATE smartle.enrollment SET course_progress = ? WHERE enrollment_id = ?',[progress_done, enrollmentId], (err: any, rowNum: any) =>{
                             if(err){
                                 console.log(err);
                             }
                             // res.send({result : "success"});
                         });
                    });
                    res.send({result : "success"});
                });
                
            }
            
        });
});

export const enrolledUserProgressDefault = ((req: Request, res: Response) => {
    const {enrollmentId, courseId} = req.body
    let moduleId : any = null;
    let topicId = null;
    let courseModuleLength : any = null;
    db.query('SELECT module_id FROM smartle.coursemodule WHERE course_id = ?;',[courseId], (err: any, rows: any) =>{
        if(err){
            console.log(err);
        }
        const valModule = rows?.map((dataItem : any)=> dataItem?.module_id)
        moduleId = valModule[0];
        courseModuleLength = valModule?.length


            if(moduleId !== null){
                db.query('SELECT topic_id FROM smartle.module_topic WHERE module_id = ?;',[moduleId], (err: any, rows: any) =>{
                    if(err){
                        console.log(err);
                    }  
                    const valTopic = rows?.map((dataItem : any)=> dataItem?.topic_id) 
                    topicId = valTopic[0]
                    console.log(topicId)

                    db.query(`INSERT INTO course_progress (course_topic, course_module, enrollment_id, course_total_modules, course_modules_completed) VALUES(?,?,?,?,?)`, [topicId, moduleId, enrollmentId, courseModuleLength, 0], (err: any, result: any) =>{
                        if(err){
                            console.log(err);
                        }
                        res.send({result: "success"});
                    });
                
                });
            }
    });

});




