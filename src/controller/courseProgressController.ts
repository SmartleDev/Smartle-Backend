import mysql from 'mysql';
import express, { Request, Response } from 'express';
import db from '../config/config';
const promisePool = db.promise();

export const getProgressCourseModule = async (req: Request, res: Response) => {
  const courseId = req.params.id;
  try {
    const [rows]: any = await promisePool.query(
      'SELECT module_id FROM smartle.coursemodule WHERE course_id = ?',
      [courseId]
    );
    const val = rows?.map((dataItem: any) => dataItem?.module_id);
    res.send(val);
  } catch (sqlError) {
    console.log(sqlError);
  }
};

export const getProgressModuleTopic = (req: Request, res: Response) => {
  const moduleId = req.params.id;
  db.query(
    'SELECT topic_id FROM smartle.module_topic WHERE module_id = ?;',
    [moduleId],
    (err: any, rows: any) => {
      if (err) {
        console.log(err);
      }
      const val = rows?.map((dataItem: any) => dataItem?.topic_id);
      res.send(val);
    }
  );
};

export const getTrackedCourse = (req: Request, res: Response) => {
  const enrollmentId = req.params.id;
  db.query(
    'SELECT * FROM smartle.course_progress WHERE enrollment_id = ?;',
    [enrollmentId],
    (err: any, result: any) => {
      if (err) {
        console.log(err);
      }
      res.send(result);
    }
  );
};

export const updateTopicStatus = (req: Request, res: Response) => {
  const { courseTopic, enrollmentId } = req.body;
  db.query(
    'UPDATE smartle.course_progress SET course_topic = ? WHERE enrollment_id = ?',
    [courseTopic, enrollmentId],
    (err: any, result: any) => {
      if (err) {
        console.log(err);
      }
      res.send({ result: 'success' });
    }
  );
};

export const updateModuleStatus = (req: Request, res: Response) => {
  const { courseModule, enrollmentId } = req.body;
  db.query(
    'UPDATE smartle.course_progress SET course_module = ? WHERE enrollment_id = ?',
    [courseModule, enrollmentId],
    (err: any, result: any) => {
      if (err) {
        console.log(err);
      }
      res.send({ result: 'success' });
    }
  );
};

export const updateModuleCompeletedStatus = (req: Request, res: Response) => {
  const { enrollmentId } = req.body;

  db.query(
    'SELECT * FROM smartle.course_progress WHERE course_modules_completed < course_total_modules AND enrollment_id = ?',
    [enrollmentId],
    (err: any, result: any) => {
      if (err) {
        console.log(err);
      }
      if (result.length === 0) {
        res.send({
          message: 'User Course Successfully Compeleted',
          status: 'error',
        });
      } else {
        db.query(
          'UPDATE smartle.course_progress SET course_modules_completed = course_modules_completed + 1 WHERE enrollment_id = ?',
          [enrollmentId],
          (err: any, row: any) => {
            if (err) {
              console.log(err);
            }
            db.query(
              'SELECT * FROM smartle.course_progress WHERE enrollment_id = ?',
              [enrollmentId],
              (err: any, rowNumMain: any) => {
                if (err) {
                  console.log(err);
                }
                const course_modules_completed =
                  rowNumMain[0]?.course_modules_completed;
                const course_total_modules =
                  rowNumMain[0]?.course_total_modules;
                const progress_done =
                  (course_modules_completed / course_total_modules) * 100;

                db.query(
                  'UPDATE smartle.enrollment SET course_progress = ? WHERE enrollment_id = ?',
                  [progress_done, enrollmentId],
                  (err: any, rowNum: any) => {
                    if (err) {
                      console.log(err);
                    }
                    // res.send({result : "success"});
                  }
                );
              }
            );
            res.send({ result: 'success' });
          }
        );
      }
    }
  );
};

