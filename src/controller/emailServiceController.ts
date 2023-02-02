import express, { Request, Response } from 'express';
import db from '../config/config';
import aws from 'aws-sdk';
import dotenv from 'dotenv';
import moment from 'moment';
const promisePool = db.promise();
dotenv.config();

const ses = new aws.SES({
  apiVersion: '2022-05-09',
  accessKeyId: process.env.ACCESSKEY,
  secretAccessKey: process.env.SECRETKEY,
  region: process.env.REGION,
});

const emailService = (emailTo: any, body: any, subject: any) => {
  const params: any = {
    Destination: {
      ToAddresses: [emailTo],
    },

    Message: {
      Body: {
        // Text : {
        //     Data : "Trial Run for the SES" + body
        // },
        Html: {
          Data: body,
        },
      },
      Subject: {
        Data: `${subject}`,
      },
    },
    Source: 'notifications@smartle.co',
  };

  return ses.sendEmail(params).promise();
};

export const accountCreationEmailService = (req: Request, res: Response) => {
  const { emailTo, parentname } = req.body;
  console.log(parentname);

  const subject = `We are glad you are here, ${parentname
    .split(' ')
    .slice(0, 1)
    .join(' ')}`;

  const body = `
    
    <div style="width:80%; margin:auto">
        <div style="text-align:center; border-bottom-left-radius:40px;
        border-bottom-right-radius:40px;background: linear-gradient(245.75deg, #FFEBF8 -2.86%, #EAE1FF 103.21%)">
            <div ><img src="https://smartle-video-content.s3.amazonaws.com/smartle-logo/smartlelogo1.png" width="150px" style="text-align:center;margin:auto; justify-content:'center"/></div>
            <div> 
                <p style="font-size:16px; font-weight:500; margin-top:-20px">We are glad you are here, ${parentname
                  .split(' ')
                  .slice(0, 1)
                  .join(' ')}</p>
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
    `;

  emailService(emailTo, body, subject)
    .then((val) => {
      //console.log(val)
      res.send('Email Sent Sucessfully');
    })
    .catch((err: any) => {
      res.send('Error' + err);
    });
};

export const addLearnerEmailService = async (req: Request, res: Response) => {
  const { emailTo, parentId } = req.body;

  let studenDetails: any;

  let body: any;

  const subject = `Smartle cares about your child’s privacy`;

  try {
    const [rows]: any = await promisePool.query(
      `SELECT * FROM student WHERE parent_id = ?`,
      [parentId]
    );
    if (rows?.length === 1) {
      studenDetails = {
        student: rows[rows?.length - 1],
        number_of_students: rows.length,
      };

      body = ` <div style="width:80%; margin:auto">
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
       </div>`;

      emailService(emailTo, body, subject)
        .then((val) => {
          console.log(val);
          res.send('Email Sent Sucessfully');
        })
        .catch((err: any) => {
          res.send('Error' + err);
        });
    } else {
      res.send('Congratualtions');
    }
  } catch (error) {
    res.status(404).json({ message: 'Error' });
  }
};

