import express, {Request, Response} from 'express';
import db from '../config/config';
import aws from 'aws-sdk'
import dotenv from 'dotenv'

dotenv.config()

const ses = new aws.SES({
    apiVersion: "2022-05-09",
    accessKeyId : process.env.ACCESSKEY,
    secretAccessKey : process.env.SECRETKEY,
    region : process.env.REGION
})


const emailService = (emailTo : any, body : any, subject : any) => {

    const params : any = {
        Destination : {
            ToAddresses : [emailTo]
        },

        Message : {
            Body : {
                // Text : {
                //     Data : "Trial Run for the SES" + body
                // },
                Html : {
                    Data : body
                }
            },
            Subject : {
                Data : `${subject}`
            }
        },
        Source : "adeeb.shah@smartle.co"
    };

   return ses.sendEmail(params).promise();
}


export const accountCreationEmailService  = ((req: Request, res: Response) => {

    const {emailTo} = req.body

    const subject = `Account Creation:`

    const body = `
    <h1 style = 'color : blue'>Welcome To Smartle!!!</h1>

   <h3> Your account has been successfully created at Smartle.co!
    Let's add learners by using the link below .
    </h3>
    <i>www.dev.smartle.co/learner</i>

    <h4>You can contact us at: <i>talk2us@smartle.co</i> or reply to this email.</h4>
    
    <h2>Happy Learning!!</h2>
    `


    emailService(emailTo, body, subject).then((val) => {
        console.log(val)
        res.send("Email Sent Sucessfully")
    }).catch((err: any) => {
        res.send("Error" + err)
    })
    
});


export const addLearnerEmailService  = ((req: Request, res: Response) => {

    const {emailTo, parentId} = req.body

    let studenDetails : any;

    let body : any;

    const subject = `Learner Added`


    try {
		
		db.query(`SELECT * FROM student WHERE parent_id = ?`, [parentId],
		(err, result:any) => {
		   if(err){
			   console.log(err);
			   res.send({message : "error"})
		   }else{
            studenDetails =  {student : result[result?.length - 1], number_of_students : result.length}

           body = 
           ` <h1 style = 'color : green'>Congratulations!</h1>
        
             <h3>You have successfully added your ${studenDetails?.number_of_students} learner
             <br> 
             Name :  ${studenDetails?.student?.student_name} <br>
             Gender : ${studenDetails?.student?.student_gender} <br>
             Age : ${studenDetails?.student?.student_age}.
             <br>
            You can explore different courses to begin your learning journey with us using the link below:</h3>
            <i>www.dev.smartle.co/courses</i>
            <h4>In case of any query, you can contact us at: <i>talk2us@smartle.co</i> or reply to this email.</h3>`

		   }

           emailService(emailTo, body, subject).then((val) => {
            console.log(val)
            res.send("Email Sent Sucessfully")
        }).catch((err: any) => {
            res.send("Error" + err)
        })
        
	   })
  
	  } catch (error) {
		  res.status(404).json( {message : 'Error'} )
	  }
});


export const enrollCourseEmailService  = ((req: Request, res: Response) => {

    const {emailTo, studentName, courseId} = req.body

    let courseDetails : any;

    let body : any;

    const subject = `Course Enrollment`


    try {
		
		db.query(`SELECT * FROM course WHERE course_id = ?`, [courseId],
		(err, result:any) => {
		   if(err){
			   console.log(err);
			   res.send({message : "error"})
		   }else{
            courseDetails =  result;
           body = 
           `<h1><span style = 'color : green'>Congratulations</span> ${studentName}, </h1> 
            <h3>You have successfully enrolled into the course ${courseDetails[0]?.course_name}</h3>.
          <h4> To begin your  journey, click on the link below:
           <i>www.dev.smartle.co/course/${courseId}</i>
           <br />
            All the best! </h4>
           
          <h4> In case of any query, you can contact us at: <i>talk2us@smartle.co</i> or reply to this email.</h4.`

		   }

           emailService(emailTo, body, subject).then((val) => {
            console.log(val)
            res.send("Email Sent Sucessfully")
        }).catch((err: any) => {
            res.send("Error" + err)
        })
        
	   })
  
	  } catch (error) {
		  res.status(404).json( {message : 'Error'} )
	  }
});

export const enrollTrialCourseEmailService  = ((req: Request, res: Response) => {

    const {emailTo, studentName, courseId} = req.body

    let courseDetails : any;

    let body : any;

    const subject = `Trial Course Enrollment`


    try {
		
		db.query(`SELECT * FROM course WHERE course_id = ?`, [courseId],
		(err, result:any) => {
		   if(err){
			   console.log(err);
			   res.send({message : "error"})
		   }else{
            courseDetails =  result;
           body = 
           `<h1><span style = 'color : green'>Congratulations</span> ${studentName}, </h1> 
            <h3>You have successfully enrolled into the Trial course ${courseDetails[0]?.course_name}</h3>.
          <h4> To begin your  journey, click on the link below:
          <i>www.dev.smartle.co/course/${courseId}</i>
           <br />
            All the best! </h4>
            <h3>If You like the Course Pleaes do Buy the Course From link below</h3>
            <i>www.dev.smartle.co/bookcourse/${courseId}</i>
           
          <h4> In case of any query, you can contact us at: <i>talk2us@smartle.co</i> or reply to this email.</h4.`

		   }

           emailService(emailTo, body, subject).then((val) => {
            console.log(val)
            res.send("Email Sent Sucessfully")
        }).catch((err: any) => {
            res.send("Error" + err)
        })
        
	   })
  
	  } catch (error) {
		  res.status(404).json( {message : 'Error'} )
	  }
});



