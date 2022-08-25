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
        Source : "notifications@smartle.co"
    };

   return ses.sendEmail(params).promise();
}



export const accountCreationEmailService  = ((req: Request, res: Response) => {

    const {emailTo, parentname} = req.body;
    console.log(parentname);

    const subject = `We are glad you are here, ${parentname.split(' ').slice(0,1).join(' ')}`

    const body = `
    
    <div style="width:80%; margin:auto">
        <div style="text-align:center; border-bottom-left-radius:40px;
        border-bottom-right-radius:40px;background: linear-gradient(245.75deg, #FFEBF8 -2.86%, #EAE1FF 103.21%)">
            <div ><img src="https://smartle-video-content.s3.amazonaws.com/smartle-logo/smartlelogo1.png" width="150px" style="text-align:center;margin:auto; justify-content:'center"/></div>
            <div> 
                <p style="font-size:16px; font-weight:500; margin-top:-20px">We are glad you are here, ${parentname.split(' ').slice(0,1).join(' ')}</p>
                <p style="color:#917EBD; font-size:16px; font-weight:900; padding:20px;margin-top:-20px">Welcome To Smartle</p>
            </div>
        </div>
        <div style="width:90%; margin:auto">
        <p style="margin-top:10px; font-size:14px">Congratulations on completing the first step towards a brighter future for your child.</p>
        <p style="margin-top:10px; font-size:14px">We take pride in being one of few learning solutions that focuses on building critical life skills among young learners.</p>
        <p style="margin-top:10px; font-size:14px">Get started by adding your Childs profile and let us curate an exciting learning experience that is engaging and one that improves your child’s skills and knowledge for the 21st century.</p>
        <div style="margin-top:20px; text-align:center"><button style="text-align:center;margin:auto;padding:2px 30px 2px 30px;color:white;background: #917EBD;box-shadow:0px 8px 20px rgba(0, 0, 0, 0.1);border-radius: 15px"><a href='www.dev.smartle.co' target="_blank" style="color:white; font-size: 16px;font-weight:800; text-decoration:none">Get Started</a></button></div>
        </div>
    </div>
    `


    emailService(emailTo, body, subject).then((val) => {
        //console.log(val)
        res.send("Email Sent Sucessfully")
    }).catch((err: any) => {
        res.send("Error" + err)
    })
    
});

export const addLearnerEmailService  = ((req: Request, res: Response) => {

    const {emailTo, parentId} = req.body

    let studenDetails : any;

    let body : any;

    const subject = `Smartle cares about your child’s privacy`;


    try {
		
		db.query(`SELECT * FROM student WHERE parent_id = ?`, [parentId],
		(err, result:any) => {
		   if(err){
			   console.log(err);
			   res.send({message : "error"})
		   }else if (result?.length === 1){
            studenDetails =  {student : result[result?.length - 1], number_of_students : result.length}

           body = 
           ` <div style="width:80%; margin:auto">
           <div style="text-align:center; border-bottom-left-radius:40px;
           border-bottom-right-radius:40px;background: linear-gradient(245.75deg, #FFEBF8 -2.86%, #EAE1FF 103.21%)">
               <div ><img src="https://smartle-video-content.s3.amazonaws.com/smartle-logo/smartlelogo1.png" width="150px" style="text-align:center;margin:auto; justify-content:'center"/></div>
               <div> 
                   <p style="font-size:16px; font-weight:800; margin-top:-20px; padding-bottom:50px">Smartle cares about your child’s privacy</p>
               </div>
           </div>
           <div style="width:90%; margin:auto">
           <p style="margin-top:10px; font-size:14px">Thanks for signing up for Smartle.</p>
           <p style="margin-top:10px; font-size:14px">We are excited you’ve joined our community of learners, and want to impress upon you that we care deeply about your child’s privacy rights. In addition to our broader privacy statement, we’ve added specific measures to further safeguard the rights of children under 13, which are set forth below. These measures also appear on our website under the Children’s Privacy Notice section of our Privacy tab.</p>
           <p style="margin-top:10px; font-size:14px; color:#917EBD"><span style="font-weight:800" >Contact Us:</span> If you have questions or comments about Smartle’s data collection practices concerning your Child, please review our Privacy Policy, at smartle.co/privacy.<br><br>
   
   <span style="color:#917EBD; font-weight:800">You can also contact us at: talk2us@smartle.co</span></p>
     
           </div>
       </div>`

       emailService(emailTo, body, subject).then((val) => {
        console.log(val)
        res.send("Email Sent Sucessfully")
    }).catch((err: any) => {
        res.send("Error" + err)
    })
		   }else{
            res.send("Congratualtions")
           }

	   })
  
	  } catch (error) {
		  res.status(404).json( {message : 'Error'} )
	  }
});