export const enrollCourseEmailService = async (req: Request, res: Response) => {
  const { emailTo, studentName, courseId } = req.body;

  let courseDetails: any;

  let body: any;

  let subject: any;

  try {
    const [result]: any = await promisePool.query(
      `SELECT * FROM course WHERE course_id = ?`,
      [courseId]
    );
    if (result.length !== 0) {
      courseDetails = result;
      subject = `Congratulations, ${studentName
        .split(' ')
        .slice(0, 1)
        .join(' ')}. You are enrolled in ${courseDetails[0]?.course_name}`;
      body = `<div style="width:80%; margin:auto">
          <div style=" border-bottom-left-radius:40px;
          border-bottom-right-radius:40px;background: linear-gradient(245.75deg, #FFEBF8 -2.86%, #EAE1FF 103.21%)">
              <div style="margin-left:20px; padding-top:30px"><img src="https://smartle-video-content.s3.amazonaws.com/smartle-logo/smartleblacklogo.png" width="150px" /></div>
              <div> 
                         <p style="color:#917EBD; font-size:20px; font-weight:900;margin-left:20px;margin-top:20px;">Congratulations ${studentName
                           .split(' ')
                           .slice(0, 1)
                           .join(' ')} !!</p>
                  <p style="font-size:16px; font-weight:500;margin-left:20px;padding-bottom:20px; color:black ">You are enrolled in ${
                    courseDetails[0]?.course_name
                  }</p>
       
              </div>
          </div>
          <div style="width:90%; margin:auto">
          <p style="margin-top:10px; font-size:14px">You’re enrolled in ${
            courseDetails[0]?.course_name
          } <br><br>
  
  We are excited you've decided to pursue your learning journey with us. We are excited to have you in our midst. Head on over to your course and start your learning streak now!
  
  </p>
          <div style="margin-top:50px; text-align:center"><a href='www.dev.smartle.co' target="_blank" style="color:white; font-size: 18px;font-weight:800; text-decoration:none;text-align:center;margin:auto;padding:5px 30px 5px 30px;color:white;background: #917EBD;box-shadow:0px 8px 20px rgba(0, 0, 0, 0.1);border-radius: 10px">Begin Learning</a></div>
          </div>
      </div>`;
    }

    emailService(emailTo, body, subject)
      .then((val) => {
        console.log(val);
        res.send('Email Sent Sucessfully');
      })
      .catch((err: any) => {
        res.send('Error' + err);
      });
  } catch (error) {
    res.status(404).json({ message: 'Error' });
  }
};

export const enrollTrialCourseEmailService = async (
  req: Request,
  res: Response
) => {
  console.log(req.body);
  const { emailTo, studentName, courseId } = req.body;

  let courseDetails: any;

  let body: any;

  let subject: any;

  try {
    const [result]: any = await promisePool.query(
      `SELECT * FROM course WHERE course_id = ?`,
      [courseId]
    );
    if (result.length !== 0) {
      courseDetails = result;
      subject = `Congratulations, ${studentName
        .split(' ')
        .slice(0, 1)
        .join(' ')}. You are enrolled in Trial for ${
        courseDetails[0]?.course_name
      }`;
      body = `      <div style="width:80%; margin:auto">
           <div style=" border-bottom-left-radius:40px;
           border-bottom-right-radius:40px;background: linear-gradient(245.75deg, #FFEBF8 -2.86%, #EAE1FF 103.21%)">
               <div style="margin-left:20px; padding-top:30px"><img src="https://smartle-video-content.s3.amazonaws.com/smartle-logo/smartleblacklogo.png" width="150px" /></div>
               <div> 
                          <p style="color:#917EBD; font-size:20px; font-weight:900;margin-left:20px;margin-top:20px;">Congratulations ${studentName
                            .split(' ')
                            .slice(0, 1)
                            .join(' ')} !!</p>
 
                   <p style="font-size:16px; font-weight:500;margin-left:20px;padding-bottom:20px; color:black ">Welcome to ${
                     courseDetails[0]?.course_name
                   } Trial Course</p>
 
               </div>
           </div>
           <div style="width:90%; margin:auto">
 
           <p style="margin-top:10px; font-size:16px">You’re enrolled in ${
             courseDetails[0]?.course_name
           } trial course<br><br>
   
 We are excited you've decided to pursue your learning journey with us. We are excited to have you in our midst. Head on over to your course and start your learning streak now!
   
   </p>
            <div style="color:917EBD;font-size:14px">On subscribing the entire course, you can also view your course schedule in the calendar section in your customized learning page.</div>
           <div style="margin-top:50px; text-align:center"><a href='www.dev.smartle.co' target="_blank" style="color:white; font-size: 18px;font-weight:800; text-decoration:none;text-align:center;margin:auto;padding:5px 30px 5px 30px;color:white;background: #917EBD;box-shadow:0px 8px 20px rgba(0, 0, 0, 0.1);border-radius: 10px">Begin Learning</a></div>
           </div>
  
       </div>`;
    }

    emailService(emailTo, body, subject)
      .then((val) => {
        console.log(val);
        res.send('Email Sent Sucessfully');
      })
      .catch((err: any) => {
        res.send('Error' + err);
      });
  } catch (error) {
    res.status(404).json({ message: 'Error' });
  }
};

