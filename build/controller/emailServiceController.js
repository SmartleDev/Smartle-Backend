"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addLearnerEmailService = exports.accountCreationEmailService = void 0;
const config_1 = __importDefault(require("../config/config"));
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const ses = new aws_sdk_1.default.SES({
    apiVersion: "2022-05-09",
    accessKeyId: 'AKIA3V6IJEBBECRZI36R',
    secretAccessKey: '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',
    region: 'ap-south-1'
});
const emailService = (emailTo, body, subject) => {
    const params = {
        Destination: {
            ToAddresses: [emailTo]
        },
        Message: {
            Body: {
                // Text : {
                //     Data : "Trial Run for the SES" + body
                // },
                Html: {
                    Data: body
                }
            },
            Subject: {
                Data: `${subject}`
            }
        },
        Source: "adeeb.shah@smartle.co"
    };
    return ses.sendEmail(params).promise();
};
exports.accountCreationEmailService = ((req, res) => {
    const { emailTo } = req.body;
    const subject = `Account Creation:`;
    const body = `
    <h1 style = 'color : blue'>Welcome To Smartle!!!</h1>

   <h3> Your account has been successfully created at Smartle.co!
    Let's add learners by using the link below .
    </h3>
    <i>www.dev.smartle.co/learner</i>

    <h4>You can contact us at: <i>talk2us@smartle.co</i> or reply to this email.</h4>
    
    <h2>Happy Learning!!</h2>
    `;
    emailService(emailTo, body, subject).then((val) => {
        console.log(val);
        res.send("Email Sent Sucessfully");
    }).catch((err) => {
        res.send("Error" + err);
    });
});
exports.addLearnerEmailService = ((req, res) => {
    const { emailTo, parentId } = req.body;
    let studenDetails;
    let body;
    const subject = `Learner Added`;
    try {
        config_1.default.query(`SELECT * FROM student WHERE parent_id = ?`, [parentId], (err, result) => {
            var _a, _b, _c;
            if (err) {
                console.log(err);
                res.send({ message: "error" });
            }
            else {
                studenDetails = { student: result[(result === null || result === void 0 ? void 0 : result.length) - 1], number_of_students: result.length };
                body = `

            <h1 style = 'color : green'>Congratulations!</h1>
        
             <h3>You have successfully added your ${studenDetails === null || studenDetails === void 0 ? void 0 : studenDetails.number_of_students} learner
             <br> 
             Name :  ${(_a = studenDetails === null || studenDetails === void 0 ? void 0 : studenDetails.student) === null || _a === void 0 ? void 0 : _a.student_name} <br>
             Gender : ${(_b = studenDetails === null || studenDetails === void 0 ? void 0 : studenDetails.student) === null || _b === void 0 ? void 0 : _b.student_gender} <br>
             Age : ${(_c = studenDetails === null || studenDetails === void 0 ? void 0 : studenDetails.student) === null || _c === void 0 ? void 0 : _c.student_age}.
             <br>
            You can explore different courses to begin your learning journey with us using the link below:</h3>
            <i>www.dev.smartle.co/courses</i>
            <h4>In case of any query, you can contact us at: <i>talk2us@smartle.co</i> or reply to this email.</h3>`;
            }
            emailService(emailTo, body, subject).then((val) => {
                console.log(val);
                res.send("Email Sent Sucessfully");
            }).catch((err) => {
                res.send("Error" + err);
            });
        });
    }
    catch (error) {
        res.status(404).json({ message: 'Error' });
    }
});