export const enrollCourseEmailService  = ((req: Request, res: Response) => {

    const {emailTo, studentName, courseId} = req.body

    let courseDetails : any;

    let body : any;

    let subject:any;

    try {
		
		db.query(`SELECT * FROM course WHERE course_id = ?`, [courseId],
		(err, result:any) => {
		   if(err){
			   console.log(err);
			   res.send({message : "error"})
		   }else{
            courseDetails =  result;
            subject = `Congratulations, ${studentName.split(' ').slice(0,1).join(' ')}. You are enrolled in ${courseDetails[0]?.course_name}`;
           body = 

          `<div style="width:80%; margin:auto">
          <div style=" border-bottom-left-radius:40px;
          border-bottom-right-radius:40px;background: linear-gradient(245.75deg, #FFEBF8 -2.86%, #EAE1FF 103.21%)">
              <div style="margin-left:20px; padding-top:30px"><img src="https://smartle-video-content.s3.amazonaws.com/smartle-logo/smartleblacklogo.png" width="150px" /></div>
              <div> 
                         <p style="color:#917EBD; font-size:20px; font-weight:900;margin-left:20px;margin-top:20px;">Congratulations ${studentName.split(' ').slice(0,1).join(' ')} !!</p>
                  <p style="font-size:16px; font-weight:500;margin-left:20px;padding-bottom:20px; color:black ">You are enrolled in ${courseDetails[0]?.course_name}</p>
       
              </div>
          </div>
          <div style="width:90%; margin:auto">
          <p style="margin-top:10px; font-size:14px">You’re enrolled in ${courseDetails[0]?.course_name} <br><br>
  
  We are excited you've decided to pursue your learning journey with us. We are excited to have you in our midst. Head on over to your course and start your learning streak now!
  
  </p>
          <div style="margin-top:50px; text-align:center"><a href='www.dev.smartle.co' target="_blank" style="color:white; font-size: 18px;font-weight:800; text-decoration:none;text-align:center;margin:auto;padding:5px 30px 5px 30px;color:white;background: #917EBD;box-shadow:0px 8px 20px rgba(0, 0, 0, 0.1);border-radius: 10px">Begin Learning</a></div>
          </div>
      </div>`

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
    console.log(req.body);
    const {emailTo, studentName, courseId} = req.body

    let courseDetails : any;

    let body : any;

   let subject:any;


    try {
		
		db.query(`SELECT * FROM course WHERE course_id = ?`, [courseId],
		(err, result:any) => {
		   if(err){
			   console.log(err);
			   res.send({message : "error"})
		   }else{
            courseDetails =  result;
             subject = `Congratulations, ${studentName.split(' ').slice(0,1).join(' ')}. You are enrolled in Trial for ${courseDetails[0]?.course_name}`;
           body = 
           `      <div style="width:80%; margin:auto">
           <div style=" border-bottom-left-radius:40px;
           border-bottom-right-radius:40px;background: linear-gradient(245.75deg, #FFEBF8 -2.86%, #EAE1FF 103.21%)">
               <div style="margin-left:20px; padding-top:30px"><img src="https://smartle-video-content.s3.amazonaws.com/smartle-logo/smartleblacklogo.png" width="150px" /></div>
               <div> 
                          <p style="color:#917EBD; font-size:20px; font-weight:900;margin-left:20px;margin-top:20px;">Congratulations ${studentName.split(' ').slice(0,1).join(' ')} !!</p>
 
                   <p style="font-size:16px; font-weight:500;margin-left:20px;padding-bottom:20px; color:black ">Welcome to ${courseDetails[0]?.course_name} Trial Course</p>
 
               </div>
           </div>
           <div style="width:90%; margin:auto">
 
           <p style="margin-top:10px; font-size:16px">You’re enrolled in ${courseDetails[0]?.course_name} trial course<br><br>
   
 We are excited you've decided to pursue your learning journey with us. We are excited to have you in our midst. Head on over to your course and start your learning streak now!
   
   </p>
            <div style="color:917EBD;font-size:14px">On subscribing the entire course, you can also view your course schedule in the calendar section in your customized learning page.</div>
           <div style="margin-top:50px; text-align:center"><a href='www.dev.smartle.co' target="_blank" style="color:white; font-size: 18px;font-weight:800; text-decoration:none;text-align:center;margin:auto;padding:5px 30px 5px 30px;color:white;background: #917EBD;box-shadow:0px 8px 20px rgba(0, 0, 0, 0.1);border-radius: 10px">Begin Learning</a></div>
           </div>
  
       </div>`

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


export const contactUs = ((req: Request, res: Response) => {

    const {name, email, contactno, message, contacting_as} = req.body
    
    db.query(`INSERT INTO smartle.contactus (name, email, contactno, message, contacting_as) VALUES(?,?,?,?,?)`, [name, email, contactno, message, contacting_as], (err: any, result: any) =>{
        if(err){
            console.log(err);
        }
    });

    const subject = `User Contacted Smartle:`

    const body = `

        <h1>User has Contacted Smartle</h1>
        <h2>Name: ${name}</h2>
        <h2>Email: ${email}</h2>
        <h2>Contact-No: ${contactno}</h2>
        <h2>Contact-As: ${contacting_as}</h2>
        <h2>Message: ${message}</h2>
    `


    emailService("adeeb.shah@smartle.co", body, subject).then((val) => {
        console.log(val)
        res.send("Email Sent Sucessfully")
    }).catch((err: any) => {
        res.send("Error" + err)
    })
    
});

export const registerIntrest = ((req: Request, res: Response) => {

    const {course_name,  course_type, course_age, user_email, course_id} = req.body

    var today = new Date();

    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();

    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

    var dateTime = date+' '+time;
    
    db.query(`INSERT INTO smartle.registred_interest (course_name,  course_type, course_age, user_email, course_id, date_and_time) VALUES(?,?,?,?,?,?)`, [course_name, course_type, course_age, user_email, course_id, dateTime], (err: any, result: any) =>{
        if(err){
            console.log(err);
        }
    });

    const subject = `Course Interest Smartle:`

    const body = `

        <h1>User has Registred Intrested in a Course at Smartle</h1>
        <h2>Course: ${course_name}</h2>
        <h2>Type: ${course_type}</h2>
        <h2>Age-Group: ${course_age}</h2>
        <h2>User E-mail: ${user_email}</h2>
        <h2>Date and Time: ${dateTime}</h2>
    `


    emailService("adeeb.shah@smartle.co", body, subject).then((val) => {
        console.log(val)
        res.send("Email Sent Sucessfully")
    }).catch((err: any) => {
        res.send("Error" + err)
    })
    
});