export const enrolledUserProgressDefault = async (
  req: Request,
  res: Response
) => {
  const { enrollmentId, courseId } = req.body;
  let moduleId: any = null;
  let topicId = null;
  let courseModuleLength: any = null;
  try {
    const [rows]: any = await promisePool.query(
      'SELECT module_id FROM smartle.coursemodule WHERE course_id = ?',
      [courseId]
    );
    const valModule = rows?.map((dataItem: any) => dataItem?.module_id);
    moduleId = valModule[0];
    courseModuleLength = valModule?.length;
  } catch (sqlError) {
    console.log(sqlError);
  }
  if (moduleId !== null) {
    try {
      const [rows_module]: any = await promisePool.query(
        'SELECT topic_id FROM smartle.module_topic WHERE module_id = ?;',
        [moduleId]
      );
      const valTopic = rows_module?.map((dataItem: any) => dataItem?.topic_id);
      topicId = valTopic[0];
    } catch (sqlError) {
      console.log(sqlError);
    }

    try {
      const [rows]: any = await promisePool.query(
        `INSERT INTO course_progress (course_topic, course_module, enrollment_id, course_total_modules, course_modules_completed_total,course_topics_completed, course_modules_completed) VALUES(?,?,?,?,?,?,?)`,
        [
          topicId,
          moduleId,
          enrollmentId,
          courseModuleLength,
          0,
          '[]',
          `[${moduleId}]`,
        ]
      );
      res.send({ result: 'success' });
    } catch (sqlError) {
      console.log(sqlError);
    }
  }
};

export const updateTopicsCompleted = (req: Request, res: Response) => {
  const { courseTopic, enrollmentId } = req.body;
  db.query(
    'SELECT course_topics_completed FROM course_progress WHERE enrollment_id = ?',
    [enrollmentId],
    (err: any, result: any) => {
      if (err) {
        console.log(err);
      }
      const val = result?.map(
        (dataItem: any) => dataItem?.course_topics_completed
      );
      //val[0].push(courseTopic);

      db.query(
        `UPDATE smartle.course_progress SET course_topics_completed = '[${val[0]}]' WHERE enrollment_id = ${enrollmentId}`,
        (err: any, result: any) => {
          if (err) {
            console.log(err);
          }
          res.send({ result: 'success' });
        }
      );
    }
  );
};
export const getAllTopicsCompleted = (req: Request, res: Response) => {
  const { id } = req.params;
  db.query(
    'SELECT course_topics_completed FROM smartle.course_progress WHERE enrollment_id = ?',
    [id],
    (err: any, result: any) => {
      if (err) {
        console.log(err);
      }
      const val = result?.map(
        (dataItem: any) => dataItem?.course_topics_completed
      );
      res.send(val[0]);
    }
  );
};

export const courseProgressTopic = (req: Request, res: Response) => {
  const { id } = req.body;
  let topics;
  let progress;
  db.query(
    'SELECT * FROM smartle.course_progress WHERE enrollment_id = ?',
    [id],
    (err: any, result: any) => {
      if (err) {
        console.log(err);
      }
      const val = result?.map(
        (dataItem: any) => dataItem?.course_topics_completed
      );
      topics = val[0].length;
      progress = Math.ceil((0.2 / topics) * 100);

      db.query(
        `UPDATE smartle.enrollment SET course_progress = ${progress} WHERE enrollment_id = ?`,
        [progress, id],
        (err: any, result: any) => {
          if (err) {
            console.log(err);
          }
        }
      );
      res.send({ result: 'Success' });
    }
  );
};

