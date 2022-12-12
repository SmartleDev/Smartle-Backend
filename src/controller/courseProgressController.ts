import mysql from 'mysql';
import express, {Request, Response} from 'express';
import db from '../config/config';

export const getProgressCourseModule = ((req: Request, res: Response) => {
    console.log(req)
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

                    db.query(`INSERT INTO course_progress (course_topic, course_module, enrollment_id, course_total_modules, course_modules_completed,course_topics_completed) VALUES(?,?,?,?,?,?)`, [topicId, moduleId, enrollmentId, courseModuleLength, 0, '[]'], (err: any, result: any) =>{
                        if(err){
                            console.log(err);
                        }
                        res.send({result: "success"});
                    });
                
                });
            }
    });

});

export const updateTopicsCompleted = ((req: Request, res: Response) => {
    const {courseTopic,enrollmentId} = req.body
    db.query('SELECT course_topics_completed FROM course_progress WHERE enrollment_id = ?',[enrollmentId], (err: any, result: any) =>{
        if(err){
            console.log(err);
        }
        const val = result?.map((dataItem:any) => dataItem?.course_topics_completed)
        //val[0].push(courseTopic);

        db.query(`UPDATE smartle.course_progress SET course_topics_completed = '[${val[0]}]' WHERE enrollment_id = ${enrollmentId}`, (err: any, result: any) =>{
            if(err){
                console.log(err);
            }
            res.send({result : "success"});
        });
    });

});
export const getAllTopicsCompleted = ((req: Request, res: Response) => {
    const {id} = req.params
    db.query('SELECT course_topics_completed FROM smartle.course_progress WHERE enrollment_id = ?',[id], (err: any, result: any) =>{
        if(err){
            console.log(err);
        }
        const val = result?.map((dataItem:any) => dataItem?.course_topics_completed)
        res.send(val[0]);
    });

});

export const courseProgressTopic = ((req: Request, res: Response) => {
    const {id} = req.body
    let topics;
    let progress;
    db.query('SELECT * FROM smartle.course_progress WHERE enrollment_id = ?',[id], (err: any, result: any) =>{
        if(err){
            console.log(err);
        }
        const val = result?.map((dataItem:any) => dataItem?.course_topics_completed)
        topics = val[0].length;
        console.log(topics)
        progress = Math.ceil((0.2/topics)*100)
        console.log(progress)

        db.query(`UPDATE smartle.enrollment SET course_progress = ${progress} WHERE enrollment_id = ?`,[progress,id], (err: any, result: any) =>{
            if(err){
                console.log(err);
            }
        });
        res.send({result : "Success"})
    });

});

export const courseModulesRemaining  = ((req: Request, res: Response) => {
    const {courseId, enrollmentId} = req.body
    let totalModules: any[] = [];
    let completedModules: any[];
    let activeModules: any[] = []
    db.query('SELECT module_id FROM smartle.coursemodule WHERE course_id = ?;',[courseId], (err: any, rows: any) =>{
        if(err){
            console.log(err);
        }
        totalModules =	rows?.map((dataItem : any)=> dataItem?.module_id)
        db.query('SELECT course_modules_completed FROM smartle.course_progress WHERE enrollment_id = ?;',[enrollmentId], (err: any, rows1: any) =>{
            if(err){
                console.log(err);
            }
            completedModules =	rows1[0]?.course_modules_completed;
            activeModules = totalModules?.filter(val => !completedModules.includes(val))
                    db.query(`SELECT * FROM module JOIN coursemodule ON module.module_id = coursemodule.module_id AND coursemodule.course_id=?`, [courseId], (err: any, rows2: any) =>{
                         if(err){
                        console.log(err);
                            }

                         let finalArray = activeModules.map((dataID) => {
                             let individualVal = rows2.filter((dataItem: any) => dataItem.module_id === dataID)
                             return individualVal[0]
                            })

                         res.send(finalArray);
                     })
          
             });
    });
});

export const courseModulesDone = ((req: Request, res: Response) => {
    const {courseId, enrollmentId} = req.body
    let completedModules: any[]
    db.query('SELECT course_modules_completed FROM smartle.course_progress WHERE enrollment_id = ?;',[enrollmentId], (err: any, rows: any) =>{
        if(err){
            console.log(err);
        }
        completedModules =	rows[0]?.course_modules_completed;
        db.query(`SELECT * FROM module JOIN coursemodule ON module.module_id = coursemodule.module_id AND coursemodule.course_id=?`, [courseId], (err: any, rows2: any) =>{
            if(err){
           console.log(err);
               }

            let finalArray = completedModules.map((dataID) => {
                let individualVal = rows2.filter((dataItem: any) => dataItem.module_id === dataID)
                return individualVal[0]
               })

            res.send(finalArray);
        })
    });

});

export const updateModuleCompeletedArray = ((req: Request, res: Response) => {
    const {moduleIDCompleted,enrollmentId} = req.body
    db.query('SELECT course_modules_completed FROM course_progress WHERE enrollment_id = ?',[enrollmentId], (err: any, result: any) =>{
        if(err){
            console.log(err);
        }
        const val = result?.map((dataItem:any) => dataItem?.course_modules_completed)
        val[0].push(moduleIDCompleted);

        db.query(`UPDATE smartle.course_progress SET course_modules_completed = '[${val[0]}]' WHERE enrollment_id = ${enrollmentId}`, (err: any, result: any) =>{
            if(err){
                console.log(err);
            }
            res.send({result : "success"});
        });

    });

});