export const contactUs = async (req: Request, res: Response) => {
  const { name, email, contactno, message, contacting_as } = req.body;

  const [result]: any = await promisePool.query(
    `INSERT INTO smartle.contactus (name, email, contactno, message, contacting_as) VALUES(?,?,?,?,?)`,
    [name, email, contactno, message, contacting_as]
  );

  const subject = `User Contacted Smartle:`;

  const body = `

        <h1>User has Contacted Smartle</h1>
        <h2>Name: ${name}</h2>
        <h2>Email: ${email}</h2>
        <h2>Contact-No: ${contactno}</h2>
        <h2>Contact-As: ${contacting_as}</h2>
        <h2>Message: ${message}</h2>
    `;

  emailService('adeeb.shah@smartle.co', body, subject)
    .then((val) => {
      console.log(val);
      res.send('Email Sent Sucessfully');
    })
    .catch((err: any) => {
      res.send('Error' + err);
    });
};

export const registerIntrest = async (req: Request, res: Response) => {
  const { course_name, course_type, course_age, user_email, course_id } =
    req.body;

  var today = new Date();

  var date =
    today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();

  var time =
    today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();

  var dateTime = date + ' ' + time;

  const [rows]: any = await promisePool.query(
    `INSERT INTO smartle.registred_interest (course_name,  course_type, course_age, user_email, course_id, date_and_time) VALUES(?,?,?,?,?,?)`,
    [course_name, course_type, course_age, user_email, course_id, dateTime]
  );

  const subject = `Course Interest Smartle:`;

  const body = `

        <h1>User has Registred Intrested in a Course at Smartle</h1>
        <h2>Course: ${course_name}</h2>
        <h2>Type: ${course_type}</h2>
        <h2>Age-Group: ${course_age}</h2>
        <h2>User E-mail: ${user_email}</h2>
        <h2>Date and Time: ${dateTime}</h2>
    `;

  emailService('adeeb.shah@smartle.co', body, subject)
    .then((val) => {
      console.log(val);
      res.send('Email Sent Sucessfully');
    })
    .catch((err: any) => {
      res.send('Error' + err);
    });
};