export const courseModulesRemaining = async (req: Request, res: Response) => {
  const { courseId, enrollmentId } = req.body;
  let totalModules: any[] = [];
  let completedModules: any[];
  let activeModules: any[] = [];
  try {
    const [rows]: any = await promisePool.query(
      'SELECT module_id FROM smartle.coursemodule WHERE course_id = ?',
      [courseId]
    );
    const val = rows?.map((dataItem: any) => dataItem?.module_id);
    totalModules = rows.map((dataItem: any) => dataItem?.module_id);
  } catch (sqlError) {
    console.log(sqlError);
  }
  try {
    const [rows1]: any = await promisePool.query(
      'SELECT course_modules_completed FROM smartle.course_progress WHERE enrollment_id = ?;',
      [enrollmentId]
    );
    completedModules = rows1[0].course_modules_completed;
    activeModules = totalModules.filter(
      (val) => !completedModules.includes(val)
    );
  } catch (sqlError) {
    console.log(sqlError);
  }
  try {
    const [rows2]: any = await promisePool.query(
      `SELECT * FROM module JOIN coursemodule ON module.module_id = coursemodule.module_id AND coursemodule.course_id=?`,
      [courseId]
    );
    let finalArray = activeModules.map((dataID) => {
      let individualVal = rows2.filter(
        (dataItem: any) => dataItem.module_id === dataID
      );
      return individualVal[0];
    });

    res.send(finalArray);
  } catch (sqlError) {
    console.log(sqlError);
  }
};

export const courseModulesDone = async (req: Request, res: Response) => {
  const { courseId, enrollmentId } = req.body;
  let completedModules: any[];
  try {
    const [rows]: any = await promisePool.query(
      'SELECT course_modules_completed FROM smartle.course_progress WHERE enrollment_id = ?;',
      [enrollmentId]
    );
    completedModules = rows[0]?.course_modules_completed;

    try {
      const [rows2]: any = await promisePool.query(
        `SELECT * FROM module JOIN coursemodule ON module.module_id = coursemodule.module_id AND coursemodule.course_id=?`,
        [courseId]
      );
      let finalArray = completedModules.map((dataID) => {
        let individualVal = rows2.filter(
          (dataItem: any) => dataItem.module_id === dataID
        );
        return individualVal[0];
      });

      res.send(finalArray);
    } catch (sqlError) {
      console.log(sqlError);
    }
  } catch (sqlError) {
    console.log(sqlError);
  }
};

export const updateModuleCompeletedArray = async (
  req: Request,
  res: Response
) => {
  const { moduleIDCompleted, enrollmentId } = req.body;
  let val: [any];
  try {
    const [result]: any = await promisePool.query(
      'SELECT course_modules_completed FROM course_progress WHERE enrollment_id = ?',
      [enrollmentId]
    );
    val = result?.map((dataItem: any) => dataItem?.course_modules_completed);
    let duplicate = result?.filter((data: any) => data === val[0]);
    if (duplicate.length !== 0) {
      val[0].push(moduleIDCompleted);
      try {
        const [updated]: any = await promisePool.query(
          `UPDATE smartle.course_progress SET course_modules_completed = '[${val[0]}]' WHERE enrollment_id = ${enrollmentId}`
        );
        res.send({ result: 'success' });
      } catch (sqlError) {
        console.log(sqlError);
      }
    } else {
      res.send({ result: 'Module already compeleted' });
    }
  } catch (sqlError) {
    console.log(sqlError);
  }
};

export const getDoneModulesID = async (req: Request, res: Response) => {
  const { enrollmentId } = req.body;
  try {
    const [rows]: any = await promisePool.query(
      'SELECT course_modules_completed FROM smartle.course_progress WHERE enrollment_id = ?',
      [enrollmentId]
    );
    let result = rows[0].course_modules_completed;
    res.send(result);
  } catch (sqlError) {
    console.log(sqlError);
  }
};

export const getModuleTopicIdList = async (req: Request, res: Response) => {
  const { moduleId } = req.body;
  try {
    const [rows]: any = await promisePool.query(
      'SELECT * FROM smartle.module_topic INNER JOIN topic ON module_topic.topic_id = topic.topic_id WHERE module_id = ?;',
      [moduleId]
    );
    let result = rows.map((dataItem: any, index: number) => dataItem.topic_id);
    res.json(result);
  } catch (sqlError) {
    console.log(sqlError);
  }
};