export const CourseInvoice = async (req: Request, res: Response) => {
  const { emailTo, courseId, studentId } = req.body;

  let invoiceDetails: any;

  let body: any;

  let subject: any;
  let enrollmenntData: any;

  try {
    const [result]: any = await promisePool.query(
      `SELECT *
      FROM payment WHERE payment.payment_student_id = ?`,
      [studentId]
    );
    try {
      const [enrollment]: any = await promisePool.query(
        `SELECT * FROM smartle.enrollment INNER JOIN course ON course.course_id = enrollment.course_id WHERE enrollment.student_id = ? AND enrollment.course_id = ?`,
        [studentId, courseId]
      );
      enrollmenntData = enrollment[enrollment.length - 1];
    } catch (sqlError) {
      console.log(sqlError);
    }

    invoiceDetails = result[result.length - 1];
    //console.log(invoiceDetails);
    subject = `Payment Invoce Smartle.Co`;
    body = `<!DOCTYPE html>
    <html lang="en">
        <head>
            <meta charset="UTF-8" />
            <meta http-equiv="X-UA-Compatible" content="IE=edge" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <link
              rel="stylesheet"
              href="https://cdn.jsdelivr.net/npm/bootstrap@3.3.7/dist/css/bootstrap.min.css"
              integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u"
              crossorigin="anonymous"
            />
            <link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Poppins&display=swap" rel="stylesheet">
            <link
              rel="stylesheet"
              href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.0/css/all.min.css"
              integrity="sha512-xh6O/CkQoPOWDdYTDqeRdPCVd1SpvCA9XXcUnZS2FmJNp1coAFzvtCN9BmamE+4aHK8yyUHUSCcJHgXloTyT2A=="
              crossorigin="anonymous"
              referrerpolicy="no-referrer"
            />
          </head>
          <body>
            <div class="card" style="background-color:#DFD1E7;margin-top:40px;border-radius:20px;margin-left:auto;margin-right:auto;width: 70%;box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;">
              <div class="card-header bg-black"></div>
              <div class="card-body">
                <div style = 'padding:20px 50px 30px 100px;'>
                  <div class="row" style="display: flex; justify-content: center;margin-top:50px">
                    <div class="col-xl-12">
                      <img
                      style = 'margin-right: 300px;'
                        src="https://smartle-video-content.s3.amazonaws.com/smartle-logo/smartleblacklogo.png"
                        alt=""
                        height="50px"
                        srcset=""
                      />
                    </div>
                  </div>
        
                  <div class="row">
                    <div class="col-xl-12">
                      <ul class="list-unstyled float-end">
                        <!-- <li style="font-size: 30px; color: #735aac">Smartle.Co</li> -->
                        <li>123, Elm Street</li>
                        <li>123-456-789</li>
                        <li>talk2us@smartle.co</li>
                      </ul>
                    </div>
                  </div>
        
                  <div class="row text-center">
                    <h3
                      style="font-size: 40px; color: #735aac; text-align: center;"
                    >
                    <img src="https://smartle-video-content.s3.amazonaws.com/Email+Images/invoice.png" width="60px" alt="" style="color:#735aac">
                      Invoice
                    </h3>
                  </div>
        
                  <div style = 'box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;display: flex; justify-content: center;padding-bottom: 50px;overflow-x:auto;'>
                  <table style = 'box-shadow:rgba(0, 0, 0, 0.35) 0px 5px 15px;font-size:20px;border-radius: 20px;width: 80%;text-align: center;border-spacing: 30px;'>
                    <thead>
                      <tr style = 'border:2px solid grey; padding: 20px; height: 50px;border-spacing: 30px;background-color: #735aac;color: #DFD1E7;'>
                        <th scope="col" style = 'padding: 15px;'>Description</th>
                        <th scope="col" style = 'padding: 15px;'>Quantity</th>
                        <th scope="col" style = 'padding: 15px;'>Amount</th>
                        <th scope="col" style = 'padding: 15px;'>Mode</th>
                        <th scope="col" style = 'padding: 15px;'>Curreny</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr style = 'border: 2px solid #735aac;'>
                        <td>${enrollmenntData?.course_name}</td>
                        <td>1</td>
                        <td style = 'padding: 15px;'><i class="fa-solid fa-indian-rupee-sign"></i> ${invoiceDetails?.payment_amount}</td>
                        <td style = 'padding: 15px;'>${invoiceDetails?.payment_mode.toUpperCase()}</td>
                        <td style = 'padding: 15px;'>${invoiceDetails?.payment_currency.toUpperCase()}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                  <div class="row">
                    <div class="col-xl-8">
                      <ul class="list-unstyled float-end me-0">
                        <!-- <li>
                          <span class="me-3 float-start">Total Amount:</span
                          ><i class="fa-solid fa-indian-rupee-sign"></i> 6850,00
                        </li>
                        <li>
                          <span class="me-5">Discount:</span
                          ><i class="fa-solid fa-indian-rupee-sign"></i> 500,00
                        </li>
                        <li>
                          <span class="float-start" style="margin-right: 35px"
                            >Shippment: </span
                          ><i class="fa-solid fa-indian-rupee-sign"></i> 500,00
                        </li>
                      </ul>
                    </div>
                  </div>
                  <hr />
                  <div class="row">
                    <div class="col-xl-8" style="margin-left: 60px">
                      <p
                        class="float-end"
                        style="
                          font-size: 30px;
                          color: #735aac;
                          font-weight: 400;
                          font-family: Arial, Helvetica, sans-serif;
                        "
                      >
                        Total:
                        <span
                          ><i class="fa-solid fa-indian-rupee-sign"></i> 6350,00</span
                        >
                      </p>
                    </div>
                  </div> -->
        
                  <div class="row mt-2 mb-5">
                    <p class="fw-bold">
                      Date: <span class="text-muted">${invoiceDetails?.payment_dateandtime}
                    </p>
                    <p class="fw-bold mt-3">Signature:</p>
                  </div>
                </div>
              </div>
              <div class="card-footer bg-black"></div>
            </div>
          </body>
    </html>`;

    emailService(emailTo, body, subject)
      .then((val) => {
        console.log(val);
        res.send('Email Sent Sucessfully');
      })
      .catch((err: any) => {
        res.send('Error' + err);
      });
  } catch (error) {
    res.status(404).json({ message: 'Error' });
  }
};
